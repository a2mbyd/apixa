import type { PathParams } from "../types/http.js";
import type { RequestOptions } from "../types/transport.js";

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
