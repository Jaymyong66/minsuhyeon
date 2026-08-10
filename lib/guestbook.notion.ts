export interface GuestbookEntry {
  id: string
  name: string
  message: string
  createdAt: string
}

function getConfig() {
  const token = process.env.NOTION_TOKEN
  const databaseId = process.env.NOTION_DATABASE_ID
  if (!token || !databaseId) {
    throw new Error('NOTION_TOKEN / NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.')
  }
  return { token, databaseId }
}

function notionHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  }
}

/** 재시도해도 되는 응답. 429 는 속도 제한, 529 는 노션 과부하로 둘 다 잠시 뒤 다시 걸면 된다 */
export function isRetryable(status: number): boolean {
  return status === 429 || status === 529
}

/** Retry-After 는 초 단위 정수다. 없거나 이상하면 기본값을 쓴다 */
export function retryDelayMs(header: string | null, attempt: number): number {
  const seconds = Number(header)
  if (Number.isFinite(seconds) && seconds > 0) return Math.min(seconds * 1000, 10_000)
  return Math.min(500 * 2 ** attempt, 4_000)
}

const MAX_ATTEMPTS = 4

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/*
 * 노션은 커넥션당 평균 초당 3회로 제한한다.
 * 사진 한 장을 올리는 데 3번(업로드 생성 -> 전송 -> 행 생성)을 쓰므로,
 * 여러 장을 연달아 올리면 제한에 닿는다. 429/529 는 Retry-After 를 지켜 다시 건다.
 */
async function notionFetch(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, init)
    if (!isRetryable(res.status) || attempt >= MAX_ATTEMPTS - 1) return res
    await sleep(retryDelayMs(res.headers?.get?.('Retry-After') ?? null, attempt))
  }
}

export async function createEntry(input: { name: string; message: string }): Promise<void> {
  const { token, databaseId } = getConfig()

  const res = await notionFetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: notionHeaders(token),
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: input.name } }] },
        Message: { rich_text: [{ text: { content: input.message } }] },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`Notion API 오류 (${res.status}): ${body.message ?? '알 수 없는 오류'}`)
  }
}

/**
 * 사진 한 장을 노션에 올리고 file_upload id 를 돌려준다.
 * 올리기만 하면 1시간 뒤 사라지므로, 곧바로 페이지에 붙여야 한다.
 */
export async function uploadPhoto(input: {
  data: Buffer
  filename: string
  contentType: string
}): Promise<string> {
  const { token } = getConfig()

  const created = await notionFetch('https://api.notion.com/v1/file_uploads', {
    method: 'POST',
    headers: notionHeaders(token),
    body: JSON.stringify({ filename: input.filename, content_type: input.contentType }),
  })
  if (!created.ok) {
    const body = await created.json().catch(() => ({}))
    throw new Error(`Notion 업로드 생성 실패 (${created.status}): ${body.message ?? '알 수 없는 오류'}`)
  }
  const { id, upload_url } = await created.json()

  const form = new FormData()
  form.append('file', new Blob([new Uint8Array(input.data)], { type: input.contentType }), input.filename)

  // multipart 경계는 fetch 가 정해야 하므로 Content-Type 을 직접 넣지 않는다
  const sent = await notionFetch(upload_url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
    },
    body: form,
  })
  if (!sent.ok) {
    const body = await sent.json().catch(() => ({}))
    throw new Error(`Notion 업로드 전송 실패 (${sent.status}): ${body.message ?? '알 수 없는 오류'}`)
  }

  return id
}

/** 사진 항목을 만든다. 방명록과 같은 DB 를 쓰되 Message 는 비워 둔다. */
export async function createPhotoEntry(input: {
  name: string
  fileUploadId: string
  filename: string
}): Promise<void> {
  const { token, databaseId } = getConfig()

  const res = await notionFetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: notionHeaders(token),
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: input.name } }] },
        Photo: {
          files: [
            {
              name: input.filename,
              type: 'file_upload',
              file_upload: { id: input.fileUploadId },
            },
          ],
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`Notion API 오류 (${res.status}): ${body.message ?? '알 수 없는 오류'}`)
  }
}

export async function listEntries(): Promise<GuestbookEntry[]> {
  const { token, databaseId } = getConfig()

  const res = await notionFetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: notionHeaders(token),
    body: JSON.stringify({
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`Notion API 오류 (${res.status}): ${body.message ?? '알 수 없는 오류'}`)
  }

  const data = await res.json()

  return data.results
    .map((page: any) => ({
      id: page.id,
      name: page.properties.Name.title[0]?.plain_text ?? '',
      message: page.properties.Message.rich_text[0]?.plain_text ?? '',
      createdAt: page.created_time,
    }))
    /*
     * 사진 항목은 같은 DB 에 Message 없이 들어오므로 축하 메시지 목록에서 뺀다.
     * 빈 카드로 보이는 것도 문제지만, 업로드가 로그인 없이 열려 있어서
     * 올라온 이미지가 곧바로 청첩장에 노출되면 손쓸 방법이 없다.
     * 사진은 노션에 모으고, 사이트에는 글만 보여준다.
     */
    .filter((entry: GuestbookEntry) => entry.message.trim().length > 0)
}
