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
import { MusicBanner } from './components/common/MusicBanner'
import { Reveal } from './components/common/Reveal'

const GESTURE_EVENTS = ['touchstart', 'click', 'scroll', 'keydown'] as const

function App() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const startedRef = useRef(false)

  const startMusic = () => {
    if (startedRef.current) return
    startedRef.current = true
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => {
        startedRef.current = false
      })
  }

  useEffect(() => {
    // 모바일 브라우저는 사용자 제스처 없는 자동재생을 막기 때문에,
    // 첫 터치/스크롤/클릭 등 어떤 상호작용이든 감지되면 그 시점에 재생을 시도한다.
    const handleFirstGesture = () => startMusic()

    GESTURE_EVENTS.forEach((event) =>
      window.addEventListener(event, handleFirstGesture, { once: true, passive: true }),
    )

    return () => {
      GESTURE_EVENTS.forEach((event) => window.removeEventListener(event, handleFirstGesture))
    }
  }, [])

  const toggleMusic = () => {
    if (playing) {
      audioRef.current?.pause()
      setPlaying(false)
    } else {
      startedRef.current = false
      startMusic()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <audio ref={audioRef} src={BGM_SRC} loop />
      <MusicBanner />
      <MusicPlayer playing={playing} onToggle={toggleMusic} />
      <Intro />
      <Reveal>
        <Greeting />
      </Reveal>
      <Reveal>
        <Ceremony />
      </Reveal>
      <Reveal>
        <Gallery />
      </Reveal>
      <Reveal>
        <Contacts />
      </Reveal>
      <Reveal>
        <LocationMap />
      </Reveal>
      <Reveal>
        <PhotoUpload />
      </Reveal>
      <Reveal>
        <Guestbook />
      </Reveal>
    </ThemeProvider>
  )
}

export default App
