import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from '@emotion/styled'
import { pillButton } from '../common/pillButton'
import { SectionTitle } from '../common/SectionTitle'
import { Reveal } from '../common/Reveal'
import { MISSION_PHOTO } from '../../constants/dummyImages'
import { PHOTO_MISSION } from '../../constants/weddingInfo'
import {
  uploadPhoto,
  overallProgress,
  toPercent,
  totalBytes,
  formatBytes,
  MAX_PHOTOS,
  type PhotoItem,
} from './uploadPhotos'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const Title = styled(SectionTitle)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const MissionPhoto = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const MissionTitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(2)};
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.6;
  color: ${({ theme }) => theme.color.text};
  word-break: keep-all;
`

/* 번호는 직접 그린다. 기본 마커는 왼쪽에 붙어 가운데 정렬한 섹션에서 어긋나 보인다 */
const MissionList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: mission;
  display: inline-flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  text-align: left;
`

const MissionItem = styled.li`
  counter-increment: mission;
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  font-size: 0.88rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.color.text};
  word-break: keep-all;

  &::before {
    content: counter(mission);
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.accent};
    color: #fff;
    font-size: 0.72rem;
  }
`

const MissionNote = styled.span`
  display: block;
  margin-top: 2px;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.color.textMuted};
`

const MissionReward = styled.p`
  margin: ${({ theme }) => theme.spacing(3)} 0 0;
  white-space: pre-line;
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: 12px;
  background: rgba(242, 184, 198, 0.18);
  font-size: 0.88rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.color.text};
  word-break: keep-all;
`

const Description = styled.p`
  margin: ${({ theme }) => theme.spacing(3)} 0;
  white-space: pre-line;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.9rem;
  line-height: 1.7;
  word-break: keep-all;
`

const OpenButton = styled.button`
  ${({ theme }) => pillButton(theme)}
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
  font-family: ${({ theme }) => theme.font.heading};
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
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const FileSize = styled.span`
  flex-shrink: 0;
  margin-left: auto;
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
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

const ProgressWrap = styled.div`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const ProgressHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.color.textMuted};
`

const ProgressPercent = styled.strong`
  font-size: 0.95rem;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.color.accentStrong};
`

const ProgressTrack = styled.div`
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.color.border};
  overflow: hidden;
`

const ProgressBar = styled.div<{ ratio: number }>`
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.color.accentStrong};
  transform-origin: left center;
  transform: scaleX(${({ ratio }) => ratio});
  transition: transform 0.2s linear;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

/* 다이얼로그 위에 한 겹 더 덮는다. 아래 내용이 비쳐 보이되 조작은 막힌다 */
const DoneBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 600;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(2)};
  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const DoneCard = styled.div`
  width: 100%;
  max-width: 320px;
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(3)};
  border-radius: 16px;
  background: ${({ theme }) => theme.color.surface};
  text-align: center;
`

const DoneTitle = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.heading};
  font-size: 1.15rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.color.text};
  word-break: keep-all;
`

const DoneText = styled.p`
  margin: ${({ theme }) => theme.spacing(1.5)} 0 0;
  font-size: 0.85rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.color.textMuted};
  word-break: keep-all;
`

const DoneActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const DoneConfirm = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.accentStrong};
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
`

const DoneMore = styled.button`
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background: none;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.95rem;
  cursor: pointer;
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
  if (item.status === 'uploading') return `${toPercent(item.progress)}%`
  if (item.status === 'error') return item.error ?? '실패'
  return '대기'
}

const tone = (status: PhotoItem['status']) =>
  status === 'done' ? 'done' : status === 'error' ? 'error' : 'muted'

function UploadDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [items, setItems] = useState<PhotoItem[]>([])
  const [sending, setSending] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sentCount = items.filter((i) => i.status === 'done').length

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
          progress: 0,
        })),
      ]
    })
  }

  const remaining = items.filter((i) => i.status !== 'done')
  const ready = name.trim().length > 0 && remaining.length > 0 && !sending
  const allDone = items.length > 0 && remaining.length === 0
  const percent = toPercent(overallProgress(items))
  const bytes = totalBytes(items)

  const send = async () => {
    setSending(true)
    setNotice(null)
    let failed = false

    // 한 장씩 보낸다. 한 장이 실패해도 나머지는 그대로 올라간다.
    for (const item of items) {
      if (item.status === 'done') continue
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: 'uploading', progress: 0, error: undefined } : i,
        ),
      )
      try {
        await uploadPhoto(item.file, name.trim(), (progress) => {
          setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, progress } : i)))
        })
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'done', progress: 1 } : i)),
        )
      } catch (err) {
        failed = true
        const message = (err as Error).message
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'error', error: message } : i)),
        )
      }
    }

    setSending(false)
    // 한 장이라도 실패했으면 축하 팝업 대신 목록에서 실패 사유를 보게 둔다
    if (!failed) setShowThanks(true)
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
          {items.length > 0
            ? `사진 더 선택 (${items.length}/${MAX_PHOTOS} · ${formatBytes(bytes)})`
            : '사진 선택'}
        </PickButton>

        {notice && <Notice role="status">{notice}</Notice>}

        {items.length > 0 && (
          <FileList>
            {items.map((item) => (
              <FileRow key={item.id}>
                <FileName>{item.file.name}</FileName>
                <FileSize>{formatBytes(item.file.size)}</FileSize>
                <FileState tone={tone(item.status)}>{stateLabel(item)}</FileState>
              </FileRow>
            ))}
          </FileList>
        )}

        {(sending || percent > 0) && (
          <ProgressWrap>
            <ProgressHead>
              <span>
                {sending ? `보내는 중 (${sentCount}/${items.length})` : `${sentCount}장 보냄`} ·{' '}
                {formatBytes(bytes)}</span>
              <ProgressPercent
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="사진 전송 진행률"
              >
                {percent}%
              </ProgressPercent>
            </ProgressHead>
            <ProgressTrack>
              <ProgressBar ratio={percent / 100} />
            </ProgressTrack>
          </ProgressWrap>
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

      {showThanks && (
        <DoneBackdrop
          role="alertdialog"
          aria-modal="true"
          aria-label="전송 완료"
          onClick={(e) => e.stopPropagation()}
        >
          <DoneCard>
            <DoneTitle>소중한 사진 감사합니다!</DoneTitle>
            <DoneText>
              {sentCount}장을 잘 받았어요.
              <br />
              오래도록 간직하겠습니다.
            </DoneText>
            <DoneActions>
              <DoneConfirm type="button" onClick={onClose} autoFocus>
                확인
              </DoneConfirm>
              <DoneMore type="button" onClick={() => setShowThanks(false)}>
                더 보내기
              </DoneMore>
            </DoneActions>
          </DoneCard>
        </DoneBackdrop>
      )}
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
        <MissionPhoto src={MISSION_PHOTO} alt="" loading="lazy" />
      </Reveal>
      <Reveal delay={180}>
        <MissionTitle>{PHOTO_MISSION.title}</MissionTitle>
        <MissionList>
          {PHOTO_MISSION.items.map((item, i) => (
            <MissionItem key={item}>
              <span>
                {item}
                {i + 1 === PHOTO_MISSION.noteFor && <MissionNote>({PHOTO_MISSION.note})</MissionNote>}
              </span>
            </MissionItem>
          ))}
        </MissionList>
        <MissionReward>{PHOTO_MISSION.reward}</MissionReward>
        <Description>{PHOTO_MISSION.closing}</Description>
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
