import type { Filters } from '../types/outcomes'

export function buildQuery(filters: Filters): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value)
  }
  return params.toString()
}
