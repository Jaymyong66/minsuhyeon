export interface CalendarCell {
  date: number
  month: number
  isCurrentMonth: boolean
}

// month is 1-indexed (1 = January, 11 = November)
export function getCalendarGrid(year: number, month: number): CalendarCell[][] {
  const firstOfMonth = new Date(year, month - 1, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()

  const cells: CalendarCell[] = []

  for (let i = 0; i < startWeekday; i++) {
    cells.push({
      date: daysInPrevMonth - startWeekday + 1 + i,
      month: month - 1 || 12,
      isCurrentMonth: false,
    })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: d, month, isCurrentMonth: true })
  }

  while (cells.length < 42) {
    const nextDate = cells.length - (startWeekday + daysInMonth) + 1
    cells.push({ date: nextDate, month: (month % 12) + 1, isCurrentMonth: false })
  }

  const grid: CalendarCell[][] = []
  for (let i = 0; i < 6; i++) {
    grid.push(cells.slice(i * 7, i * 7 + 7))
  }
  return grid
}
