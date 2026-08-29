import { fireEvent, screen, waitFor } from '@testing-library/react'
import App from '../App'
import { renderWithClient } from '../test-utils'

const META = {
  channels: ['search', 'social'],
  campaigns: [],
  audiences: [],
  dateRange: { from: '2026-02-01', to: '2026-07-30' },
}

const outcomes = (spend: number) => ({
  kpis: { spend, impressions: 1, clicks: 1, conversions: 1, revenue: 2, roas: 2 },
  timeseries: [],
  breakdown: [{ channel: 'search', spend: spend + 1, conversions: 1, revenue: 2, roas: 2 }],
  rowCount: 10,
})

const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body })
const serverError = () => ({
  ok: false,
  status: 500,
  json: async () => ({ error: 'upstream query failed' }),
})
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

beforeEach(() => window.history.replaceState(null, '', '/'))
afterEach(() => vi.unstubAllGlobals())

it('shows an error with a retry that refetches', async () => {
  let calls = 0
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      if (String(url).includes('/meta')) return ok(META)
      calls += 1
      return calls === 1 ? serverError() : ok(outcomes(4242))
    }),
  )

  renderWithClient(<App />)

  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  expect(screen.queryByRole('table')).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: /retry/i }))

  await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument())
  expect(screen.getByText('$4,242')).toBeInTheDocument()
  expect(screen.queryByRole('alert')).toBeNull()
})

it('settles on the latest selection when filters change mid-flight', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      const target = String(url)
      if (target.includes('/meta')) return ok(META)
      if (target.includes('channel=social')) {
        await delay(300)
        return ok(outcomes(1111))
      }
      if (target.includes('channel=search')) return ok(outcomes(2222))
      return ok(outcomes(9999))
    }),
  )

  renderWithClient(<App />)
  await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument())

  fireEvent.change(screen.getByLabelText('Channel'), { target: { value: 'social' } })
  fireEvent.change(screen.getByLabelText('Channel'), { target: { value: 'search' } })

  await waitFor(() => expect(screen.getByText('$2,222')).toBeInTheDocument())

  await delay(600)

  expect(screen.queryByText('$1,111')).toBeNull()
  expect(screen.getByText('$2,222')).toBeInTheDocument()
  expect(screen.getByLabelText('Channel')).toHaveValue('search')
})
