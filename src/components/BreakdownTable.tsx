import { formatCurrency, formatNumber, formatRoas } from '../lib/format'
import type { BreakdownRow } from '../types/outcomes'

const HEAD = 'px-3 py-2 font-medium text-slate-700'
const CELL = 'px-3 py-2 text-right tabular-nums'

export function BreakdownTable({ rows }: { rows: BreakdownRow[] }) {
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
        <tbody>
          {rows.map((row) => (
            <tr key={row.channel} className="border-b border-slate-200">
              <th scope="row" className="px-3 py-2 text-left font-normal capitalize">
                {row.channel}
              </th>
              <td className={CELL}>{formatCurrency(row.spend)}</td>
              <td className={CELL}>{formatNumber(row.conversions)}</td>
              <td className={CELL}>{formatCurrency(row.revenue)}</td>
              <td className={CELL}>{formatRoas(row.roas)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
