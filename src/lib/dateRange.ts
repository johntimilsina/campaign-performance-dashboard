import type { Filters } from '../types/outcomes'

const DAY_MS = 86400000

type DateRange = { from: string; to: string }

// anchored to the end of the available range, not to today, which is past the data
export function defaultDateRange(range: DateRange, days = 30): DateRange {
  const end = Date.parse(`${range.to}T00:00:00Z`)
  const earliest = Date.parse(`${range.from}T00:00:00Z`)
  const start = Math.max(end - (days - 1) * DAY_MS, earliest)
  return { from: new Date(start).toISOString().slice(0, 10), to: range.to }
}

export function resolveFilters(filters: Filters, range: DateRange): Filters {
  const fallback = defaultDateRange(range)
  return {
    ...filters,
    from: filters.from ?? fallback.from,
    to: filters.to ?? fallback.to,
  }
}
