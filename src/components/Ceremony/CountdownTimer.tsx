import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { getTimeRemaining, type TimeRemaining } from './countdown'
import { WEDDING_DATE_ISO } from '../../constants/weddingInfo'

const Heading = styled.p`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1rem;
  /* accent 는 배경(#fdf9f6)과 대비가 약해 글씨로 쓰면 흐릿하다 */
  color: ${({ theme }) => theme.color.accentStrong};
  margin-bottom: ${({ theme }) => theme.spacing(2.5)};
`

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1.5)};
  justify-content: center;
`

const Unit = styled.div`
  text-align: center;
`

/*
 * 원 안의 숫자는 흰색. accent(#f2b8c6) 위라 대비가 1.69:1 로 낮지만
 * (밝은 야외에서는 흐릿하게 보인다) 레퍼런스와 같은 느낌을 위해 택했다.
 */
const Circle = styled.div`
  width: clamp(62px, 18vw, 84px);
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.accent};
  color: #fff;
  font-size: clamp(1.25rem, 5.5vw, 1.6rem);
  font-weight: 400;
  /* 숫자가 매초 바뀌어도 원 안에서 폭이 흔들리지 않게 */
  font-variant-numeric: tabular-nums;
  box-shadow: 0 2px 8px rgba(178, 90, 114, 0.18);
`

const Label = styled.div`
  margin-top: ${({ theme }) => theme.spacing(1)};
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
      <Heading>우리의 특별한 날까지</Heading>
      <Row>
        <Unit>
          <Circle>{remaining.days}</Circle>
          <Label>일</Label>
        </Unit>
        <Unit>
          <Circle>{pad(remaining.hours)}</Circle>
          <Label>시간</Label>
        </Unit>
        <Unit>
          <Circle>{pad(remaining.minutes)}</Circle>
          <Label>분</Label>
        </Unit>
        <Unit>
          <Circle>{pad(remaining.seconds)}</Circle>
          <Label>초</Label>
        </Unit>
      </Row>
    </>
  )
}
