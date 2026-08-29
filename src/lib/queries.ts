import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { Filters } from '../types/outcomes'
import { fetchMeta, fetchOutcomes } from './api'

export function useMeta() {
  return useQuery({
    queryKey: ['meta'],
    queryFn: ({ signal }) => fetchMeta(signal),
    staleTime: Infinity,
  })
}

export function useOutcomes(filters: Filters) {
  return useQuery({
    queryKey: ['outcomes', filters],
    queryFn: ({ signal }) => fetchOutcomes(filters, signal),
    placeholderData: keepPreviousData,
  })
}
