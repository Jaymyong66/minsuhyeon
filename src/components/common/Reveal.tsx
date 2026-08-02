import { useEffect, useRef, useState, type ReactNode } from 'react'
import styled from '@emotion/styled'

interface RevealProps {
  children: ReactNode
}

const Wrapper = styled.div<{ visible: boolean }>`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: translateY(${({ visible }) => (visible ? '0' : '28px')});
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
`

export function Reveal({ children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <Wrapper ref={ref} visible={visible}>
      {children}
    </Wrapper>
  )
}
