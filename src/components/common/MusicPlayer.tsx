import { useRef, useState } from 'react'
import styled from '@emotion/styled'
import { BGM_SRC } from '../../constants/weddingInfo'

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

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  return (
    <>
      <audio ref={audioRef} src={BGM_SRC} loop />
      <ToggleButton type="button" onClick={toggle} aria-label={playing ? '음악 끄기' : '음악 켜기'}>
        {playing ? '🔊' : '🔈'}
      </ToggleButton>
    </>
  )
}
