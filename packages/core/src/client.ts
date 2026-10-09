import { applyAuth } from "./auth.js";
import {
  AbortError,
  ApiError,
  HttpError,
  ParseError,
  TimeoutError,
  ValidationError,
} from "./errors.js";
import {
  buildQueryString,
  createTimeoutSignal,
  interpolatePath,
  joinURL,
  mergeHeaders,
  serializeBody,
} from "./utils.js";
import type {
  ApiConfig,
  ApiResponse,
  CallOptions,
  EndpointDefinition,
  Middleware,
  RequestConfig,
} from "./types.js";

function composeMiddleware(
  request: RequestConfig,
  middleware: Middleware[],
  final: () => Promise<ApiResponse<unknown>>
): () => Promise<ApiResponse<unknown>> {
  return middleware.reduceRight<() => Promise<ApiResponse<unknown>>>(
    (next, mw) => () => mw(request, next),
    final
  );
}

async function runPipeline<TData>(
  api: ApiConfig,
  endpoint: EndpointDefinition<TData>,
  callOptions: CallOptions = {}
): Promise<ApiResponse<TData>> {
  const path = interpolatePath(endpoint.path, callOptions.params);
  const url = `${joinURL(api.baseURL, path)}${buildQueryString(callOptions.query)}`;

  const headers = mergeHeaders(api.headers, endpoint.headers, callOptions.headers);

  const authDisabled = callOptions.auth === false || endpoint.auth === false;
  if (!authDisabled) {
    const auth = endpoint.auth === undefined ? api.auth : endpoint.auth;
    await applyAuth(headers, auth);
  }

  let body = callOptions.body;
  if (endpoint.transformRequest) {
    body = endpoint.transformRequest(body);
  }

  const timeout = callOptions.timeout ?? endpoint.timeout ?? api.timeout;
  const { signal, cleanup } = createTimeoutSignal(timeout, callOptions.signal);

  const request: RequestConfig = {
    method: endpoint.method,
    url,
    path: endpoint.path,
    baseURL: api.baseURL,
    headers,
    params: callOptions.params,
    query: callOptions.query,
    body,
    signal,
    timeout,
  };

  const middleware = [...(api.middleware ?? []), ...(endpoint.middleware ?? [])];

  const execute = async (): Promise<ApiResponse<unknown>> => {
    if (api.mocks?.length) {
      for (const mock of api.mocks) {
        if (mock.match(request)) {
          return mock.resolve(request);
        }
      }
    }

    const transport = api.transport;
    if (!transport) {
      throw new ApiError("No transport configured");
    }

    const serializedBody = serializeBody(request.body, request.headers);

    let transportResponse;
    try {
      transportResponse = await transport.request({
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: serializedBody,
        signal: request.signal,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        error.request ??= request;
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new AbortError("Request was aborted", { request, cause: error });
      }

      throw error;
    }

    const apiResponse: ApiResponse<unknown> = {
      data: transportResponse.body,
      status: transportResponse.status,
      headers: transportResponse.headers,
      raw: transportResponse.raw,
    };

    if (!transportResponse.raw.ok) {
      throw new HttpError(`Request failed with status ${transportResponse.status}`, {
        status: transportResponse.status,
        data: transportResponse.body,
        request,
        response: apiResponse,
      });
    }

    let data: unknown = transportResponse.body;

    try {
      if (endpoint.transformResponse) {
        data = endpoint.transformResponse(data);
      }

      if (endpoint.parse) {
        data = endpoint.parse(data);
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ParseError(error instanceof Error ? error.message : "Failed to parse response", {
        request,
        response: { ...apiResponse, data },
        cause: error,
      });
    }

    try {
      if (endpoint.validate) {
        data = endpoint.validate.validate(data);
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ValidationError(
        error instanceof Error ? error.message : "Response validation failed",
        {
          request,
          response: { ...apiResponse, data },
          cause: error,
        }
      );
    }

    return {
      ...apiResponse,
      data,
    };
  };

  try {
    const run = composeMiddleware(request, middleware, execute);
    return (await run()) as ApiResponse<TData>;
  } catch (error) {
    let normalized: ApiError;

    if (error instanceof ApiError) {
      normalized = error;
    } else if (error instanceof DOMException && error.name === "TimeoutError") {
      normalized = new TimeoutError("Request timed out", { request, cause: error });
    } else if (error instanceof Error && error.name === "AbortError") {
      normalized = new AbortError("Request was aborted", { request, cause: error });
    } else {
      normalized = new ApiError(error instanceof Error ? error.message : "Unknown error", {
        request,
        cause: error,
      });
    }

    api.onError?.(normalized);
    throw normalized;
  } finally {
    cleanup();
  }
}

export function createEndpointCaller<TData>(
  api: ApiConfig,
  endpoint: EndpointDefinition<TData>
) {
  return (callOptions?: CallOptions) => runPipeline(api, endpoint, callOptions);
}
