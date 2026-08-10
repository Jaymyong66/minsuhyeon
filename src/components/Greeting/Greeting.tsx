import styled from '@emotion/styled'
import { Reveal } from '../common/Reveal'
import { GREETING_MESSAGE_PARAGRAPHS } from '../../constants/weddingInfo'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const Title = styled.h2`
  /* 아래 본문과 같은 글씨체로 맞춘다 */
  font-family: ${({ theme }) => theme.font.body};
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
  margin: 0;
`

/*
 * 문단 사이 여백은 감싸는 쪽에서 gap 으로 준다.
 *
 * styled(Reveal) 에 `& + &` 로 주면 먹지 않는다. Reveal 안쪽도 emotion 컴포넌트라
 * 두 클래스가 하나로 합쳐지면서, 형제 선택자가 찾을 클래스가 DOM 에 남지 않는다.
 *
 * 1.8em 은 본문 line-height 한 줄 높이. 문단 사이를 한 줄 비운 셈이 된다.
 */
const Paragraphs = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(${({ theme }) => theme.spacing(3)} + 1.8em);
`

export function Greeting() {
  return (
    <Section>
      <Reveal>
        <Title>저희의 새로운 이야기에 함께해 주세요</Title>
      </Reveal>
      <Paragraphs>
        {GREETING_MESSAGE_PARAGRAPHS.map((paragraph, i) => (
          <Reveal key={paragraph} delay={120 + i * 120}>
            <Paragraph>{paragraph}</Paragraph>
          </Reveal>
        ))}
      </Paragraphs>
    </Section>
  )
}
