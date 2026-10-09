# 001 — Framework-agnostic Core

## Status

Accepted

## Context

Apixa must work with plain `async`/`await`, Node scripts, browser apps, and future data-fetching libraries. Developers often reach for React Query / TanStack Query, React, or Next.js early. Putting those libraries inside Core would force every consumer to inherit UI and caching assumptions.

## Decision

- `@apixa/core` must not depend on React, Next.js, TanStack Query, or other UI / data-fetching libraries.
- Core operations return ordinary `Promise<T>` values so they compose with any consumer.
- Optional integrations (for example `@apixa/tanstack-query`) may exist later as separate packages.
- **Dependency direction:** integrations depend on Core; Core never depends on integrations.
- Caching and application state management stay outside Core.

## Consequences

- Core stays small and usable in non-React environments.
- TanStack Query (and similar) become optional DX layers, not prerequisites.
- Query-key helpers and cache invalidation are out of scope for Core and for v0.1.0.
- Reviewers should reject PRs that add framework dependencies to `packages/core`.
