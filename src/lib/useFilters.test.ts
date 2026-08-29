import { act, renderHook } from '@testing-library/react'
import { useFilters } from './useFilters'

beforeEach(() => window.history.replaceState(null, '', '/'))

describe('useFilters', () => {
  it('reads the filters out of the url on mount', () => {
    window.history.replaceState(null, '', '/?from=2026-03-01&channel=search')
    const { result } = renderHook(() => useFilters())

    expect(result.current.filters).toEqual({
      from: '2026-03-01',
      to: undefined,
      channel: 'search',
    })
  })

  it('applies every key in a patch, so one does not clobber the other', () => {
    const { result } = renderHook(() => useFilters())

    act(() => result.current.setFilters({ from: '2026-07-01', to: '2026-07-30' }))

    expect(result.current.filters.from).toBe('2026-07-01')
    expect(result.current.filters.to).toBe('2026-07-30')
    expect(window.location.search).toBe('?from=2026-07-01&to=2026-07-30')
  })

  it('leaves the filters it was not given alone', () => {
    window.history.replaceState(null, '', '/?from=2026-03-01&channel=search')
    const { result } = renderHook(() => useFilters())

    act(() => result.current.setFilters({ channel: 'social' }))

    expect(result.current.filters.from).toBe('2026-03-01')
    expect(result.current.filters.channel).toBe('social')
  })

  it('drops a filter set to undefined', () => {
    window.history.replaceState(null, '', '/?from=2026-03-01&channel=search')
    const { result } = renderHook(() => useFilters())

    act(() => result.current.setFilters({ channel: undefined }))

    expect(result.current.filters.channel).toBeUndefined()
    expect(window.location.search).toBe('?from=2026-03-01')
  })

  it('leaves no bare question mark once the last filter is cleared', () => {
    window.history.replaceState(null, '', '/?channel=search')
    const { result } = renderHook(() => useFilters())

    act(() => result.current.setFilters({ channel: undefined }))

    expect(window.location.href).not.toContain('?')
  })
})
