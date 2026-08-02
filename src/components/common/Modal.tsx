import styled from '@emotion/styled'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`

const Sheet = styled.div`
  background: ${({ theme }) => theme.color.surface};
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing(3)};
  max-width: 90%;
  width: 360px;
  max-height: 80vh;
  overflow-y: auto;
`

const CloseButton = styled.button`
  display: block;
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
`

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null
  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <CloseButton aria-label="닫기" onClick={onClose}>
          ✕
        </CloseButton>
        {children}
      </Sheet>
    </Overlay>
  )
}
