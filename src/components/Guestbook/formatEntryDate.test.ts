import { describe, it, expect } from 'vitest'
import { formatEntryDate } from './formatEntryDate'

describe('formatEntryDate', () => {
  it('UTC 시각을 한국 시간 기준 날짜로 바꾼다', () => {
    // 2026-08-09T13:02Z = KST 2026-08-09 22:02
    expect(formatEntryDate('2026-08-09T13:02:00.000Z')).toBe('2026. 08. 09')
  })

  it('한국 시간으로 날짜가 넘어가면 다음 날로 표시한다', () => {
    // 2026-08-09T15:30Z = KST 2026-08-10 00:30
    expect(formatEntryDate('2026-08-09T15:30:00.000Z')).toBe('2026. 08. 10')
  })

  it('연말에도 해가 넘어간다', () => {
    // 2026-12-31T15:00Z = KST 2027-01-01 00:00
    expect(formatEntryDate('2026-12-31T15:00:00.000Z')).toBe('2027. 01. 01')
  })

  it('월/일을 두 자리로 채운다', () => {
    expect(formatEntryDate('2026-01-05T00:00:00.000Z')).toBe('2026. 01. 05')
  })

  it('잘못된 값이면 빈 문자열을 준다', () => {
    expect(formatEntryDate('')).toBe('')
    expect(formatEntryDate('어제')).toBe('')
  })
})
