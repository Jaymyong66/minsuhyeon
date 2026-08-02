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

export async function createEntry(input: { name: string; message: string }): Promise<void> {
  const { token, databaseId } = getConfig()

  const res = await fetch('https://api.notion.com/v1/pages', {
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

export async function listEntries(): Promise<GuestbookEntry[]> {
  const { token, databaseId } = getConfig()

  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
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

  return data.results.map((page: any) => ({
    id: page.id,
    name: page.properties.Name.title[0]?.plain_text ?? '',
    message: page.properties.Message.rich_text[0]?.plain_text ?? '',
    createdAt: page.created_time,
  }))
}
