import { useMemo } from 'react'
import { resolveFilters } from '../lib/dateRange'
import { useOutcomes } from '../lib/queries'
import { useFilters } from '../lib/useFilters'
import type { Filters, Meta } from '../types/outcomes'
import { FilterBar } from './FilterBar'

const CLEARED: Filters = { from: undefined, to: undefined, channel: undefined }

export function Dashboard({ meta }: { meta: Meta }) {
  const { filters, setFilters } = useFilters()
  const resolved = useMemo(() => resolveFilters(filters, meta.dateRange), [filters, meta.dateRange])
  const { data } = useOutcomes(resolved)

  return (
    <div className="flex flex-col gap-6">
      <FilterBar
        meta={meta}
        filters={resolved}
        onChange={setFilters}
        onReset={() => setFilters(CLEARED)}
      />
      <p className="text-sm text-slate-600">{data ? `${data.rowCount} rows` : 'Loading…'}</p>
    </div>
  )
}
