import type { HeadersInitLike, PathParams, QueryParams } from "./types.js";

export function mergeHeaders(...sources: Array<HeadersInitLike | undefined>): Headers {
  const headers = new Headers();

  for (const source of sources) {
    if (!source) continue;

    if (source instanceof Headers) {
      source.forEach((value, key) => {
        headers.set(key, value);
      });
      continue;
    }

    if (Array.isArray(source)) {
      for (const [key, value] of source) {
        headers.set(key, value);
      }
      continue;
    }

    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) {
        headers.delete(key);
      } else {
        headers.set(key, value);
      }
    }
  }

  return headers;
}

export function interpolatePath(path: string, params?: PathParams): string {
  if (!params) return path;

  return path.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => {
    const value = params[key];
    if (value === undefined) {
      throw new Error(`Missing path parameter: ${key}`);
    }
    return encodeURIComponent(String(value));
  });
}

export function buildQueryString(query?: QueryParams): string {
  if (!query) return "";

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        search.append(key, String(item));
      }
    } else {
      search.set(key, String(value));
    }
  }

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function joinURL(baseURL: string, path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = baseURL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function isJsonContentType(headers: Headers): boolean {
  const contentType = headers.get("content-type") ?? "";
  return contentType.includes("application/json") || contentType.includes("+json");
}

export function serializeBody(
  body: unknown,
  headers: Headers
): BodyInit | null | undefined {
  if (body === undefined || body === null) {
    return body as null | undefined;
  }

  if (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  ) {
    return body as BodyInit;
  }

  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return JSON.stringify(body);
}

export function createTimeoutSignal(
  timeoutMs: number | undefined,
  external?: AbortSignal
): { signal?: AbortSignal; cleanup: () => void } {
  if (!timeoutMs && !external) {
    return { cleanup: () => undefined };
  }

  if (!timeoutMs) {
    return { signal: external, cleanup: () => undefined };
  }

  const controller = new AbortController();
  const onExternalAbort = () => {
    controller.abort(external?.reason);
  };

  if (external) {
    if (external.aborted) {
      controller.abort(external.reason);
    } else {
      external.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  const timer = setTimeout(() => {
    controller.abort(new DOMException("Request timed out", "TimeoutError"));
  }, timeoutMs);

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      external?.removeEventListener("abort", onExternalAbort);
    },
  };
}
