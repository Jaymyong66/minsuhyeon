import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../../theme/theme'
import { Toast } from './Toast'
import { MusicToast } from './MusicToast'

const wrap = (ui: React.ReactNode) => <ThemeProvider theme={theme}>{ui}</ThemeProvider>

describe('Toast', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('화면 하단에 뜨고 body 로 포털된다', () => {
    // #root 안에 두면 480px 칼럼이나 Reveal 의 transform 에 갇힌다
    render(wrap(<Toast>복사되었습니다</Toast>))

    const toast = screen.getByRole('status')
    expect(toast).toHaveTextContent('복사되었습니다')
    expect(toast.parentElement).toBe(document.body)
  })

  it('클릭을 가로막지 않는다', () => {
    render(wrap(<Toast>안내</Toast>))
    expect(screen.getByRole('status')).toHaveStyle({ pointerEvents: 'none' })
  })

  it('duration 이 지나면 onDone 을 부른다', () => {
    vi.useFakeTimers()
    const onDone = vi.fn()
    render(wrap(<Toast duration={2000} onDone={onDone}>안내</Toast>))

    act(() => void vi.advanceTimersByTime(1999))
    expect(onDone).not.toHaveBeenCalled()

    // 사라지는 애니메이션이 끝난 뒤에 걷어야 뚝 끊기지 않는다
    act(() => void vi.advanceTimersByTime(1 + 250))
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('duration 이 없으면 스스로 사라지지 않는다', () => {
    vi.useFakeTimers()
    const onDone = vi.fn()
    render(wrap(<Toast onDone={onDone}>안내</Toast>))

    act(() => void vi.advanceTimersByTime(60_000))
    expect(onDone).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})

describe('MusicToast', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('잠시 뒤에 떴다가 스스로 사라진다', () => {
    vi.useFakeTimers()
    render(wrap(<MusicToast />))

    // 인트로가 자리잡기 전에는 뜨지 않는다
    expect(screen.queryByRole('status')).toBeNull()

    act(() => void vi.advanceTimersByTime(800))
    expect(screen.getByRole('status')).toHaveTextContent('배경음악이 준비되었습니다')

    act(() => void vi.advanceTimersByTime(2800 + 250))
    expect(screen.queryByRole('status')).toBeNull()
  })
})
