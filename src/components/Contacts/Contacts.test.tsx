import { ThemeProvider } from '@emotion/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { theme } from '../../theme/theme'
import { Contacts } from './Contacts'

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe('Contacts', () => {
  it('shows account details without phone numbers', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Contacts />)

    await user.click(screen.getByRole('button', { name: '신랑 측' }))

    expect(screen.getByText('573101-01-562219')).toBeInTheDocument()
    expect(screen.getByText('국민 정민수')).toBeInTheDocument()
    expect(screen.queryByText('010-9133-1476')).not.toBeInTheDocument()
  })
})
