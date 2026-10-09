# v0.1.0 — Acceptance criteria

Check every item before calling v0.1.0 done.

## API and types

- [ ] `defineApi` is the documented public entry for creating a client.
- [ ] A `users` resource can be defined in a few lines with `path` and explicit operations.
- [ ] Configured operations include at least `getAll`, `getByID`, and `create` (plus `update` / `delete` if enabled in the resource config).
- [ ] TypeScript infers argument and response types for those operations without manual cast noise at call sites.
- [ ] Operations return native promises (`Promise<T>` preferred).
- [ ] A custom operation with the same name as a convention **overrides** the generated behavior.
- [ ] Operations that were not configured are **not** present on the client (no silent invention).

## Runtime behavior

- [ ] Successful requests execute over the default Fetch transport (or an injected `Transport` in tests).
- [ ] Path parameters and query parameters are applied correctly to the final URL.
- [ ] JSON request bodies and shared headers are sent as defined.
- [ ] Non-OK HTTP responses throw a documented error type (`HttpError` or subclass of `ApiError`).
- [ ] Network / transport failures surface as documented error types where applicable.

## Constraints

- [ ] `@apixa/core` has no React, Next.js, or TanStack Query dependencies.
- [ ] No new packages under `packages/` for this milestone.
- [ ] Production request path does not require or expose a Core `mocks` product API.
- [ ] Fetch remains the default transport **inside** Core (no premature `@apixa/transport-fetch`).

## Example and docs

- [ ] `examples/basic` runs against the **implemented** `defineApi` API.
- [ ] README usage matches implemented behavior (not aspirational only).
- [ ] Planned ecosystem packages remain clearly marked as future in docs/README.

## Tests

- [ ] Root tests cover definition, generation/overrides, URL building, success path, and error path.
- [ ] Tests use an injectable / fake transport (no flaky live network requirement).
- [ ] `pnpm` typecheck and test scripts relevant to Core pass.

## Sign-off

- [ ] [implementation-plan.md](./implementation-plan.md) steps completed or consciously waived with a note here.
- [ ] [docs/story.md](../../docs/story.md) updated with a completion note.
