import { useEffect, useState } from 'react'
import styled from '@emotion/styled'

const Banner = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 300;
  overflow: hidden;
  max-height: ${({ visible }) => (visible ? '40px' : '0')};
  transition: max-height 0.4s ease;
  background: ${({ theme }) => theme.color.surface};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const Text = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing(1)} 0;
  text-align: center;
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.text};
`

export function MusicBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 300)
    const hideTimer = setTimeout(() => setVisible(false), 3000)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  return (
    <Banner visible={visible}>
      <Text>배경음악이 준비되었습니다</Text>
    </Banner>
  )
}
