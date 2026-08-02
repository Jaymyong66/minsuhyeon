import styled from '@emotion/styled'
import { Calendar } from './CalendarWidget'
import { Countdown } from './CountdownTimer'
import { VENUE } from '../../constants/weddingInfo'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.3rem;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Info = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.color.text};
`

const CountdownWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
`

export function Ceremony() {
  return (
    <Section>
      <Title>예식 안내</Title>
      <Info>
        2026년 11월 1일 일요일 오후 1시
        <br />
        {VENUE.name}
      </Info>
      <Calendar year={2026} month={11} targetDate={1} />
      <CountdownWrapper>
        <Countdown />
      </CountdownWrapper>
    </Section>
  )
}
