import { useMemo } from 'react'
import { resolveFilters } from '../lib/dateRange'
import { useOutcomes } from '../lib/queries'
import { useFilters } from '../lib/useFilters'
import type { Filters, Meta } from '../types/outcomes'
import { BreakdownTable, BreakdownTableSkeleton } from './BreakdownTable'
import { FilterBar } from './FilterBar'
import { KpiRow, KpiRowSkeleton } from './KpiRow'

const CLEARED: Filters = {
  from: undefined,
  to: undefined,
  channel: undefined,
  campaign: undefined,
  audience: undefined,
}

function EmptyState() {
  return (
    <div className="rounded border border-slate-200 p-8 text-center">
      <p className="font-medium text-slate-900">No data for this selection</p>
      <p className="mt-1 text-sm text-slate-600">
        Try widening the date range or clearing the channel filter.
      </p>
    </div>
  )
}

function ErrorBanner({ stale, onRetry }: { stale: boolean; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 rounded border border-red-300 bg-red-50 p-4"
    >
      <p className="text-sm text-red-800">
        {stale
          ? "Couldn't refresh. The numbers below are from the last result that loaded."
          : "Couldn't load the data."}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded border border-red-400 bg-white px-3 py-1 text-sm font-medium text-red-800 hover:bg-red-100"
      >
        Retry
      </button>
    </div>
  )
}

export function Dashboard({ meta }: { meta: Meta }) {
  const { filters, setFilters } = useFilters()
  const resolved = useMemo(() => resolveFilters(filters, meta.dateRange), [filters, meta.dateRange])
  const { data, isPending, isFetching, isError, refetch } = useOutcomes(resolved)

  return (
    <div className="flex flex-col gap-6">
      <FilterBar
        meta={meta}
        filters={resolved}
        isFetching={isFetching}
        onChange={setFilters}
        onReset={() => setFilters(CLEARED)}
      />

      <section aria-busy={isFetching} aria-live="polite" className="flex flex-col gap-6">
        {isError && <ErrorBanner stale={Boolean(data)} onRetry={() => void refetch()} />}
        {isPending && (
          <>
            <KpiRowSkeleton />
            <BreakdownTableSkeleton rows={resolved.channel ? 1 : meta.channels.length} />
          </>
        )}
        {data && data.rowCount === 0 && <EmptyState />}
        {data && data.rowCount > 0 && (
          <div className={`flex flex-col gap-6 ${isFetching ? 'opacity-60' : ''}`}>
            <KpiRow kpis={data.kpis} />
            <BreakdownTable rows={data.breakdown} />
          </div>
        )}
      </section>
    </div>
  )
}
