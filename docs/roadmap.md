# Roadmap

This roadmap describes possible future capabilities. Do not implement them all at once. The active coding contract is always the current version folder under [`versions/`](../versions/).

## Current: v0.1.0 — Foundation

**Spec:** [versions/v0.1.0/](../versions/v0.1.0/)

Prove the main idea: define a resource, get a fully typed client, execute real HTTP requests.

- API and resource definitions via `defineApi()`
- Configurable generated operations (`getAll`, `getByID`, `create`, `update`, `delete`)
- Custom operations that override conventions
- Type inference for arguments, bodies, and responses
- Request execution, URL construction, headers, JSON body
- Default Fetch transport behind a `Transport` interface
- Response handling and standardized errors
- Basic example and root tests

## Next: Reliability and developer experience (approx. v0.2.0)

When v0.1.0 acceptance criteria are met, create `versions/v0.2.0/` before coding.

- Cancellation and `AbortSignal` as a first-class, documented surface
- Timeouts and configurable retries
- Middleware / interceptors as a stable public API
- Optional schema validation hooks (without baking in a schema library)
- Dedicated mocking package or utilities (not coupled to production execution)
- Pagination, filtering, sorting, and search conventions

## Later: Environment and integrations (approx. v0.3.0)

- Browser and server packages
- Secure server-only configuration (secrets must not leak to browser bundles)
- Optional `@apixa/tanstack-query` integration
- Other data-fetching library integrations
- File uploads, downloads, and streaming where appropriate

## Stable platform: v1.0.0 and beyond

- OpenAPI import/export
- Reusable resource definitions and API versioning
- Additional transports (if Fetch-in-Core is no longer enough)
- Observability and tracing
- CLI tooling and optional code generation
- Plugin ecosystem

## Dependency direction (all phases)

```text
integrations → core
core ↛ integrations
```

Core remains framework-agnostic. Caching and UI state management stay outside Core.
