import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { Reveal } from '../common/Reveal'
import { VENUE, NAVER_MAP_CLIENT_ID } from '../../constants/weddingInfo'
import { loadNaverMaps } from './naverMapLoader'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.heading};
  font-size: 1.3rem;
  color: ${({ theme }) => theme.color.accent};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const MapBox = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme.color.border};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  overflow: hidden;
`

const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.85rem;
`

const Address = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const NavButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const NavButton = styled.a`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 999px;
  color: ${({ theme }) => theme.color.text};
  text-decoration: none;
  font-size: 0.85rem;
`

const Button = styled.a`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 999px;
  color: ${({ theme }) => theme.color.accent};
  text-decoration: none;
`

const encodedName = encodeURIComponent(VENUE.name)

const NAV_LINKS = [
  {
    label: '티맵',
    href: `tmap://route?goalname=${encodedName}&goalx=${VENUE.lng}&goaly=${VENUE.lat}`,
  },
  {
    label: '카카오내비',
    href: `kakaonavi://navigate?name=${encodedName}&x=${VENUE.lng}&y=${VENUE.lat}&coord_type=wgs84`,
  },
  {
    label: '네이버지도',
    href: `nmap://place?lat=${VENUE.lat}&lng=${VENUE.lng}&name=${encodedName}&appname=life.minsuhyeon.wedding`,
  },
]

export function LocationMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    if (!NAVER_MAP_CLIENT_ID || !mapRef.current) return

    let cancelled = false

    loadNaverMaps(NAVER_MAP_CLIENT_ID)
      .then((naver) => {
        if (cancelled || !mapRef.current) return
        const position = new naver.maps.LatLng(VENUE.lat, VENUE.lng)
        const map = new naver.maps.Map(mapRef.current, {
          center: position,
          zoom: 16,
        })
        new naver.maps.Marker({ position, map })
      })
      .catch(() => {
        if (!cancelled) setMapError(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Section>
      <Reveal>
        <Title>오시는 길</Title>
      </Reveal>
      <MapBox>
        {NAVER_MAP_CLIENT_ID && !mapError ? (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        ) : (
          <MapPlaceholder>
            {mapError ? '지도를 불러오지 못했습니다' : '지도 준비 중 (네이버 지도 API 키 발급 필요, TODO.md 참고)'}
          </MapPlaceholder>
        )}
      </MapBox>
      <Reveal delay={120}>
        <Address>{VENUE.name}</Address>
      </Reveal>
      <Reveal delay={220}>
        <NavButtonRow>
          {NAV_LINKS.map((nav) => (
            <NavButton key={nav.label} href={nav.href}>
              {nav.label}
            </NavButton>
          ))}
        </NavButtonRow>
      </Reveal>
      <Reveal delay={320}>
        <Button href={VENUE.directionsUrl} target="_blank" rel="noreferrer">
          오시는 길 / 주차 안내
        </Button>
      </Reveal>
    </Section>
  )
}
