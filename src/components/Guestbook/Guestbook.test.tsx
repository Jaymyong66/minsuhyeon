import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../../theme/theme'
import { Guestbook } from './Guestbook'

const entries = [
  {
    id: '1',
    name: '홍길동',
    message: '결혼 축하해요',
    createdAt: '2026-08-09T13:02:00.000Z',
  },
]

describe('Guestbook', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({ entries }) })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('작성자와 메시지, 작성일을 함께 보여준다', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Guestbook />
      </ThemeProvider>,
    )

    expect(await screen.findByText('홍길동')).toBeInTheDocument()
    expect(screen.getByText('결혼 축하해요')).toBeInTheDocument()
    // UTC 13:02 는 한국 시간으로 같은 날 22:02
    expect(screen.getByText('2026. 08. 09')).toBeInTheDocument()
  })

  it('이름과 메시지가 다 채워지면 남기기 버튼이 진해진다', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <Guestbook />
      </ThemeProvider>,
    )

    const button = screen.getByRole('button', { name: '남기기' })
    const idle = getComputedStyle(button).backgroundColor

    await user.type(screen.getByPlaceholderText('이름'), '홍길동')
    // 한쪽만 채운 상태에서는 아직 그대로
    expect(getComputedStyle(button).backgroundColor).toBe(idle)

    await user.type(screen.getByPlaceholderText('축하 메시지를 남겨주세요'), '축하해요')
    expect(getComputedStyle(button).backgroundColor).not.toBe(idle)
  })

  it('공백만 입력하면 버튼이 진해지지 않는다', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <Guestbook />
      </ThemeProvider>,
    )

    const button = screen.getByRole('button', { name: '남기기' })
    const idle = getComputedStyle(button).backgroundColor

    await user.type(screen.getByPlaceholderText('이름'), '   ')
    await user.type(screen.getByPlaceholderText('축하 메시지를 남겨주세요'), '   ')
    expect(getComputedStyle(button).backgroundColor).toBe(idle)
  })

  it('작성일을 기계가 읽을 수 있는 형태로도 남긴다', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Guestbook />
      </ThemeProvider>,
    )

    const time = await screen.findByText('2026. 08. 09')
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('dateTime', '2026-08-09T13:02:00.000Z')
  })
})
