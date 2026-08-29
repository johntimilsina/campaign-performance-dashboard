import { buildQuery } from './buildQuery'

describe('buildQuery', () => {
  it('includes only the filters that are set', () => {
    expect(buildQuery({ from: '2026-03-01', channel: 'search' })).toBe(
      'from=2026-03-01&channel=search',
    )
  })

  it('returns an empty string when nothing is set', () => {
    expect(buildQuery({})).toBe('')
  })

  it('omits empty strings rather than sending blank params', () => {
    expect(buildQuery({ from: '', channel: 'social' })).toBe('channel=social')
  })
})
