import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CopyButton } from './CopyButton'

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
    render(<CopyButton value="국민 573101-01-562219" />)

    await user.click(screen.getByRole('button'))

    expect(writeText).toHaveBeenCalledWith('국민 573101-01-562219')
  })

  it('shows a "복사됨" confirmation after copying', async () => {
    const user = userEvent.setup()
    mockClipboard()
    render(<CopyButton value="국민 573101-01-562219" />)

    await user.click(screen.getByRole('button'))

    expect(await screen.findByText('복사됨')).toBeInTheDocument()
  })
})
