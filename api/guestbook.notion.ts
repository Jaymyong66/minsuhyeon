export interface GuestbookEntry {
  id: string
  name: string
  message: string
  createdAt: string
}

export interface NotionEnv {
  NOTION_TOKEN: string
  NOTION_DATABASE_ID: string
}

function notionHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  }
}

export async function createEntry(input: { name: string; message: string }, env: NotionEnv): Promise<void> {
  const { NOTION_TOKEN: token, NOTION_DATABASE_ID: databaseId } = env

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
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(`Notion API 오류 (${res.status}): ${body.message ?? '알 수 없는 오류'}`)
  }
}

export async function listEntries(env: NotionEnv): Promise<GuestbookEntry[]> {
  const { NOTION_TOKEN: token, NOTION_DATABASE_ID: databaseId } = env

  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: notionHeaders(token),
    body: JSON.stringify({
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    }),
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(`Notion API 오류 (${res.status}): ${body.message ?? '알 수 없는 오류'}`)
  }

  const data = (await res.json()) as { results: any[] }

  return data.results.map((page: any) => ({
    id: page.id,
    name: page.properties.Name.title[0]?.plain_text ?? '',
    message: page.properties.Message.rich_text[0]?.plain_text ?? '',
    createdAt: page.created_time,
  }))
}
