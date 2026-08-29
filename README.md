# Campaign performance dashboard

Campaign outcomes over a mock API, sliced by channel, campaign, audience and date range.

## Running locally

Two terminals, Node 18+.

```bash
npm run server   # API on :8787, no install needed
```

```bash
npm install
npm run dev      # app on :5173
```

`npm test` runs the tests, `npm run build` produces a production build. The rest are in
`package.json`.

## Key decisions

**State.** TanStack Query for the data, the URL for the filters, no global store.

The cache key includes the filters, and that one detail does most of the work. A slow
response for an older selection lands in its own cache entry instead of landing on top of
what you are looking at now, so you can change filters as fast as you like and the screen
still ends up on the last thing you picked. The abort signal is passed to `fetch`, so
requests that no longer matter get cancelled. Debouncing would have made the race rarer
without fixing it.

**One request per selection.** `/outcomes` returns the KPIs, the breakdown and the
timeseries in one payload, so all three panels read from the same object. There is no
window where one shows March and another shows April, because there is nothing to keep in
step.

**Filters live in the URL.** Copy the address bar and you have shared exactly what you are
looking at. Reload and it comes back. It is about 25 lines of `URLSearchParams` and
`replaceState`, which felt like a better trade than adding a router for one screen.

**Old numbers stay up while new ones load,** dimmed, with an indicator, rather than
blanking the screen on every filter change. What is on screen is always one complete
selection, never a blend of two. An empty result says so rather than rendering a bare
table. If a refetch fails while old numbers are up, the banner says so instead of
discarding the last good result.

**Retry is set to 1.** The API fails around 10% of the time. At three retries a visible
failure drops to about one in a thousand, and the error state stops being something you
ever see. In production I would retry more, with backoff.

**The default date range comes from the data.** The seeded range ends in July 2026, so
defaulting to the last 30 days from today would open on an empty screen.

**No virtualisation.** The API aggregates before it responds. The biggest payload is 5
table rows and 180 chart points, so there was nothing to virtualise.

**Accessibility and responsiveness.** Real table markup with scoped headers and a caption,
a label on every control, and the results area is a live region so screen readers are told
when the numbers change. Every control is native, so it all works from the keyboard. No
breakpoints: the cards and filter bar wrap, and the table scrolls sideways in its own
container. Holds down to 375px.

**Tests.** I wrote them first for the parts with a clear contract, the query string builder
and the formatters, and after for the UI, once the shape had settled. The one worth reading
is the race test: it makes an old response arrive late and checks it never reaches the
screen. Take the filters out of the cache key and that test fails, which is the point.

## What I'd do with more time

- **Visual polish.** Styling is deliberately plain, I spent the time on behaviour under
  load. Next would be consistent form controls across browsers and a proper type and
  spacing scale.
- Drop recharts. It is 354kB of the 587kB bundle for a single line chart.
- Debounce the date inputs to cut request volume. Ordering is already handled.
- Ask why the channel breakdown is the only table, since filtering by channel collapses it
  to one row.
- Show something while a request is retrying. Right now a failure that recovers is silent.

## Where I used AI

I spent the first 30 to 45 minutes writing a plan, before any code existed. That covered
the architecture and the reasoning for each call: one request per selection, the URL as the
source of truth, the filters in the cache key, retry at 1, no virtualisation, and which
tests to write first and why. An AI assistant then wrote most of the code to that plan.

The split was on purpose. The decisions are the part that matters and I wanted them settled
before anything was built, so the assistant was implementing a design rather than picking
one. I reviewed every commit and sent it back where it got things wrong.

Three that were worth catching: a stale closure that dropped one of two filters set in the
same tick, skeleton bars up to 31px wider than the numbers they stood in for, and table
columns that resized as the values changed. I can walk through any of it.