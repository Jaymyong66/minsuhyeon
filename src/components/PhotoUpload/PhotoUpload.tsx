import styled from '@emotion/styled'
import { PHOTO_UPLOAD_FORM_URL } from '../../constants/weddingInfo'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.3rem;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Description = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.9rem;
`

const Button = styled.a`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 999px;
  color: ${({ theme }) => theme.color.accent};
  text-decoration: none;
`

export function PhotoUpload() {
  return (
    <Section>
      <Title>사진 업로드</Title>
      <Description>결혼식에서 찍은 소중한 사진을 보내주세요</Description>
      <Button href={PHOTO_UPLOAD_FORM_URL} target="_blank" rel="noreferrer">
        사진 보내기
      </Button>
    </Section>
  )
}
