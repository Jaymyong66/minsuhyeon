import styled from '@emotion/styled'
import { SectionTitle } from '../common/SectionTitle'
import { Reveal } from '../common/Reveal'
import { Calendar } from './CalendarWidget'
import { Countdown } from './CountdownTimer'
import { VENUE } from '../../constants/weddingInfo'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const Title = styled(SectionTitle)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const DateTime = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.color.text};
`

const Place = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(4)};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.color.textMuted};
`

const MonthLabel = styled.p`
  font-family: ${({ theme }) => theme.font.heading};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const CountdownWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
`

export function Ceremony() {
  return (
    <Section>
      <Reveal>
        <Title>예식 안내</Title>
      </Reveal>
      <Reveal delay={120}>
        <DateTime>2026년 11월 1일 일요일 오후 1시</DateTime>
        <Place>{VENUE.name}</Place>
      </Reveal>
      <Reveal delay={240}>
        <MonthLabel>11월</MonthLabel>
        <Calendar year={2026} month={11} targetDate={1} />
      </Reveal>
      <Reveal delay={360}>
        <CountdownWrapper>
          <Countdown />
        </CountdownWrapper>
      </Reveal>
    </Section>
  )
}
