import { executeRequest } from "./client.js";
import { extractPathParamNames, joinPath } from "./utils.js";
import type {
  HttpMethod,
  OperationDefinition,
  PathParams,
  RequestOptions,
  ResolvedApiConfig,
  ResolvedOperation,
} from "./types.js";

const CONVENTION_DEFAULTS: Record<string, { method: HttpMethod; path: string }> = {
  getAll: { method: "GET", path: "" },
  getByID: { method: "GET", path: "/:id" },
  create: { method: "POST", path: "" },
  update: { method: "PUT", path: "/:id" },
  delete: { method: "DELETE", path: "/:id" },
};

export function resolveOperation(
  name: string,
  resourcePath: string,
  definition: OperationDefinition,
): ResolvedOperation {
  const defaults = CONVENTION_DEFAULTS[name];
  const method = definition.method ?? defaults?.method;

  if (!method) {
    throw new Error(
      `Operation "${name}" is missing method. Convention names (getAll, getByID, create, update, delete) supply a default; custom operations must set method.`,
    );
  }

  const relativePath = definition.path ?? defaults?.path ?? "";

  return {
    name,
    method,
    path: joinPath(resourcePath, relativePath),
    hasBody: Object.prototype.hasOwnProperty.call(definition, "body"),
    headers: definition.headers,
    timeout: definition.timeout,
  };
}

export function parseOperationArgs(
  pathParamNames: string[],
  hasBody: boolean,
  args: unknown[],
): {
  params?: PathParams;
  body?: unknown;
  options?: RequestOptions;
} {
  let index = 0;
  let params: PathParams | undefined;

  if (pathParamNames.length === 1) {
    const name = pathParamNames[0]!;
    params = { [name]: args[index++] as string | number };
  } else if (pathParamNames.length > 1) {
    params = args[index++] as PathParams;
  }

  const body = hasBody ? args[index++] : undefined;
  const options = args[index] as RequestOptions | undefined;

  return { params, body, options };
}

export function createOperationFn(api: ResolvedApiConfig, operation: ResolvedOperation) {
  const pathParamNames = extractPathParamNames(operation.path);

  return (...args: unknown[]) => {
    const parsed = parseOperationArgs(pathParamNames, operation.hasBody, args);

    return executeRequest(api, operation, {
      params: parsed.params,
      query: parsed.options?.query,
      body: parsed.body,
      headers: parsed.options?.headers,
      signal: parsed.options?.signal,
      timeout: parsed.options?.timeout,
    });
  };
}
