# 002 — Transport abstraction

## Status

Accepted

## Context

HTTP execution needs a stable boundary so Core can:

- Use `fetch` by default in browsers and modern Node.
- Swap transports in tests without mocking the global `fetch` only.
- Support alternate transports later (custom agents, undici options, etc.) without rewriting resource definitions.

A separate `@apixa/transport-fetch` package is possible later, but splitting too early adds workspace and versioning cost before the Core API is proven.

## Decision

- Core exposes a `Transport` interface (`request(input) → Promise<response>`).
- Fetch is the **default** transport implementation and lives **inside** `@apixa/core` for v0.1.0.
- Callers may pass a custom `transport` for tests or special runtimes.
- Do **not** create `@apixa/transport-fetch` until there is a concrete need (bundle size, alternate default, or independent release cadence).

## Consequences

- Resource definitions stay transport-agnostic.
- Tests can inject a fake transport.
- Moving Fetch to its own package later is an extraction, not a redesign.
- Production mocking must not hitch a ride on the transport path as a Core product feature in v0.1.0 (see version scope).
