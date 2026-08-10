import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from '@emotion/styled'
import { Reveal } from '../common/Reveal'
import { GALLERY_PHOTOS } from '../../constants/dummyImages'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.heading};
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
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  cursor: pointer;
`

/* 라이트박스는 document.body 로 포털되므로 뷰포트 전체를 덮는다.
   (#root 안에 두면 480px 칼럼이나 transform 을 가진 조상에 갇힌다) */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 400;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
`

const FullPhoto = styled.img`
  max-width: 100vw;
  max-height: 100dvh;
  object-fit: contain;
  touch-action: pan-x pan-y;
  user-select: none;
  -webkit-user-select: none;
`

const IconButton = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;

  &:disabled {
    opacity: 0.25;
    cursor: default;
  }
`

const CloseButton = styled(IconButton)`
  top: max(16px, env(safe-area-inset-top));
  right: 16px;
`

/* 이동 버튼은 사진을 넘기며 반복해서 누르는 곳이라 넉넉하게 잡는다.
   보이는 원 바깥으로 10px 더 눌리는 영역을 둬서 빗나가도 먹히게 한다. */
const NavButton = styled(IconButton)`
  width: 56px;
  height: 56px;
  font-size: 2rem;
  top: 50%;
  transform: translateY(-50%);

  &::before {
    content: '';
    position: absolute;
    inset: -10px;
    border-radius: inherit;
  }

  &:active:not(:disabled) {
    background: rgba(0, 0, 0, 0.6);
  }
`

const PrevButton = styled(NavButton)`
  left: max(20px, env(safe-area-inset-left));
`

const NextButton = styled(NavButton)`
  right: max(20px, env(safe-area-inset-right));
`

const Counter = styled.div`
  position: absolute;
  bottom: max(16px, env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
`

function Lightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKeyDown)

    // 라이트박스가 열린 동안 뒤 페이지가 스크롤되지 않도록 잠근다.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, onPrev, onNext])

  return createPortal(
    <Overlay role="dialog" aria-modal="true" aria-label="사진 크게 보기" onClick={onClose}>
      <FullPhoto
        src={GALLERY_PHOTOS[index].full}
        alt={`갤러리 사진 ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.preventDefault()}
      />
      <CloseButton
        type="button"
        aria-label="닫기"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        ✕
      </CloseButton>
      <PrevButton
        type="button"
        aria-label="이전 사진"
        disabled={index === 0}
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
      >
        ‹
      </PrevButton>
      <NextButton
        type="button"
        aria-label="다음 사진"
        disabled={index === GALLERY_PHOTOS.length - 1}
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
      >
        ›
      </NextButton>
      <Counter>
        {index + 1} / {GALLERY_PHOTOS.length}
      </Counter>
    </Overlay>,
    document.body,
  )
}

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : Math.max(0, i - 1))),
    [],
  )
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : Math.min(GALLERY_PHOTOS.length - 1, i + 1))),
    [],
  )

  return (
    <Section>
      <Reveal>
        <Title>갤러리</Title>
      </Reveal>
      <Grid>
        {GALLERY_PHOTOS.map((photo, i) => (
          /* 행 안에서 좌→우로 번지도록 열 위치만큼만 지연시킨다.
             관찰자가 사진마다 따로 붙으므로 뒤쪽 사진까지 지연이 누적되지 않는다. */
          <Reveal key={photo.thumb} delay={(i % 3) * 80}>
            <Photo
              src={photo.thumb}
              alt={`갤러리 사진 ${i + 1}`}
              loading="lazy"
              onClick={() => setOpenIndex(i)}
            />
          </Reveal>
        ))}
      </Grid>
      {openIndex !== null && (
        <Lightbox index={openIndex} onClose={close} onPrev={prev} onNext={next} />
      )}
    </Section>
  )
}
