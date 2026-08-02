import styled from '@emotion/styled'
import { DUMMY_GALLERY_IMAGES } from '../../constants/dummyImages'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.3rem;
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
`

export function Gallery() {
  return (
    <Section>
      <Title>갤러리</Title>
      <Grid>
        {DUMMY_GALLERY_IMAGES.map((src, i) => (
          <Photo key={src} src={src} alt={`갤러리 사진 ${i + 1}`} loading="lazy" />
        ))}
      </Grid>
    </Section>
  )
}
