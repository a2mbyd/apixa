# Apixa

**Define your API once. Use it everywhere.**

Apixa is an open-source, TypeScript-first library for defining APIs and generating fully typed API clients from a single source of truth.

Instead of repeatedly writing request functions, types, URL construction, and response handling for every resource, Apixa aims to let you define your API once and handle the repetitive mechanics automatically.

## Why Apixa?

Working with APIs often means repeating the same patterns across resources and projects:

- Writing request functions for every endpoint.
- Maintaining request and response types separately.
- Reimplementing headers, parsing, and error handling.
- Repeating common resource operations.
- Integrating API calls with different data-fetching libraries.

Apixa aims to reduce this duplication while preserving TypeScript's type safety and flexibility.

## Core Principles

- **Define once:** Keep API definitions in a single source of truth.
- **Type-safe by design:** Infer request arguments and response types from definitions.
- **Convention-driven:** Generate common resource operations where appropriate.
- **Fully customizable:** Support custom endpoints and override generated behavior.
- **Framework-agnostic:** Keep the core independent of UI frameworks and data-fetching libraries.
- **Composable:** Allow additional capabilities through optional packages.

## Vision

Apixa is being designed around a small, extensible core that can grow into a broader API development ecosystem.

Planned capabilities include:

- Resource and endpoint definitions.
- Automatically generated resource methods.
- Typed request and response handling.
- Configurable headers, transports, and middleware.
- Standardized errors and response parsing.
- Mocking and testing utilities.
- Optional TanStack Query integration.
- Browser and server support.
- OpenAPI interoperability.

These are planned capabilities, not a claim that they are all currently implemented.

## Design Philosophy

Apixa Core will provide API definitions, type inference, and request execution without requiring React, TanStack Query, or a particular runtime framework.

Integrations will build on the core rather than become dependencies of it.

API methods are intended to return native promises, allowing them to work naturally with `async`/`await` and libraries such as TanStack Query.

## Project Structure

```text
packages/
  core/             # API definitions and execution (current focus)
backend/            # FastAPI HTTP server for local/dev checks
examples/
  basic/
tests/              # Automated tests (added during v0.1.0 coding)
docs/               # Living context, architecture, roadmap, ADRs
versions/
  v0.1.0/           # Active coding contract
```

Planned later packages (not created yet): `transport-fetch`, `client`, `server`, `mocking`, `tanstack-query`, `openapi`.

## Documentation

| Doc | Purpose |
| --- | --- |
| [docs/context.md](./docs/context.md) | Project identity, principles, constraints |
| [docs/architecture.md](./docs/architecture.md) | Core shape and request flow |
| [docs/roadmap.md](./docs/roadmap.md) | Milestones and future phases |
| [docs/conventions.md](./docs/conventions.md) | How we build and document |
| [versions/v0.1.0/](./versions/v0.1.0/) | **Current coding contract** (scope, plan, acceptance) |

## Project Status

Apixa is in early development at **v0.1.0**. The public API is being established around `defineApi()` and configurable resource operations. Architecture and feature set may change as Core is validated.

See [versions/v0.1.0/acceptance-criteria.md](./versions/v0.1.0/acceptance-criteria.md) for what “done” means for this milestone.

## Author

Created and maintained by **Abdalrahman bani younes** ([a2mbyd](https://github.com/a2mbyd)).

## License

Apixa is licensed under the MIT License. See [LICENSE](./LICENSE) for details.