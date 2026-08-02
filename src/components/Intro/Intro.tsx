import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { DUMMY_HERO_IMAGE } from '../../constants/dummyImages'

const fadeInPhoto = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const fadeInText = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
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
      <Content>
        <Names>민수 ・ 수현</Names>
        <Date>2026. 11. 01 SUN</Date>
      </Content>
    </Wrapper>
  )
}
