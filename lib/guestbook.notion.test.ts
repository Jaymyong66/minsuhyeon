import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createEntry,
  listEntries,
  createPhotoEntry,
  isRetryable,
  retryDelayMs,
} from './guestbook.notion'

const originalFetch = global.fetch

describe('guestbook.notion', () => {
  beforeEach(() => {
    vi.stubEnv('NOTION_TOKEN', 'test-token')
    vi.stubEnv('NOTION_DATABASE_ID', 'test-db-id')
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.unstubAllEnvs()
    vi.useRealTimers()
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

  it('속도 제한을 만나면 Retry-After 만큼 기다렸다 다시 건다', async () => {
    // 노션은 커넥션당 초당 3회 제한인데 사진 한 장이 3회를 쓴다.
    // 재시도가 없으면 여러 장 올릴 때 중간부터 실패한다.
    vi.useFakeTimers()
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: { get: () => '1' },
        json: async () => ({ message: 'rate limited' }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    global.fetch = fetchMock as unknown as typeof fetch

    const pending = createEntry({ name: '홍길동', message: '축하합니다!' })
    await vi.advanceTimersByTimeAsync(1000)
    await pending

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('재시도해도 계속 막히면 포기하고 실패시킨다', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: { get: () => '1' },
      json: async () => ({ message: 'rate limited' }),
    })
    global.fetch = fetchMock as unknown as typeof fetch

    const pending = createEntry({ name: '홍길동', message: '축하' })
    const assertion = expect(pending).rejects.toThrow()
    await vi.advanceTimersByTimeAsync(10_000)
    await assertion

    // 무한정 매달리지 않고 정해진 횟수만 시도한다
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it('400 같은 오류는 재시도하지 않는다', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => null },
      json: async () => ({ message: 'bad request' }),
    })
    global.fetch = fetchMock as unknown as typeof fetch

    await expect(createEntry({ name: '홍길동', message: '축하' })).rejects.toThrow()
    expect(fetchMock).toHaveBeenCalledTimes(1)
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

describe('재시도 판정', () => {
  it('429(속도 제한)와 529(과부하)만 다시 건다', () => {
    expect(isRetryable(429)).toBe(true)
    expect(isRetryable(529)).toBe(true)
    for (const status of [200, 400, 401, 403, 404, 500]) {
      expect(isRetryable(status)).toBe(false)
    }
  })

  it('Retry-After 를 초 단위로 읽는다', () => {
    expect(retryDelayMs('2', 0)).toBe(2000)
  })

  it('Retry-After 가 없거나 이상하면 점점 늘려 기다린다', () => {
    expect(retryDelayMs(null, 0)).toBe(500)
    expect(retryDelayMs('', 1)).toBe(1000)
    expect(retryDelayMs('알 수 없음', 2)).toBe(2000)
  })

  it('아무리 길어도 상한을 둔다', () => {
    // 노션이 큰 값을 주더라도 하객을 무한정 기다리게 할 수는 없다
    expect(retryDelayMs('600', 0)).toBe(10_000)
    expect(retryDelayMs(null, 99)).toBe(4_000)
  })
})
