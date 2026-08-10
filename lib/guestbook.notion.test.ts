import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createEntry, listEntries, createPhotoEntry } from './guestbook.notion'

const originalFetch = global.fetch

describe('guestbook.notion', () => {
  beforeEach(() => {
    vi.stubEnv('NOTION_TOKEN', 'test-token')
    vi.stubEnv('NOTION_DATABASE_ID', 'test-db-id')
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.unstubAllEnvs()
  })

  it('createEntry posts a new page to the Notion database', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    global.fetch = fetchMock as unknown as typeof fetch

    await createEntry({ name: '홍길동', message: '축하합니다!' })

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

    await expect(createEntry({ name: '홍길동', message: '축하합니다!' })).rejects.toThrow()
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

    const entries = await listEntries()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.notion.com/v1/databases/test-db-id/query',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(entries).toEqual([
      { id: 'page-1', name: '홍길동', message: '축하합니다!', createdAt: '2026-08-01T00:00:00.000Z' },
    ])
  })

  it('listEntries 는 사진 항목을 내보내지 않는다', async () => {
    // 사진은 혼주만 노션에서 본다. 사이트로 새어 나가면 안 된다.
    // 업로드가 로그인 없이 열려 있어서, 노출되면 아무 이미지나 청첩장에 걸릴 수 있다.
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 'photo-row',
            created_time: '2026-08-02T00:00:00.000Z',
            properties: {
              Name: { title: [{ plain_text: '김하객' }] },
              Message: { rich_text: [] },
              Photo: { files: [{ name: 'a.jpg', file: { url: 'https://secret/a.jpg' } }] },
            },
          },
          {
            id: 'blank-message',
            created_time: '2026-08-02T00:00:00.000Z',
            properties: {
              Name: { title: [{ plain_text: '공백' }] },
              Message: { rich_text: [{ plain_text: '   ' }] },
            },
          },
          {
            id: 'real-message',
            created_time: '2026-08-01T00:00:00.000Z',
            properties: {
              Name: { title: [{ plain_text: '홍길동' }] },
              Message: { rich_text: [{ plain_text: '축하합니다!' }] },
            },
          },
        ],
      }),
    }) as unknown as typeof fetch

    const entries = await listEntries()

    expect(entries.map((e) => e.id)).toEqual(['real-message'])
    expect(JSON.stringify(entries)).not.toContain('secret')
  })

  it('createPhotoEntry 는 Message 를 비운 채 사진만 붙인다', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    global.fetch = fetchMock as unknown as typeof fetch

    await createPhotoEntry({ name: '김하객', fileUploadId: 'upload-1', filename: 'a.jpg' })

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.properties.Name.title[0].text.content).toBe('김하객')
    expect(body.properties.Photo.files[0].file_upload.id).toBe('upload-1')
    // Message 를 채우면 사이트 목록에 사진 항목이 뜨게 된다
    expect(body.properties.Message).toBeUndefined()
  })
})
