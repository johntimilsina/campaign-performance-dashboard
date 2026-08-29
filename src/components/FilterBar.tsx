import type { ReactNode } from 'react'
import type { Filters, Meta } from '../types/outcomes'

type Props = {
  meta: Meta
  filters: Filters
  isFetching: boolean
  onChange: (patch: Partial<Filters>) => void
  onReset: () => void
}

const CONTROL = 'h-8 rounded border border-slate-300 px-2 text-sm text-slate-900'

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  )
}

function Choice({
  id,
  label,
  anyLabel,
  options,
  value,
  onChange,
}: {
  id: string
  label: string
  anyLabel: string
  options: string[]
  value: string | undefined
  onChange: (next: string | undefined) => void
}) {
  return (
    <Field id={id} label={label}>
      <select
        id={id}
        className={CONTROL}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
      >
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function FilterBar({ meta, filters, isFetching, onChange, onReset }: Props) {
  return (
    <div className="relative flex flex-wrap items-end gap-4 border-b border-slate-200 pb-4">
      <Choice
        id="channel"
        label="Channel"
        anyLabel="All channels"
        options={meta.channels}
        value={filters.channel}
        onChange={(channel) => onChange({ channel })}
      />
      <Choice
        id="campaign"
        label="Campaign"
        anyLabel="All campaigns"
        options={meta.campaigns}
        value={filters.campaign}
        onChange={(campaign) => onChange({ campaign })}
      />
      <Choice
        id="audience"
        label="Audience"
        anyLabel="All audiences"
        options={meta.audiences}
        value={filters.audience}
        onChange={(audience) => onChange({ audience })}
      />

      <Field id="from" label="From">
        <input
          id="from"
          type="date"
          className={CONTROL}
          value={filters.from ?? ''}
          min={meta.dateRange.from}
          max={filters.to}
          onChange={(e) => onChange({ from: e.target.value || undefined })}
        />
      </Field>

      <Field id="to" label="To">
        <input
          id="to"
          type="date"
          className={CONTROL}
          value={filters.to ?? ''}
          min={filters.from}
          max={meta.dateRange.to}
          onChange={(e) => onChange({ to: e.target.value || undefined })}
        />
      </Field>

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
