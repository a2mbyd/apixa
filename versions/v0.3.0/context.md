# v0.3.0 — Context

Frozen milestone context. Living project context: [`docs/context.md`](../../docs/context.md).

## Goal

Replace per-operation casts (`response: {} as User`) with a branded marker helper `type<T>()` so the **only** cast lives inside Core and definitions never write `as`.

> Declare `response: type<User[]>()` and get `Promise<User[]>` — no user-facing casts.

## Identity (this release)

- Package: `@apixa/core` (continue `0.1.x` / bump as release process decides)
- Scope: **Core only** — no new workspace packages
- Baseline: v0.2.0 shipped default-first resources and `{} as T` type markers; this release revises the **typing** DX only

## What success looks like

```ts
import { defineApi, type } from "@apixa/core";

type User = { id: string; name: string; email: string };

const api = defineApi({
  baseURL: "https://api.example.com",
  users: {
    path: "/users",
    operations: {
      getAll: { method: "GET", response: type<User[]>() },
      create: {
        method: "POST",
        body: type<Omit<User, "id">>(),
        response: type<User>(),
      },
      delete: {
        method: "DELETE",
        path: "/:id",
        response: type<void>(),
      },
    },
  },
});

const users: User[] = await api.users.getAll();
const created: User = await api.users.create({ name: "Ada", email: "ada@example.com" });
await api.users.delete("123");
```

`body` / `response` accept `Type<T>` from `type<T>()`. Plain `{} as User` no longer type-checks.

Call conventions stay **positional** (path arity from prior releases unchanged). This milestone does not change how arguments are passed.

## Principles that bind this release

1. One cast in the library: inside `type<T>()`.
2. Per-operation markers only — no resource-level `types` bag.
3. Inference unwraps markers with `Infer<M>`; missing `response` ⇒ `unknown`.
4. No types inferred from method, path, or operation names.
5. Native `Promise<T>`; framework-agnostic Core; Fetch transport stays in Core.
6. No schema library / runtime validation in this milestone.
7. Docs honest: show `type<T>()` as the supported marker; document the breaking change.
8. Do not rewrite frozen `versions/v0.1.0/` or `versions/v0.2.0/` for new features.

## Follow-ups (documented, not built)

- `crud<Entity, Create = Omit<Entity, "id">, Update = Partial<Entity>>()` preset returning plain typed operation objects (getAll → `Entity[]`, getByID/create/update → `Entity`, delete → `void`), spreadable into `operations` and overridable per op. Response envelopes configured at the preset level, never inferred. Needs no core type changes beyond this milestone’s markers.
- Path param inference from `"/:id"` via template-literal types.

## Non-goals for this folder

Resource-level `types` bags, schema libraries (Zod / Standard Schema), runtime validation, codegen, OpenAPI, call-style changes, new packages, reliability work (abort, retries, middleware), mocking package, pagination conventions.

See [scope.md](./scope.md).
