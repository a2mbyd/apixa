# v0.3.0 — Acceptance criteria

Check every item before calling v0.3.0 done.

## API and types

- [ ] `type<T>()` returns `Type<T>`; `Infer<Type<T>>` is `T`.
- [ ] `OperationDefinition.body` and `response` accept `Type<…>` markers (optional fields).
- [ ] Inference: op with `response: type<User[]>()` yields `Promise<User[]>`.
- [ ] Inference: op with `body: type<Create>()` yields a body argument of type `Create`.
- [ ] Missing `response` marker yields `unknown` (or equivalent untyped payload).
- [ ] `type`, `Type`, and `Infer` are exported from `@apixa/core` next to `defineApi`.
- [ ] `{} as User` (non-`Type` value) is not assignable to `body` / `response`.
- [ ] Positional call conventions / path arity remain unchanged.
- [ ] Operations return native `Promise<T>` (unwrapped data).

## Constraints

- [ ] No React / Next / TanStack Query in `@apixa/core`.
- [ ] No new packages under `packages/`.
- [ ] No new npm dependencies for this milestone.
- [ ] No runtime schema library.
- [ ] Frozen `versions/v0.1.0/` and `versions/v0.2.0/` not rewritten for new features.
- [ ] The only intentional marker cast is inside `type<T>()`.

## Example and docs

- [ ] Example definitions use `type<T>()` (not `{} as T`).
- [ ] README / living docs describe the marker helper.
- [ ] Changelog entry documents the breaking change from `{} as T`.
- [ ] Follow-ups (`crud<>()`, path-param inference) marked planned, not implemented.
- [ ] `docs/story.md` notes v0.3.0 progress/completion.

## Tests

- [ ] Type tests cover `type` / `Infer` happy path and rejection of `{} as T` on markers.
- [ ] Prior success/error transport tests still pass.
- [ ] `pnpm typecheck` and `pnpm test` pass.

## Sign-off

- [ ] [implementation-plan.md](./implementation-plan.md) steps completed or waived with a note here.
- [ ] [docs/story.md](../../docs/story.md) updated.
