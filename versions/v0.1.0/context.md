# v0.1.0 — Context

Frozen milestone context. Living project context: [`docs/context.md`](../../docs/context.md).

## Goal

Establish a minimal, scalable Core that proves:

> A developer defines a resource in a few lines, obtains a fully typed client, and executes real HTTP requests without manually implementing every repetitive request function.

## Identity (this release)

- Package: `@apixa/core` at `0.1.0`
- Tagline: Define your API once. Use it everywhere.
- License: MIT
- Stack: TypeScript + pnpm monorepo
- Scope: **Core only** — no integration packages

## What success looks like

```ts
const api = defineApi({
  baseURL: "https://api.example.com",
  users: {
    path: "/users",
    // operations configured explicitly — no silent invention
  },
});

const users = await api.users.getAll();
const user = await api.users.getByID("123");
const created = await api.users.create({ name: "Ada", email: "ada@example.com" });
```

Exact option shapes are decided in the implementation plan; the intent is clear semantics, type inference, and real HTTP via Fetch.

## Principles that bind this release

1. Single source of truth for resources and operations.
2. Type inference first.
3. Convention-driven **when configured**; custom endpoints override conventions.
4. Native `Promise<T>` — no custom Promise wrappers.
5. Framework-agnostic Core (no React / Next / TanStack Query).
6. Fetch default transport behind a `Transport` interface, kept inside Core.
7. No false assumptions about which backend endpoints exist.
8. Docs honest about implemented vs planned.

## Baseline in the repo today

The scaffold already has a **manual** endpoint client (`createApi` + `resource({ endpoints: { list: get(...) } })`), Fetch transport, URL helpers, and error types.

v0.1.0 **reshapes** that scaffold toward `defineApi` + configurable generated operations. It does not throw away the pipeline, transport, utils, or errors.

## Non-goals for this folder

Full ecosystem packages, TanStack Query helpers, OpenAPI, production mocking product surface, auth as a Core product feature, retries, pagination.

See [scope.md](./scope.md).
