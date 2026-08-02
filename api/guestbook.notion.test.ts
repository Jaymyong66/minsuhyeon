import { describe, it, expect, vi, afterEach } from 'vitest'
import { createEntry, listEntries } from './guestbook.notion'

const originalFetch = global.fetch
const testEnv = { NOTION_TOKEN: 'test-token', NOTION_DATABASE_ID: 'test-db-id' }

describe('guestbook.notion', () => {
  afterEach(() => {
    global.fetch = originalFetch
  })

  it('createEntry posts a new page to the Notion database', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    global.fetch = fetchMock as unknown as typeof fetch

    await createEntry({ name: '홍길동', message: '축하합니다!' }, testEnv)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.notion.com/v1/pages',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    )
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.parent).toEqual({ database_id: 'test-db-id' })
    expect(body.properties.Name.title[0].text.content).toBe('홍길동')
    expect(body.properties.Message.rich_text[0].text.content).toBe('축하합니다!')
  })

  it('createEntry throws when Notion responds with an error', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 400, json: async () => ({ message: 'bad request' }) }) as unknown as typeof fetch

    await expect(createEntry({ name: '홍길동', message: '축하합니다!' }, testEnv)).rejects.toThrow()
  })

  it('listEntries queries the database sorted by created time descending and maps results', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 'page-1',
            created_time: '2026-08-01T00:00:00.000Z',
            properties: {
              Name: { title: [{ plain_text: '홍길동' }] },
              Message: { rich_text: [{ plain_text: '축하합니다!' }] },
            },
          },
        ],
      }),
    })
    global.fetch = fetchMock as unknown as typeof fetch

    const entries = await listEntries(testEnv)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.notion.com/v1/databases/test-db-id/query',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(entries).toEqual([
      { id: 'page-1', name: '홍길동', message: '축하합니다!', createdAt: '2026-08-01T00:00:00.000Z' },
    ])
  })
})
