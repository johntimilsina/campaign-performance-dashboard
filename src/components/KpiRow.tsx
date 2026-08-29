import type { ReactNode } from 'react'
import { formatCurrency, formatNumber, formatRoas } from '../lib/format'
import type { Kpis } from '../types/outcomes'
import { Bar } from './Skeleton'

const LABELS = ['Spend', 'Impressions', 'Conversions', 'ROAS']

function KpiCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-1 basis-40 flex-col gap-1 rounded border border-slate-200 p-4">
      <span className="block text-sm text-slate-600">{label}</span>
      <span className="block text-2xl font-semibold tabular-nums text-slate-900">{value}</span>
    </div>
  )
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-4">{children}</div>
}

export function KpiRow({ kpis }: { kpis: Kpis }) {
  return (
    <Row>
      <KpiCard label="Spend" value={formatCurrency(kpis.spend)} />
      <KpiCard label="Impressions" value={formatNumber(kpis.impressions)} />
      <KpiCard label="Conversions" value={formatNumber(kpis.conversions)} />
      <KpiCard label="ROAS" value={formatRoas(kpis.roas)} />
    </Row>
  )
}

export function KpiRowSkeleton() {
  return (
    <Row>
      {LABELS.map((label) => (
        <KpiCard key={label} label={label} value={<Bar className="h-8 w-28" />} />
      ))}
    </Row>
  )
}
