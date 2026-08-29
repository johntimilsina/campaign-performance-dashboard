import { Dashboard } from './components/Dashboard'
import { useMeta } from './lib/queries'

export default function App() {
  const meta = useMeta()

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Campaign outcomes</h1>
      {meta.isPending && <p className="text-sm text-slate-600">Loading filters…</p>}
      {meta.isError && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded border border-red-300 bg-red-50 p-4"
        >
          <p className="text-sm text-red-800">Couldn't load the filter options.</p>
          <button
            type="button"
            onClick={() => void meta.refetch()}
            className="rounded border border-red-400 bg-white px-3 py-1 text-sm font-medium text-red-800 hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}
      {meta.data && <Dashboard meta={meta.data} />}
    </main>
  )
}
