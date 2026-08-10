import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from '@emotion/styled'
import { Reveal } from '../common/Reveal'
import { uploadPhoto, MAX_PHOTOS, type PhotoItem } from './uploadPhotos'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.3rem;
  color: ${({ theme }) => theme.color.accent};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Description = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.9rem;
  line-height: 1.7;
  word-break: keep-all;
`

const OpenButton = styled.button`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 999px;
  background: none;
  color: ${({ theme }) => theme.color.accentStrong};
  font-size: 0.95rem;
  cursor: pointer;
`

/* 모달은 body 로 포털한다. #root 는 480px 칼럼이고 Reveal 의 transform 에 갇힐 수 있다 */
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(2)};
`

const Dialog = styled.div`
  width: 100%;
  max-width: 380px;
  max-height: 85dvh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 16px;
  background: ${({ theme }) => theme.color.surface};
  text-align: left;
`

const DialogTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing(2)};
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.color.text};
`

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.color.textMuted};
`

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  font-size: 0.95rem;
`

const PickButton = styled.button`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(1.5)};
  border: 1px dashed ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background: none;
  color: ${({ theme }) => theme.color.text};
  font-size: 0.9rem;
  cursor: pointer;
`

const FileList = styled.ul`
  margin: ${({ theme }) => theme.spacing(2)} 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
`

const FileRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(1)};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.color.textMuted};
`

const FileName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const FileState = styled.span<{ tone: 'muted' | 'done' | 'error' }>`
  flex-shrink: 0;
  color: ${({ tone, theme }) =>
    tone === 'done'
      ? theme.color.accentStrong
      : tone === 'error'
        ? '#c0392b'
        : theme.color.textMuted};
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const SendButton = styled.button<{ ready: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border: none;
  border-radius: 8px;
  background: ${({ ready, theme }) => (ready ? theme.color.accentStrong : theme.color.accent)};
  color: ${({ ready, theme }) => (ready ? '#fff' : theme.color.onAccent)};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    color 0.25s ease;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const CloseButton = styled.button`
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background: none;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.95rem;
  cursor: pointer;
`

/* 화면에서만 감춘다. display:none 이면 iOS 에서 클릭이 먹지 않는 경우가 있다 */
const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`

const Notice = styled.p`
  margin: ${({ theme }) => theme.spacing(1)} 0 0;
  font-size: 0.75rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.color.accentStrong};
  word-break: keep-all;
`

const Note = styled.p`
  margin: ${({ theme }) => theme.spacing(2)} 0 0;
  font-size: 0.75rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textMuted};
  word-break: keep-all;
`

const stateLabel = (item: PhotoItem) => {
  if (item.status === 'done') return '완료'
  if (item.status === 'uploading') return '보내는 중'
  if (item.status === 'error') return item.error ?? '실패'
  return '대기'
}

const tone = (status: PhotoItem['status']) =>
  status === 'done' ? 'done' : status === 'error' ? 'error' : 'muted'

function UploadDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [items, setItems] = useState<PhotoItem[]>([])
  const [sending, setSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !sending) onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, sending])

  const [notice, setNotice] = useState<string | null>(null)

  /*
   * FileList 가 아니라 이미 배열로 만들어진 File[] 을 받는다.
   * FileList 는 input 과 연결된 라이브 객체라, 아래 setItems 콜백이 실행될 즈음이면
   * value 를 비운 탓에 이미 비어 있을 수 있다. iOS 에서 사진이 하나도 안 담기던 원인이다.
   */
  const pick = (picked: File[]) => {
    if (picked.length === 0) return
    setItems((prev) => {
      const room = MAX_PHOTOS - prev.length
      if (picked.length > room) {
        setNotice(
          `한 번에 ${MAX_PHOTOS}장까지 보낼 수 있어요. 나머지는 보내신 뒤 다시 선택해주세요.`,
        )
      } else {
        setNotice(null)
      }
      return [
        ...prev,
        ...picked.slice(0, Math.max(0, room)).map((file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
          file,
          status: 'pending' as const,
        })),
      ]
    })
  }

  const remaining = items.filter((i) => i.status !== 'done')
  const ready = name.trim().length > 0 && remaining.length > 0 && !sending
  const allDone = items.length > 0 && remaining.length === 0

  const send = async () => {
    setSending(true)
    // 한 장씩 보낸다. 한 장이 실패해도 나머지는 그대로 올라간다.
    for (const item of items) {
      if (item.status === 'done') continue
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading', error: undefined } : i)),
      )
      try {
        await uploadPhoto(item.file, name.trim())
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'done' } : i)))
      } catch (err) {
        const message = (err as Error).message
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'error', error: message } : i)),
        )
      }
    }
    setSending(false)
  }

  return createPortal(
    <Backdrop
      role="dialog"
      aria-modal="true"
      aria-label="사진 보내기"
      onClick={() => !sending && onClose()}
    >
      <Dialog onClick={(e) => e.stopPropagation()}>
        <DialogTitle>사진 보내기</DialogTitle>

        <Label htmlFor="photo-sender">보내는 분</Label>
        <Input
          id="photo-sender"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          maxLength={50}
          disabled={sending}
        />

        {/*
          hidden(display:none) 대신 눈에만 안 보이게 둔다.
          iOS 사파리는 display:none 인 input 에 대한 프로그래밍 클릭을 무시하는 경우가 있다.
        */}
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            // FileList 는 라이브 객체라 value 를 비우면 같이 비워진다. 먼저 배열로 굳힌다.
            const picked = Array.from(e.target.files ?? [])
            pick(picked)
            // 같은 사진을 다시 고를 수 있도록 비운다
            e.target.value = ''
          }}
        />
        <PickButton
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={sending || items.length >= MAX_PHOTOS}
        >
          {items.length > 0 ? `사진 더 선택 (${items.length}/${MAX_PHOTOS})` : '사진 선택'}
        </PickButton>

        {notice && <Notice role="status">{notice}</Notice>}

        {items.length > 0 && (
          <FileList>
            {items.map((item) => (
              <FileRow key={item.id}>
                <FileName>{item.file.name}</FileName>
                <FileState tone={tone(item.status)}>{stateLabel(item)}</FileState>
              </FileRow>
            ))}
          </FileList>
        )}

        {/* 버튼이 왜 안 눌리는지 알려준다. 없으면 계속 대기 상태로만 보인다 */}
        {!ready && !sending && !allDone && items.length > 0 && !name.trim() && (
          <Notice role="status">이름을 입력하시면 보낼 수 있어요.</Notice>
        )}
        {!ready && !sending && items.length === 0 && name.trim().length > 0 && (
          <Notice role="status">보내실 사진을 선택해주세요.</Notice>
        )}

        <Actions>
          <SendButton type="button" onClick={send} disabled={!ready} ready={ready}>
            {sending ? '보내는 중...' : allDone ? '보냈습니다' : '보내기'}
          </SendButton>
          <CloseButton type="button" onClick={onClose} disabled={sending}>
            닫기
          </CloseButton>
        </Actions>

        <Note>보내주신 사진은 신랑 신부만 볼 수 있어요. 청첩장에는 공개되지 않습니다.</Note>
      </Dialog>
    </Backdrop>,
    document.body,
  )
}

export function PhotoUpload() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <Section>
      <Reveal>
        <Title>사진 업로드</Title>
      </Reveal>
      <Reveal delay={120}>
        <Description>결혼식에서 찍은 소중한 사진을 보내주세요</Description>
      </Reveal>
      <Reveal delay={240}>
        <OpenButton type="button" onClick={() => setOpen(true)}>
          사진 보내기
        </OpenButton>
      </Reveal>
      {open && <UploadDialog onClose={close} />}
    </Section>
  )
}
