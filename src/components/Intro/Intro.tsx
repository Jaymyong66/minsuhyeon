import { useState } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { DUMMY_HERO_IMAGE } from '../../constants/dummyImages'

interface IntroProps {
  onEnter: () => void
}

const fadeInPhoto = keyframes`
  from { opacity: 0; transform: scale(1.08); }
  to { opacity: 1; transform: scale(1); }
`

const fadeInText = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.85; }
  50% { opacity: 0.4; }
`

const Wrapper = styled.div<{ leaving: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  color: #fff;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  transition: opacity 0.6s ease;
  opacity: ${({ leaving }) => (leaving ? 0 : 1)};
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

const Hint = styled.p`
  position: absolute;
  bottom: 40px;
  z-index: 1;
  font-size: 0.85rem;
  animation: ${pulse} 2s ease-in-out infinite;
`

export function Intro({ onEnter }: IntroProps) {
  const [leaving, setLeaving] = useState(false)

  const handleEnter = () => {
    setLeaving(true)
    setTimeout(onEnter, 600)
  }

  return (
    <Wrapper leaving={leaving} onClick={handleEnter} role="button" aria-label="청첩장 시작하기">
      <Photo />
      <Content>
        <Names>민수 ・ 수현</Names>
        <Date>2026. 11. 01 SUN</Date>
      </Content>
      <Hint>화면을 터치해주세요</Hint>
    </Wrapper>
  )
}
