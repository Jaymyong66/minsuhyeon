import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const appear = keyframes`
  from { opacity: 0; transform: translate(-50%, 8px); }
  to { opacity: 1; transform: translate(-50%, 0); }
`

const disappear = keyframes`
  from { opacity: 1; transform: translate(-50%, 0); }
  to { opacity: 0; transform: translate(-50%, 8px); }
`

const FADE_MS = 250

const Bubble = styled.div<{ leaving: boolean }>`
  position: fixed;
  left: 50%;
  bottom: calc(32px + env(safe-area-inset-bottom));
  z-index: 500;
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(2.5)};
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 0.85rem;
  white-space: nowrap;
  pointer-events: none;
  animation: ${({ leaving }) => (leaving ? disappear : appear)} ${FADE_MS}ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: ${({ leaving }) => (leaving ? 0 : 1)};
    transform: translate(-50%, 0);
  }
`

interface ToastProps {
  children: ReactNode
  /** 이 시간이 지나면 사라진다. 주지 않으면 띄운 쪽이 직접 걷어야 한다 */
  duration?: number
  onDone?: () => void
}

/*
 * body 로 포털한다. #root 는 480px 칼럼이고, Reveal 의 transform 이 남아 있으면
 * position:fixed 가 그 안에 갇혀 화면 하단이 아닌 엉뚱한 곳에 뜬다.
 */
export function Toast({ children, duration, onDone }: ToastProps) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!duration) return

    const leaveTimer = setTimeout(() => setLeaving(true), duration)
    const doneTimer = setTimeout(() => onDone?.(), duration + FADE_MS)
    return () => {
      clearTimeout(leaveTimer)
      clearTimeout(doneTimer)
    }
  }, [duration, onDone])

  return createPortal(
    <Bubble role="status" leaving={leaving}>
      {children}
    </Bubble>,
    document.body,
  )
}
