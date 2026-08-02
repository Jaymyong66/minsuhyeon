import { describe, it, expect } from 'vitest'
import { formatAccountForCopy } from './formatAccount'

describe('formatAccountForCopy', () => {
  it('formats bank and account number as "은행 계좌번호"', () => {
    expect(formatAccountForCopy('국민', '573101-01-562219')).toBe('국민 573101-01-562219')
  })
})
