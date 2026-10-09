import { createOperationFn, resolveOperation } from "../operation/index.js";
import type { ResolvedApiConfig, ResourceDefinition } from "../types/definition.js";

export function createResourceClient(api: ResolvedApiConfig, resource: ResourceDefinition) {
  const client: Record<string, (...args: unknown[]) => Promise<unknown>> = {};

  for (const [name, definition] of Object.entries(resource.operations)) {
    const operation = resolveOperation(name, resource.path, definition);
    client[name] = createOperationFn(api, operation);
  }

  return client;
}
