# Apixa × Next.js (primary frontend example)

Real usage of `@apixa/core` inside a Next.js App Router app.

## Prerequisites

1. Build Core once: `pnpm --filter @apixa/core build`
2. Start the FastAPI backend: `./scripts/macos/run-backend.sh` (or linux/win)
3. Optional: `NEXT_PUBLIC_API_URL=http://127.0.0.1:8787`

## Run

From the repo root:

```bash
pnpm example:next
```

Or:

```bash
pnpm --filter @apixa/example-next dev
```

Open http://localhost:3000

## What it shows

| Surface | Apixa call |
| --- | --- |
| Server Component (`app/page.tsx`) | `api.users.getAll()` |
| Client create form | `api.users.create(...)` |
| Client actions | `api.users.update` / `api.users.delete` |

Client definition lives in [`lib/api.ts`](./lib/api.ts).
