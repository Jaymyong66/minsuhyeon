import { useState } from 'react'
import { ThemeProvider } from '@emotion/react'
import { theme } from './theme/theme'
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
  const [entered, setEntered] = useState(false)

  return (
    <ThemeProvider theme={theme}>
      {!entered && <Intro onEnter={() => setEntered(true)} />}
      {entered && (
        <>
          <MusicPlayer />
          <Greeting />
          <Ceremony />
          <Gallery />
          <PhotoUpload />
          <Contacts />
          <LocationMap />
          <Guestbook />
        </>
      )}
    </ThemeProvider>
  )
}

export default App
