import styled from '@emotion/styled'
import { getCalendarGrid } from './calendar'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

const Table = styled.table`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  border-collapse: collapse;
  text-align: center;
`

const Weekday = styled.th`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.textMuted};
  padding: 4px;
`

const Cell = styled.td<{ isCurrentMonth: boolean; isTarget: boolean }>`
  padding: 6px 4px;
  font-size: 0.85rem;
  color: ${({ theme, isCurrentMonth }) => (isCurrentMonth ? theme.color.text : theme.color.border)};
  ${({ isTarget, theme }) =>
    isTarget &&
    `
      color: #fff;
      background: ${theme.color.accent};
      border-radius: 50%;
      font-weight: 700;
    `}
`

interface CalendarProps {
  year: number
  month: number
  targetDate: number
}

export function Calendar({ year, month, targetDate }: CalendarProps) {
  const grid = getCalendarGrid(year, month)

  return (
    <Table>
      <thead>
        <tr>
          {WEEKDAYS.map((w) => (
            <Weekday key={w}>{w}</Weekday>
          ))}
        </tr>
      </thead>
      <tbody>
        {grid.map((week, i) => (
          <tr key={i}>
            {week.map((cell, j) => (
              <Cell
                key={j}
                isCurrentMonth={cell.isCurrentMonth}
                isTarget={cell.isCurrentMonth && cell.date === targetDate}
              >
                {cell.date}
              </Cell>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
