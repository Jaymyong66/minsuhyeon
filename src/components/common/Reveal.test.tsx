import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../../theme/theme'
import { Reveal } from './Reveal'

type Cb = (entries: { isIntersecting: boolean }[]) => void

/** 생성된 IntersectionObserver 를 붙잡아 두고 직접 콜백을 쏠 수 있게 한다 */
function stubObserver() {
  const created: { options: IntersectionObserverInit; fire: Cb }[] = []
  class FakeObserver {
    fire: Cb
    constructor(cb: Cb, options: IntersectionObserverInit = {}) {
      this.fire = cb
      created.push({ options, fire: cb })
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('IntersectionObserver', FakeObserver)
  return created
}

const renderReveal = () =>
  render(
    <ThemeProvider theme={theme}>
      <Reveal>
        <p>내용</p>
      </Reveal>
    </ThemeProvider>,
  )

describe('Reveal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('화면에 들어오면 나타난다', () => {
    const created = stubObserver()
    renderReveal()

    const wrapper = screen.getByText('내용').parentElement!
    expect(wrapper).toHaveStyle({ opacity: '0' })

    act(() => created[0].fire([{ isIntersecting: true }]))
    expect(wrapper).toHaveStyle({ opacity: '1' })
  })

  it('나타난 뒤에는 transform 을 남기지 않는다', () => {
    // transform 이 남으면 position:fixed 자손의 컨테이닝 블록이 되어
    // 라이트박스 같은 전체화면 오버레이가 이 안에 갇힌다.
    const created = stubObserver()
    renderReveal()

    act(() => created[0].fire([{ isIntersecting: true }]))
    expect(screen.getByText('내용').parentElement!).toHaveStyle({ transform: 'none' })
  })

  it('뷰포트 아래를 깎지 않는다', () => {
    // 깎으면 페이지 맨 끝 콘텐츠가 그 구간에 갇혀 영영 나타나지 않는다.
    // 더 스크롤할 수가 없어 빠져나올 방법이 없기 때문이다.
    const created = stubObserver()
    renderReveal()

    const { rootMargin } = created[0].options
    const bottom = String(rootMargin ?? '0px').split(/\s+/)[2] ?? '0px'
    expect(parseFloat(bottom)).toBeGreaterThanOrEqual(0)
  })

  it('threshold 를 두지 않는다', () => {
    // 0 보다 크면 뷰포트보다 큰 요소는 그 비율만큼 보일 수 없어 나타나지 못한다.
    const created = stubObserver()
    renderReveal()

    expect(created[0].options.threshold ?? 0).toBe(0)
  })

  it('IntersectionObserver 가 없으면 그냥 보여준다', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    renderReveal()

    expect(screen.getByText('내용').parentElement!).toHaveStyle({ opacity: '1' })
  })
})
