# v0.2.0 — Acceptance criteria

Check every item before calling v0.2.0 done.

## API and types

- [x] A resource defined with only `path` exposes `getAll`, `getByID`, `create`, `update`, and `delete`.
- [x] Those builtins are callable at runtime (not type-only).
- [x] `operations` may be omitted entirely.
- [x] A partial `operations` override (path and/or method and/or headers) keeps other builtins available.
- [x] Custom operations coexist with builtins under distinct names.
- [x] TypeScript infers builtin and override/custom operation signatures without cast noise at call sites.
- [x] Call conventions remain positional (`getByID(id)`, `update(id, body)`, …).
- [x] Operations return native `Promise<T>` (unwrapped data).

## Runtime behavior

- [x] Builtin defaults use established method/path conventions (`GET ""`, `GET /:id`, `POST ""`, `PUT /:id`, `DELETE /:id`).
- [x] Resource-level headers apply to requests unless overridden at operation or call level.
- [x] Operation-level path/method/header overrides change only that operation.
- [x] Header merge prefers the more specific value by key.
- [x] Existing error and transport behavior remains (Fetch default, injectable `Transport` in tests).

## Constraints

- [x] No React / Next / TanStack Query in `@apixa/core`.
- [x] No new packages under `packages/`.
- [x] No runtime schema library dependency for this milestone.
- [x] Frozen `versions/v0.1.0/` not rewritten for new features.

## Example and docs

- [x] Examples show path-only (or minimal) resource definition first.
- [x] README matches implemented default-first behavior.
- [x] Living docs / architecture describe default-first + override merge.
- [x] `docs/story.md` notes v0.2.0 progress/completion.

## Tests

- [x] Path-only resource exposes all five builtins with expected method/path.
- [x] Partial overrides and header merge covered.
- [x] Custom ops coexist; other builtins remain after override.
- [x] Prior success/error transport tests still pass (updated where defaults change).
- [x] `pnpm typecheck` and `pnpm test` pass.

## Sign-off

- [x] [implementation-plan.md](./implementation-plan.md) steps completed or waived with a note here.
- [x] [docs/story.md](../../docs/story.md) updated.

Implementation-plan notes: all five steps completed. Resource-level `request` / credentials left out (not wired end-to-end). Schema remains type markers only.
