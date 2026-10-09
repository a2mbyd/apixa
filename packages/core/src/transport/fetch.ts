import { AbortError, NetworkError, TimeoutError } from "../errors.js";
import { isJsonContentType } from "../utils.js";
import type { Transport, TransportRequest, TransportResponse } from "../types.js";

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (isJsonContentType(response.headers)) {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text) as unknown;
  }

  if (contentType.startsWith("text/")) {
    return response.text();
  }

  // Prefer JSON when no content-type is set but body looks like JSON.
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export function createFetchTransport(fetchImpl: typeof fetch = fetch): Transport {
  return {
    async request(input: TransportRequest): Promise<TransportResponse> {
      let response: Response;

      try {
        response = await fetchImpl(input.url, {
          method: input.method,
          headers: input.headers,
          body: input.body,
          signal: input.signal,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw new AbortError("Request was aborted", { cause: error });
        }

        if (
          error instanceof DOMException &&
          (error.name === "TimeoutError" || error.message.includes("timed out"))
        ) {
          throw new TimeoutError("Request timed out", { cause: error });
        }

        if (error instanceof Error && error.name === "AbortError") {
          const reason = (error as { cause?: unknown }).cause;
          if (
            reason instanceof DOMException &&
            (reason.name === "TimeoutError" || reason.message.includes("timed out"))
          ) {
            throw new TimeoutError("Request timed out", { cause: error });
          }
          throw new AbortError("Request was aborted", { cause: error });
        }

        throw new NetworkError(
          error instanceof Error ? error.message : "Network request failed",
          { cause: error }
        );
      }

      let body: unknown;
      try {
        body = await readBody(response);
      } catch (error) {
        body = null;
        // Keep raw response available even if body parsing fails at transport layer.
        void error;
      }

      return {
        status: response.status,
        headers: response.headers,
        raw: response,
        body,
      };
    },
  };
}
