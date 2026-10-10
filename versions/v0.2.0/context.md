# v0.2.0 — Context

Frozen milestone context. Living project context: [`docs/context.md`](../../docs/context.md).

## Goal

Make resource definitions **default-first**: a resource with only `path` gets built-in CRUD operations, and developers configure only what differs from the defaults.

> Define `users: { path: "/users" }` and call `api.users.getAll()` without listing every operation.

## Identity (this release)

- Package: `@apixa/core` (continue `0.1.x` / bump as release process decides)
- Scope: **Core only** — no new workspace packages
- Baseline: v0.1.0 shipped opt-in `operations`; this release revises that DX

## What success looks like

```ts
const api = defineApi({
  baseURL: "https://api.example.com",
  headers: { Accept: "application/json" },
  users: {
    path: "/users",
  },
});

await api.users.getAll();
await api.users.getByID("123");
await api.users.create({ name: "Ada", email: "ada@example.com" });
await api.users.update("123", { name: "Ada Lovelace" });
await api.users.delete("123");
```

Optional overrides stay partial:

```ts
users: {
  path: "/users",
  headers: { "X-Client": "dashboard" },
  operations: {
    getAll: { path: "/active" },
    update: { method: "PATCH" },
  },
}
```

Argument conventions stay **positional** as in v0.1.0 (`getByID(id)`, `update(id, body)`), not object bags, unless a later milestone changes them.

## Principles that bind this release

1. Built-in CRUD is the default for a resource with `path`.
2. `operations` is optional; when present, it **merges** overrides into builtins (and may add custom ops).
3. Custom / explicit operation settings win over convention defaults.
4. Merge by field semantics (headers by key; scalars most-specific wins; paths resolve with resource prefix).
5. Type inference first — no `any` shortcuts.
6. Native `Promise<T>`; framework-agnostic Core; Fetch transport stays in Core.
7. Docs and examples honest: show minimal definition first.
8. No runtime schema library in this milestone — keep `body` / `response` type markers.

## Non-goals for this folder

Schema validation libraries, TanStack Query, OpenAPI, mocking package, retries, pagination conventions, `getBySlug` / `getByUUID` / `getBy`, object-style call signatures, new packages.

See [scope.md](./scope.md).
