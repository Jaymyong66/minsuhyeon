import { useState } from 'react'
import styled from '@emotion/styled'
import { DUMMY_GALLERY_IMAGES } from '../../constants/dummyImages'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.3rem;
  color: ${({ theme }) => theme.color.accent};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
`

const Photo = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  cursor: pointer;
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 400;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
`

const FullPhoto = styled.img`
  max-width: 100%;
  max-height: 100%;
  touch-action: pan-x pan-y;
  user-select: none;
  -webkit-user-select: none;
`

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
`

export function Gallery() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <Section>
      <Title>갤러리</Title>
      <Grid>
        {DUMMY_GALLERY_IMAGES.map((src, i) => (
          <Photo
            key={src}
            src={src}
            alt={`갤러리 사진 ${i + 1}`}
            loading="lazy"
            onClick={() => setSelected(src)}
          />
        ))}
      </Grid>
      {selected && (
        <Overlay onClick={() => setSelected(null)}>
          <CloseButton aria-label="닫기" onClick={() => setSelected(null)}>
            ✕
          </CloseButton>
          <FullPhoto
            src={selected}
            alt="원본 사진"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.preventDefault()}
          />
        </Overlay>
      )}
    </Section>
  )
}
