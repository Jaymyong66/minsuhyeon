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

const Cell = styled.td<{ isCurrentMonth: boolean }>`
  padding: 6px 4px;
  font-size: 0.85rem;
  color: ${({ theme, isCurrentMonth }) => (isCurrentMonth ? theme.color.text : theme.color.border)};
`

/*
 * 강조 표시는 칸(td)이 아니라 안쪽 요소에 건다.
 * 칸은 가로가 세로보다 넓어서, 거기에 border-radius:50% 를 주면 원이 아니라 타원이 된다.
 */
const Mark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.accent};
  color: #fff;
  font-weight: 700;
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
              <Cell key={j} isCurrentMonth={cell.isCurrentMonth}>
                {cell.isCurrentMonth && cell.date === targetDate ? (
                  <Mark>{cell.date}</Mark>
                ) : (
                  cell.date
                )}
              </Cell>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
