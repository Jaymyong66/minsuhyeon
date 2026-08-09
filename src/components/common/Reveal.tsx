import { useEffect, useRef, useState, type ReactNode } from 'react'
import styled from '@emotion/styled'

interface RevealProps {
  children: ReactNode
  /** 등장 지연(ms). 같은 섹션 안의 요소들을 순차적으로 흘려보낼 때 사용한다. */
  delay?: number
  className?: string
}

const Wrapper = styled.div<{ visible: boolean; delay: number }>`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  /* 보인 뒤에는 transform 을 완전히 없앤다.
     transform 이 남아 있으면 이 요소가 position:fixed 자손의 컨테이닝 블록이 되어
     라이트박스 같은 전체화면 오버레이가 이 안에 갇힌다. */
  transform: ${({ visible }) => (visible ? 'none' : 'translateY(28px)')};
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
  transition-delay: ${({ delay }) => delay}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
`

export function Reveal({ children, delay = 0, className }: RevealProps) {
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
      /*
       * rootMargin 으로 뷰포트 아래를 깎지 않는다.
       * 깎으면 그 구간에 들어간 요소는 영영 나타나지 않는데, 페이지 맨 끝
       * 콘텐츠(방명록 마지막 글)는 더 스크롤할 수가 없어 그 구간을 벗어날 방법이 없다.
       *
       * threshold 도 0 으로 둔다. 0 보다 크면 뷰포트보다 큰 요소가
       * 그 비율만큼 보일 수 없어 역시 영영 나타나지 않는다.
       */
      { threshold: 0, rootMargin: '0px' },
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <Wrapper ref={ref} visible={visible} delay={delay} className={className}>
      {children}
    </Wrapper>
  )
}
