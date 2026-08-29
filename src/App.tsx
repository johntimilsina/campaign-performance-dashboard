import { Dashboard } from './components/Dashboard'
import { useMeta } from './lib/queries'

export default function App() {
  const meta = useMeta()

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Campaign outcomes</h1>
      {meta.isPending && <p className="text-sm text-slate-600">Loading filters…</p>}
      {meta.isError && <p className="text-sm text-red-700">Could not load filter options.</p>}
      {meta.data && <Dashboard meta={meta.data} />}
    </main>
  )
}
