import styled from '@emotion/styled'
import { GREETING_MESSAGE_PARAGRAPHS } from '../../constants/weddingInfo'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.2rem;
  color: ${({ theme }) => theme.color.accent};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const Paragraph = styled.p`
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: break-word;
  line-height: 1.8;
  font-size: clamp(0.82rem, 3.6vw, 0.95rem);
  color: ${({ theme }) => theme.color.text};

  & + & {
    margin-top: ${({ theme }) => theme.spacing(3)};
  }
`

export function Greeting() {
  return (
    <Section>
      <Title>저희의 새로운 이야기에 함께해 주세요</Title>
      {GREETING_MESSAGE_PARAGRAPHS.map((paragraph) => (
        <Paragraph key={paragraph}>{paragraph}</Paragraph>
      ))}
    </Section>
  )
}
