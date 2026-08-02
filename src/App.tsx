import { useRef, useState } from 'react'
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

  const playMusic = () => {
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => {})
  }

  const toggleMusic = () => {
    if (playing) {
      audioRef.current?.pause()
      setPlaying(false)
    } else {
      playMusic()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <audio ref={audioRef} src={BGM_SRC} loop />
      <MusicPlayer playing={playing} onToggle={toggleMusic} />
      <Intro onEnter={playMusic} />
      <div id="content-start">
        <Greeting />
        <Ceremony />
        <Gallery />
        <PhotoUpload />
        <Contacts />
        <LocationMap />
        <Guestbook />
      </div>
    </ThemeProvider>
  )
}

export default App
