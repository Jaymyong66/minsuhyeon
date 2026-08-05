import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { getTimeRemaining, type TimeRemaining } from './countdown'
import { WEDDING_DATE_ISO } from '../../constants/weddingInfo'

const Heading = styled.p`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.color.accent};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
`

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: center;
`

const Unit = styled.div`
  text-align: center;
`

const Value = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`

const Label = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.textMuted};
`

const pad = (n: number) => String(n).padStart(2, '0')

export function Countdown() {
  const target = new Date(WEDDING_DATE_ISO)
  const [remaining, setRemaining] = useState<TimeRemaining>(() => getTimeRemaining(target, new Date()))

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(getTimeRemaining(target, new Date()))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (remaining.isPast) {
    return <p>결혼식이 진행되었습니다.</p>
  }

  return (
    <>
      <Heading>
        우리의 특별한 날까지
        <br />
      </Heading>
      <Row>
        <Unit>
          <Value>{pad(remaining.days)}</Value>
          <Label>일</Label>
        </Unit>
        <Unit>
          <Value>{pad(remaining.hours)}</Value>
          <Label>시간</Label>
        </Unit>
        <Unit>
          <Value>{pad(remaining.minutes)}</Value>
          <Label>분</Label>
        </Unit>
        <Unit>
          <Value>{pad(remaining.seconds)}</Value>
          <Label>초</Label>
        </Unit>
      </Row>
    </>
  )
}
