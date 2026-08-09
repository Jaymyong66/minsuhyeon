import { describe, it, expect } from 'vitest'
import { validateGuestbookEntry } from './guestbook.validation'

describe('validateGuestbookEntry', () => {
  it('accepts a valid name and message', () => {
    const result = validateGuestbookEntry({ name: '홍길동', message: '축하합니다!' })
    expect(result).toEqual({ valid: true })
  })

  it('rejects an empty name', () => {
    const result = validateGuestbookEntry({ name: '  ', message: '축하합니다!' })
    expect(result).toEqual({ valid: false, error: 'name과 message는 필수입니다.' })
  })

  it('rejects an empty message', () => {
    const result = validateGuestbookEntry({ name: '홍길동', message: '' })
    expect(result).toEqual({ valid: false, error: 'name과 message는 필수입니다.' })
  })

  it('rejects a message longer than 300 characters', () => {
    const result = validateGuestbookEntry({ name: '홍길동', message: 'a'.repeat(301) })
    expect(result).toEqual({ valid: false, error: 'message는 300자를 넘을 수 없습니다.' })
  })

  it('rejects a name longer than 50 characters', () => {
    const result = validateGuestbookEntry({ name: 'a'.repeat(51), message: '축하합니다!' })
    expect(result).toEqual({ valid: false, error: 'name은 50자를 넘을 수 없습니다.' })
  })
})
