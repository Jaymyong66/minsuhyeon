import { useState } from 'react'
import styled from '@emotion/styled'

interface CopyButtonProps {
  value: string
}

const StyledButton = styled.button<{ copied: boolean }>`
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.78rem;
  color: ${({ theme, copied }) => (copied ? theme.color.accent : theme.color.textMuted)};
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s ease;
`

const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  z-index: 500;
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(2.5)};
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 0.85rem;
  white-space: nowrap;
`

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <StyledButton type="button" copied={copied} onClick={handleClick}>
        {copied ? '복사됨' : '복사'}
      </StyledButton>
      {copied && <Toast role="status">계좌번호가 복사되었습니다.</Toast>}
    </>
  )
}
