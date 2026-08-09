import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
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
