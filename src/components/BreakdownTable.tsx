import type { ReactNode } from 'react'
import { formatCurrency, formatNumber, formatRoas } from '../lib/format'
import type { BreakdownRow } from '../types/outcomes'
import { Bar } from './Skeleton'

const HEAD = 'px-3 py-2 font-medium text-slate-700'
const CELL = 'px-3 py-2 text-right tabular-nums'
const ROW = 'border-b border-slate-200'
const ROW_HEAD = 'px-3 py-2 text-left font-normal capitalize'

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] table-fixed border-collapse text-sm">
        <caption className="sr-only">Performance by channel</caption>
        <colgroup>
          <col className="w-[24%]" />
          <col className="w-[19%]" />
          <col className="w-[19%]" />
          <col className="w-[19%]" />
          <col className="w-[19%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-slate-300">
            <th scope="col" className={`${HEAD} text-left`}>
              Channel
            </th>
            <th scope="col" className={`${HEAD} text-right`}>
              Spend
            </th>
            <th scope="col" className={`${HEAD} text-right`}>
              Conversions
            </th>
            <th scope="col" className={`${HEAD} text-right`}>
              Revenue
            </th>
            <th scope="col" className={`${HEAD} text-right`}>
              ROAS
            </th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function BreakdownTable({ rows }: { rows: BreakdownRow[] }) {
  return (
    <Shell>
      {rows.map((row) => (
        <tr key={row.channel} className={ROW}>
          <th scope="row" className={ROW_HEAD}>
            {row.channel}
          </th>
          <td className={CELL}>{formatCurrency(row.spend)}</td>
          <td className={CELL}>{formatNumber(row.conversions)}</td>
          <td className={CELL}>{formatCurrency(row.revenue)}</td>
          <td className={CELL}>{formatRoas(row.roas)}</td>
        </tr>
      ))}
    </Shell>
  )
}

export function BreakdownTableSkeleton({ rows }: { rows: number }) {
  return (
    <Shell>
      {Array.from({ length: rows }, (_, i) => (
        <tr key={i} className={ROW}>
          <th scope="row" className={ROW_HEAD}>
            <Bar className="h-5 w-12" />
          </th>
          <td className={CELL}>
            <Bar className="ml-auto h-5 w-16" />
          </td>
          <td className={CELL}>
            <Bar className="ml-auto h-5 w-10" />
          </td>
          <td className={CELL}>
            <Bar className="ml-auto h-5 w-16" />
          </td>
          <td className={CELL}>
            <Bar className="ml-auto h-5 w-9" />
          </td>
        </tr>
      ))}
    </Shell>
  )
}
