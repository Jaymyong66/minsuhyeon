import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { getTimeRemaining, type TimeRemaining } from './countdown'
import { WEDDING_DATE_ISO } from '../../constants/weddingInfo'

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
    <Row>
      <Unit>
        <Value>{remaining.days}</Value>
        <Label>일</Label>
      </Unit>
      <Unit>
        <Value>{remaining.hours}</Value>
        <Label>시간</Label>
      </Unit>
      <Unit>
        <Value>{remaining.minutes}</Value>
        <Label>분</Label>
      </Unit>
      <Unit>
        <Value>{remaining.seconds}</Value>
        <Label>초</Label>
      </Unit>
    </Row>
  )
}
