import { screen } from '@testing-library/react'
import App from './App'
import { renderWithClient } from './test-utils'

it('renders the shell and a loading state while the filter options are in flight', () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => new Promise(() => {})),
  )
  renderWithClient(<App />)

  expect(screen.getByRole('main')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /campaign outcomes/i })).toBeInTheDocument()
  expect(screen.getByText(/loading filters/i)).toBeInTheDocument()
})
