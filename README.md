# Campaign performance dashboard

## Running locally

Node 18 or newer, and two terminals. Start the API first, or the dashboard has nothing
to load.

```bash
node server.js   # outcome API on http://localhost:8787, no install needed
```

Then, in a second terminal:

```bash
npm install
npm run dev      # dashboard on http://localhost:5173
```

## Scripts

| Command              | Purpose                       |
| -------------------- | ----------------------------- |
| `npm run server`     | Start the mock API on :8787   |
| `npm run dev`        | Start the dev server on :5173 |
| `npm run build`      | Production build              |
| `npm run preview`    | Preview the production build  |
| `npm run lint`       | Lint                          |
| `npm run format`     | Format                        |
| `npm run test`       | Run tests once                |
| `npm run test:watch` | Run tests in watch mode       |
