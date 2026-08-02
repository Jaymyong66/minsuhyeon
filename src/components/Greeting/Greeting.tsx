import styled from '@emotion/styled'
import { GREETING_MESSAGE } from '../../constants/weddingInfo'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.3rem;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const Message = styled.p`
  white-space: pre-line;
  line-height: 1.8;
  color: ${({ theme }) => theme.color.text};
`

export function Greeting() {
  return (
    <Section>
      <Title>인사말</Title>
      <Message>{GREETING_MESSAGE}</Message>
    </Section>
  )
}
