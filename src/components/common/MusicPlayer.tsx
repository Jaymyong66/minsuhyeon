import styled from '@emotion/styled'

const ToggleButton = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 200;
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  border-radius: 999px;
  width: 40px;
  height: 40px;
  cursor: pointer;
`

interface MusicPlayerProps {
  playing: boolean
  onToggle: () => void
}

export function MusicPlayer({ playing, onToggle }: MusicPlayerProps) {
  return (
    <ToggleButton type="button" onClick={onToggle} aria-label={playing ? '음악 끄기' : '음악 켜기'}>
      {playing ? '🔊' : '🔈'}
    </ToggleButton>
  )
}
