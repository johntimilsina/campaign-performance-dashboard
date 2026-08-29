import { useState } from 'react'
import type { Filters } from '../types/outcomes'

export function useFilters() {
  const [params, setParams] = useState(() => new URLSearchParams(window.location.search))

  const filters: Filters = {
    from: params.get('from') ?? undefined,
    to: params.get('to') ?? undefined,
    channel: params.get('channel') ?? undefined,
  }

  function setFilters(patch: Partial<Filters>) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    const query = next.toString()
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
    setParams(next)
  }

  return { filters, setFilters }
}
