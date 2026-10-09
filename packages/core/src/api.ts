import { createOperationFn, resolveOperation } from "./endpoint.js";
import { createFetchTransport } from "./transport/fetch.js";
import type {
  ApiClient,
  ApiRootConfig,
  ResourceDefinition,
  ResolvedApiConfig,
  ValidateApiConfig,
} from "./types.js";

const RESERVED_KEYS = new Set(["baseURL", "headers", "transport", "timeout"]);

function createResourceClient(api: ResolvedApiConfig, resource: ResourceDefinition) {
  const client: Record<string, (...args: unknown[]) => Promise<unknown>> = {};

  for (const [name, definition] of Object.entries(resource.operations)) {
    const operation = resolveOperation(name, resource.path, definition);
    client[name] = createOperationFn(api, operation);
  }

  return client;
}

export function defineApi<const T extends ValidateApiConfig<T> & ApiRootConfig>(
  config: T,
): ApiClient<T> {
  const resolved: ResolvedApiConfig = {
    baseURL: config.baseURL,
    headers: config.headers,
    transport: config.transport ?? createFetchTransport(),
    timeout: config.timeout,
  };

  const client = {} as ApiClient<T>;

  for (const [key, value] of Object.entries(config)) {
    if (RESERVED_KEYS.has(key)) continue;

    (client as Record<string, unknown>)[key] = createResourceClient(
      resolved,
      value as ResourceDefinition,
    );
  }

  return client;
}
