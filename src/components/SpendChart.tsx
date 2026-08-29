import type { ReactNode } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCompactCurrency, formatCurrency, formatDayMonth } from '../lib/format'
import type { TimeseriesPoint } from '../types/outcomes'

const AXIS = { stroke: '#94a3b8', fontSize: 12 }

// fixed height, so the chart holds the same space before and after the data lands
function Frame({ children }: { children: ReactNode }) {
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="text-sm font-medium text-slate-700">Spend over time</figcaption>
      <div className="h-64 w-full">{children}</div>
    </figure>
  )
}

export function SpendChart({ points }: { points: TimeseriesPoint[] }) {
  return (
    <Frame>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatDayMonth} tickMargin={8} {...AXIS} />
          <YAxis tickFormatter={formatCompactCurrency} width={64} {...AXIS} />
          <Tooltip
            formatter={(value) => [typeof value === 'number' ? formatCurrency(value) : '', 'Spend']}
            labelFormatter={(label) => (typeof label === 'string' ? formatDayMonth(label) : '')}
          />
          <Line type="monotone" dataKey="spend" stroke="#334155" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Frame>
  )
}

export function SpendChartSkeleton() {
  return (
    <Frame>
      <div className="h-full w-full animate-pulse rounded bg-slate-100" />
    </Frame>
  )
}
