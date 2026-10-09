import type { ApiResponse, MockHandler, RequestConfig } from "./types.js";

export interface CreateMockOptions {
  method?: string;
  path?: string | RegExp;
  status?: number;
  data?: unknown;
  headers?: HeadersInit;
  delay?: number;
}

function pathMatches(request: RequestConfig, path: string | RegExp): boolean {
  if (path instanceof RegExp) {
    return path.test(request.path) || path.test(request.url);
  }

  // Exact match against the endpoint path template (e.g. `/users/:id`).
  if (request.path === path) {
    return true;
  }

  // Match the concrete URL pathname against patterns with `:param` segments.
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = `^${escaped.replace(/:([A-Za-z0-9_]+)/g, "[^/]+")}$`;
  const matcher = new RegExp(pattern);

  try {
    return matcher.test(new URL(request.url).pathname);
  } catch {
    return false;
  }
}

/** Create a basic mock handler for development and tests. */
export function createMock(options: CreateMockOptions): MockHandler {
  return {
    match(request) {
      if (options.method && request.method !== options.method.toUpperCase()) {
        return false;
      }
      if (options.path && !pathMatches(request, options.path)) {
        return false;
      }
      return true;
    },
    async resolve(request) {
      if (options.delay) {
        await new Promise((resolve) => setTimeout(resolve, options.delay));
      }

      const status = options.status ?? 200;
      const headers = new Headers(options.headers);
      if (!headers.has("content-type")) {
        headers.set("content-type", "application/json");
      }

      const raw = new Response(JSON.stringify(options.data ?? null), {
        status,
        headers,
      });

      const response: ApiResponse<unknown> = {
        data: options.data ?? null,
        status,
        headers,
        raw,
      };

      // Attach request for debugging parity with real responses.
      void request;
      return response;
    },
  };
}
