import { defaultDateRange, resolveFilters } from './dateRange'

const RANGE = { from: '2026-02-01', to: '2026-07-30' }

describe('defaultDateRange', () => {
  it('takes the last 30 days of the available range, not of today', () => {
    expect(defaultDateRange(RANGE)).toEqual({ from: '2026-07-01', to: '2026-07-30' })
  })

  it('clamps to the start when the range is shorter than the window', () => {
    expect(defaultDateRange({ from: '2026-07-20', to: '2026-07-30' })).toEqual({
      from: '2026-07-20',
      to: '2026-07-30',
    })
  })
})

describe('resolveFilters', () => {
  it('fills in the missing dates and leaves the channel alone', () => {
    expect(resolveFilters({ channel: 'search' }, RANGE)).toEqual({
      from: '2026-07-01',
      to: '2026-07-30',
      channel: 'search',
    })
  })

  it('keeps dates that are already set', () => {
    expect(resolveFilters({ from: '2026-03-01', to: '2026-03-07' }, RANGE)).toEqual({
      from: '2026-03-01',
      to: '2026-03-07',
    })
  })
})
