import styled from '@emotion/styled'
import { VENUE, NAVER_MAP_CLIENT_ID } from '../../constants/weddingInfo'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.3rem;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const MapPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme.color.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.85rem;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Address = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Button = styled.a`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 999px;
  color: ${({ theme }) => theme.color.accent};
  text-decoration: none;
`

export function LocationMap() {
  return (
    <Section>
      <Title>오시는 길</Title>
      {NAVER_MAP_CLIENT_ID ? (
        <MapPlaceholder>네이버 지도 (API 키 연동 필요)</MapPlaceholder>
      ) : (
        <MapPlaceholder>지도 준비 중 (네이버 지도 API 키 발급 필요, TODO.md 참고)</MapPlaceholder>
      )}
      <Address>{VENUE.name}</Address>
      <Button href={VENUE.directionsUrl} target="_blank" rel="noreferrer">
        오시는 길 / 주차 안내
      </Button>
    </Section>
  )
}
