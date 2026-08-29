import type { Filters, Meta, OutcomesResponse } from '../types/outcomes'
import { buildQuery } from './buildQuery'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8787'

// throws on a non-ok response, so a 500 surfaces as a failed request rather than
// resolving with an error body the caller has to remember to check
async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { signal })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json() as Promise<T>
}

export const fetchMeta = (signal?: AbortSignal) => get<Meta>('/meta', signal)

export function fetchOutcomes(filters: Filters, signal?: AbortSignal) {
  const query = buildQuery(filters)
  return get<OutcomesResponse>(`/outcomes${query ? `?${query}` : ''}`, signal)
}
