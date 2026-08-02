import { describe, it, expect } from 'vitest'
import { getTimeRemaining } from './countdown'

describe('getTimeRemaining', () => {
  it('splits the remaining time into days/hours/minutes/seconds', () => {
    const target = new Date('2026-11-01T13:00:00+09:00')
    const now = new Date('2026-10-30T13:00:00+09:00') // 2 days before

    const result = getTimeRemaining(target, now)

    expect(result).toEqual({ days: 2, hours: 0, minutes: 0, seconds: 0, isPast: false })
  })

  it('computes partial days/hours/minutes/seconds correctly', () => {
    const target = new Date('2026-11-01T13:00:00+09:00')
    const now = new Date('2026-10-31T10:29:30+09:00') // 1d 2h 30m 30s before

    const result = getTimeRemaining(target, now)

    expect(result).toEqual({ days: 1, hours: 2, minutes: 30, seconds: 30, isPast: false })
  })

  it('marks isPast true and zeroes out fields once the target has passed', () => {
    const target = new Date('2026-11-01T13:00:00+09:00')
    const now = new Date('2026-11-01T13:00:01+09:00')

    const result = getTimeRemaining(target, now)

    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true })
  })
})
