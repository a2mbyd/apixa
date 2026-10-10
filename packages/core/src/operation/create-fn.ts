import { extractPathParamNames } from "../http/path.js";
import { executeRequest } from "../request/execute.js";
import type {
  ResolvedApiConfig,
  ResolvedOperation,
  ResolvedResourceConfig,
} from "../types/definition.js";
import { parseOperationArgs } from "./args.js";

export function createOperationFn(
  api: ResolvedApiConfig,
  resource: ResolvedResourceConfig,
  operation: ResolvedOperation,
) {
  const pathParamNames = extractPathParamNames(operation.path);

  return (...args: unknown[]) => {
    const parsed = parseOperationArgs(pathParamNames, operation.hasBody, args);

    return executeRequest(api, resource, operation, {
      params: parsed.params,
      query: parsed.options?.query,
      body: parsed.body,
      headers: parsed.options?.headers,
      signal: parsed.options?.signal,
      timeout: parsed.options?.timeout,
    });
  };
}
