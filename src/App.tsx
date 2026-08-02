import { useEffect, useRef, useState } from 'react'
import { ThemeProvider } from '@emotion/react'
import { theme } from './theme/theme'
import { BGM_SRC } from './constants/weddingInfo'
import { Intro } from './components/Intro/Intro'
import { Greeting } from './components/Greeting/Greeting'
import { Ceremony } from './components/Ceremony/Ceremony'
import { Gallery } from './components/Gallery/Gallery'
import { PhotoUpload } from './components/PhotoUpload/PhotoUpload'
import { Contacts } from './components/Contacts/Contacts'
import { LocationMap } from './components/LocationMap/LocationMap'
import { Guestbook } from './components/Guestbook/Guestbook'
import { MusicPlayer } from './components/common/MusicPlayer'

function App() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    // 모바일 브라우저 자동재생 정책상 실패할 수 있음 — 실패 시 우측 상단 버튼으로 수동 재생
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => {})
  }, [])

  const toggleMusic = () => {
    if (playing) {
      audioRef.current?.pause()
      setPlaying(false)
    } else {
      audioRef.current
        ?.play()
        .then(() => setPlaying(true))
        .catch(() => {})
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <audio ref={audioRef} src={BGM_SRC} loop />
      <MusicPlayer playing={playing} onToggle={toggleMusic} />
      <Intro />
      <Greeting />
      <Ceremony />
      <Gallery />
      <PhotoUpload />
      <Contacts />
      <LocationMap />
      <Guestbook />
    </ThemeProvider>
  )
}

export default App
