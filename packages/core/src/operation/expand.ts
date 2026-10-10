import type { OperationDefinition } from "../types/definition.js";
import { CONVENTION_DEFAULTS } from "./conventions.js";

/** Merge built-in CRUD defaults with optional resource `operations` overrides. */
export function expandOperations(
  operations?: Record<string, OperationDefinition>,
): Record<string, OperationDefinition> {
  const expanded: Record<string, OperationDefinition> = {};

  for (const name of Object.keys(CONVENTION_DEFAULTS)) {
    expanded[name] = { ...(operations?.[name] ?? {}) };
  }

  if (!operations) {
    return expanded;
  }

  for (const [name, definition] of Object.entries(operations)) {
    expanded[name] = { ...(expanded[name] ?? {}), ...definition };
  }

  return expanded;
}
