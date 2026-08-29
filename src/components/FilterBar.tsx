import type { Filters, Meta } from '../types/outcomes'

type Props = {
  meta: Meta
  filters: Filters
  isFetching: boolean
  onChange: (patch: Partial<Filters>) => void
  onReset: () => void
}

const CONTROL = 'h-8 rounded border border-slate-300 px-2 text-sm text-slate-900'
const LABEL = 'text-sm font-medium text-slate-700'

export function FilterBar({ meta, filters, isFetching, onChange, onReset }: Props) {
  return (
    <div className="relative flex flex-wrap items-end gap-4 border-b border-slate-200 pb-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="channel" className={LABEL}>
          Channel
        </label>
        <select
          id="channel"
          className={CONTROL}
          value={filters.channel ?? ''}
          onChange={(e) => onChange({ channel: e.target.value || undefined })}
        >
          <option value="">All channels</option>
          {meta.channels.map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="from" className={LABEL}>
          From
        </label>
        <input
          id="from"
          type="date"
          className={CONTROL}
          value={filters.from ?? ''}
          min={meta.dateRange.from}
          max={filters.to}
          onChange={(e) => onChange({ from: e.target.value || undefined })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="to" className={LABEL}>
          To
        </label>
        <input
          id="to"
          type="date"
          className={CONTROL}
          value={filters.to ?? ''}
          min={filters.from}
          max={meta.dateRange.to}
          onChange={(e) => onChange({ to: e.target.value || undefined })}
        />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="h-8 rounded px-2 text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
      >
        Reset filters
      </button>

      <span role="status" className="flex h-8 items-center text-sm text-slate-600">
        {isFetching ? 'Updating…' : ''}
      </span>

      {isFetching && (
        <div
          aria-hidden="true"
          className="absolute -bottom-px left-0 h-0.5 w-full overflow-hidden bg-slate-200"
        >
          <div className="h-full w-1/4 animate-[indeterminate_1.1s_ease-in-out_infinite] bg-slate-500" />
        </div>
      )}
    </div>
  )
}
