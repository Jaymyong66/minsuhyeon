import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { DUMMY_HERO_IMAGE } from '../../constants/dummyImages'
import {
  HANDWRITING_VIEWBOX,
  HANDWRITING_LETTERFORM_D,
  HANDWRITING_STROKES,
  HANDWRITING_TOTAL_LENGTH,
} from './handwritingPath'

/*
 * 손글씨 인트로: 중심선을 "그리는" 게 아니라 "마스크"로 쓴다.
 *
 * 중심선을 직접 stroke 로 그리면 굵기가 일정할 수밖에 없는데,
 * Dancing Script 는 획 굵기가 3~20 까지 변해서 굵은 기둥의 가장자리가 파이고
 * 그게 글자가 끊긴 것처럼 보인다 (균일 굵기 6.3 기준 커버리지 82%).
 *
 * 그래서 중심선을 마스크로 두고 원본 글자를 왼쪽 획부터 벗겨낸다.
 * 처음부터 진짜 Dancing Script 가 강약 그대로 드러나면서, 드러나는 순서는 필기 순서를 따른다.
 *
 * 획을 <path> 하나로 합치지 않고 따로 두는 이유:
 * SVG 의 dash 패턴은 subpath 마다 처음부터 다시 시작하기 때문에,
 * 한 path 안에 여러 획을 넣으면 dashoffset 을 줄여도 전부 동시에 그려진다.
 */
const DRAW_DURATION = 2.2
const DRAW_DELAY = 0.4
/* 가장 굵은 기둥까지 덮는 마스크 굵기. 실측상 14 에서 커버리지 98.8% 로 포화된다. */
const MASK_WIDTH = 14
/* 마스크가 놓치는 가장자리 1.2% 를 원본으로 덮어 마무리한다.
   마지막 획이 다 쓰이기 전에 시작하면 끝글자가 미리 나타나 버린다. */
const SETTLE_AT = DRAW_DELAY + DRAW_DURATION

const [VB_X, VB_Y, VB_W, VB_H] = HANDWRITING_VIEWBOX.split(/\s+/).map(Number)

const fadeInPhoto = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const fadeInText = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

/* 길이는 획마다 달라서 CSS 변수로 받는다 */
const draw = keyframes`
  from { stroke-dashoffset: var(--len); }
  to { stroke-dashoffset: 0; }
`

const handOn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const Wrapper = styled.section`
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  color: #fff;
  text-align: center;
  overflow: hidden;
`

const Photo = styled.div`
  position: absolute;
  inset: 0;
  background: #000 url(${DUMMY_HERO_IMAGE}) center/cover;
  animation: ${fadeInPhoto} 1.6s ease-out both;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.45));
  }
`

const HeadlineBox = styled.div`
  position: absolute;
  top: 14%;
  left: 50%;
  width: 80%;
  transform: translateX(-50%);
  z-index: 1;
`

/* 마스크 안에서 획이 지나간 자리가 흰색 = 글자가 드러나는 영역 */
const MaskGroup = styled.g`
  fill: none;
  stroke: #fff;
  stroke-width: ${MASK_WIDTH};
  stroke-linecap: round;
  stroke-linejoin: round;
`

const MaskStroke = styled.path<{ len: number; begin: number }>`
  --len: ${({ len }) => len};
  stroke-dasharray: ${({ len }) => len};
  animation: ${draw} ${({ len }) => (len / HANDWRITING_TOTAL_LENGTH) * DRAW_DURATION}s linear
    ${({ begin }) => DRAW_DELAY + (begin / HANDWRITING_TOTAL_LENGTH) * DRAW_DURATION}s both;

  /* 모션 최소화 설정에서는 마스크를 처음부터 열어둔다 */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    stroke-dashoffset: 0;
  }
`

const LetterformPath = styled.path`
  fill: ${({ theme }) => theme.color.accent};
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
`

/* 마스크가 닿지 않은 가장자리를 마지막에 채워 원본과 완전히 일치시킨다 */
const SettlePath = styled(LetterformPath)`
  animation: ${handOn} 0.5s ease-out ${SETTLE_AT}s both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`

/* 각 획이 시작하는 지점(앞선 획들의 길이 합). 펜이 일정한 속도로 움직이도록 한다. */
const STROKE_OFFSETS = HANDWRITING_STROKES.reduce<number[]>((acc, _, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + HANDWRITING_STROKES[i - 1].len)
  return acc
}, [])

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  animation: ${fadeInText} 1.2s ease-out 0.6s both;
`

const Names = styled.h1`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 2rem;
  letter-spacing: 0.1em;
`

const Date = styled.p`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1rem;
`

export function Intro() {
  return (
    <Wrapper>
      <Photo />
      <HeadlineBox>
        <svg viewBox={HANDWRITING_VIEWBOX} width="100%" role="img" aria-label="We're getting Married!">
          <defs>
            <mask
              id="handwritingReveal"
              maskUnits="userSpaceOnUse"
              x={VB_X}
              y={VB_Y}
              width={VB_W}
              height={VB_H}
            >
              <MaskGroup>
                {HANDWRITING_STROKES.map((stroke, i) => (
                  <MaskStroke key={i} d={stroke.d} len={stroke.len} begin={STROKE_OFFSETS[i]} />
                ))}
              </MaskGroup>
            </mask>
          </defs>
          <LetterformPath d={HANDWRITING_LETTERFORM_D} mask="url(#handwritingReveal)" />
          <SettlePath d={HANDWRITING_LETTERFORM_D} />
        </svg>
      </HeadlineBox>
      <Content>
        <Names>민수 ・ 수현</Names>
        <Date>2026. 11. 01 SUN</Date>
      </Content>
    </Wrapper>
  )
}
