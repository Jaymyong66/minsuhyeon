import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../../theme/theme'
import { CopyButton } from './CopyButton'

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe('CopyButton', () => {
  function mockClipboard() {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    return writeText
  }

  it('copies the given value to the clipboard when clicked', async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    renderWithTheme(<CopyButton value="국민 573101-01-562219" />)

    await user.click(screen.getByRole('button'))

    expect(writeText).toHaveBeenCalledWith('국민 573101-01-562219')
  })

  it('shows a "복사됨" confirmation after copying', async () => {
    const user = userEvent.setup()
    mockClipboard()
    renderWithTheme(<CopyButton value="국민 573101-01-562219" />)

    await user.click(screen.getByRole('button'))

    expect(await screen.findByText('복사됨')).toBeInTheDocument()
  })
})
