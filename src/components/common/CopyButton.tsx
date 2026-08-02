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

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <StyledButton type="button" copied={copied} onClick={handleClick}>
      {copied ? '복사됨' : '복사'}
    </StyledButton>
  )
}
