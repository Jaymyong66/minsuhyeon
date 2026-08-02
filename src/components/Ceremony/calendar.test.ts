import { describe, it, expect } from 'vitest'
import { getCalendarGrid } from './calendar'

describe('getCalendarGrid', () => {
  it('returns a 6x7 grid of dates covering the full month with leading/trailing days', () => {
    const grid = getCalendarGrid(2026, 11) // November 2026, starts on Sunday

    expect(grid).toHaveLength(6)
    grid.forEach((week) => expect(week).toHaveLength(7))

    // Nov 1, 2026 is a Sunday -> first cell of first week
    expect(grid[0][0]).toEqual({ date: 1, month: 11, isCurrentMonth: true })
    // Nov 30, 2026 is a Monday
    expect(grid[4][1]).toEqual({ date: 30, month: 11, isCurrentMonth: true })
  })

  it('marks days outside the target month as isCurrentMonth: false', () => {
    const grid = getCalendarGrid(2026, 11)
    const trailingCell = grid[4][2] // Dec 1
    expect(trailingCell.isCurrentMonth).toBe(false)
  })
})
