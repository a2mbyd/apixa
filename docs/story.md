# Story

Project log. Newest entry first.

## 2026-10-09 — SETUP THE REPO

Landed the full Apixa workspace on main: living docs, v0.1.0 coding contract, Core and basic example packages, FastAPI backend with platform run/stop/restart scripts, tests placeholder, and Cursor rules/commands/skill for the docs/versions workflow. Core `defineApi` implementation is still ahead under v0.1.0.

## 2026-10-09 — Cursor rules, skill, and commands for structure

Added always-on and path-scoped rules under `.cursor/rules/`, the `apixa-workflow` skill, and commands `/start-version`, `/implement-version`, `/check-structure`. Retargeted `/plan-change` and `/git-push` to `a2mbyd/apixa` and wired them to the docs/versions workflow.

## 2026-10-09 — Docs structure for v0.1.0

Landed the living docs layer (`architecture`, `roadmap`, `conventions`, ADRs) and the frozen coding contract under `versions/v0.1.0/`.

Next: implement Core against `versions/v0.1.0/implementation-plan.md` — `defineApi()`, configurable generated operations, Fetch transport in Core, example + tests.
