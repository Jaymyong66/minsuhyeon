import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { DUMMY_HERO_IMAGE } from '../../constants/dummyImages'
import {
  HANDWRITING_LETTERFORM_D,
  HANDWRITING_STROKES,
  HANDWRITING_TOTAL_LENGTH,
  HANDWRITING_LINE_BREAK,
  HANDWRITING_TWO_LINE_VIEWBOX,
  HANDWRITING_LINE_TRANSFORMS,
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

const [VB_X, VB_Y, VB_W, VB_H] = HANDWRITING_TWO_LINE_VIEWBOX.split(/\s+/).map(Number)

/* 줄별로 나눠 둔 외곽선과 획. 경계 앞이 첫 줄, 뒤가 둘째 줄이다. */
const LETTERFORM_SUBPATHS = HANDWRITING_LETTERFORM_D.split(/(?=M)/).filter((d) => d.trim())
const LINES = [
  {
    transform: HANDWRITING_LINE_TRANSFORMS[0],
    d: LETTERFORM_SUBPATHS.slice(0, HANDWRITING_LINE_BREAK.subpath).join(''),
    from: 0,
    to: HANDWRITING_LINE_BREAK.stroke,
  },
  {
    transform: HANDWRITING_LINE_TRANSFORMS[1],
    d: LETTERFORM_SUBPATHS.slice(HANDWRITING_LINE_BREAK.subpath).join(''),
    from: HANDWRITING_LINE_BREAK.stroke,
    to: HANDWRITING_STROKES.length,
  },
]

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

/*
 * 문구 위치는 사진 속 인물 기준으로 잡는다.
 * 사진(2:3)이 폭보다 세로가 긴 뷰포트에 cover 로 깔리면 세로는 잘리지 않고 꽉 차므로,
 * 사진 안에서의 세로 비율이 그대로 화면 비율이 된다.
 *   남자 머리 꼭대기 42% / 재킷 밑단 68% / 신발 바닥 88.5%
 */
const HEADLINE_BOTTOM = 'calc(40% - 50px)' // 머리보다 살짝 위에서 50px 더 올림
const NAMES_CENTER = '78%' // 두 사람의 다리 부근

const Wrapper = styled.section`
  position: relative;
  min-height: 100dvh;
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

/* 문구 높이가 화면 폭에 따라 달라지므로 아래쪽 끝을 기준점으로 고정한다 */
const HeadlineBox = styled.div`
  position: absolute;
  top: ${HEADLINE_BOTTOM};
  left: 50%;
  width: 80%;
  transform: translate(-50%, -100%);
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

/* 위치잡기와 애니메이션을 다른 요소로 나눈다.
   한 요소에 두면 keyframes 의 transform 이 자리잡는 transform 을 덮어써 버린다. */
const ContentAnchor = styled.div`
  position: absolute;
  top: ${NAMES_CENTER};
  left: 0;
  right: 0;
  z-index: 1;
  transform: translateY(-50%);
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  animation: ${fadeInText} 1.2s ease-out 0.6s both;
`

/* 흰 드레스 위에 흰 글씨가 얹히므로 그림자로 대비를 확보한다 */
const Names = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 2rem;
  letter-spacing: 0.1em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.55);
`

const Date = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.55);
`

export function Intro() {
  return (
    <Wrapper>
      <Photo />
      <HeadlineBox>
        <svg
          viewBox={HANDWRITING_TWO_LINE_VIEWBOX}
          width="100%"
          role="img"
          aria-label="We're getting Married!"
        >
          <defs>
            <mask
              id="handwritingReveal"
              maskUnits="userSpaceOnUse"
              x={VB_X}
              y={VB_Y}
              width={VB_W}
              height={VB_H}
            >
              {LINES.map((line) => (
                <g key={line.from} transform={line.transform}>
                  <MaskGroup>
                    {HANDWRITING_STROKES.slice(line.from, line.to).map((stroke, i) => (
                      <MaskStroke
                        key={i}
                        d={stroke.d}
                        len={stroke.len}
                        begin={STROKE_OFFSETS[line.from + i]}
                      />
                    ))}
                  </MaskGroup>
                </g>
              ))}
            </mask>
          </defs>
          {/*
            마스크는 줄을 감싼 바깥 <g> 에 건다.
            줄마다 걸면 mask 의 userSpaceOnUse 좌표가 그 줄의 transform 을 따라
            같이 움직여서, 마스크와 글자가 서로 어긋난다.
          */}
          <g mask="url(#handwritingReveal)">
            {LINES.map((line) => (
              <g key={line.from} transform={line.transform}>
                <LetterformPath d={line.d} />
              </g>
            ))}
          </g>
          {LINES.map((line) => (
            <g key={line.from} transform={line.transform}>
              <SettlePath d={line.d} />
            </g>
          ))}
        </svg>
      </HeadlineBox>
      <ContentAnchor>
        <Content>
          <Names>민수 ・ 수현</Names>
          <Date>2026. 11. 01 SUN</Date>
        </Content>
      </ContentAnchor>
    </Wrapper>
  )
}
