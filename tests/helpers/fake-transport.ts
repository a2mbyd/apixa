import type { Transport, TransportRequest, TransportResponse } from "@apixa/core";

export interface FakeResult {
  status?: number;
  body?: unknown;
  headers?: HeadersInit;
}

export function createFakeTransport(
  handler: (request: TransportRequest) => FakeResult | Promise<FakeResult>,
): Transport {
  return {
    async request(input: TransportRequest): Promise<TransportResponse> {
      const result = await handler(input);
      const status = result.status ?? 200;
      const body = result.body ?? null;
      const headers = new Headers(result.headers);

      if (body !== null && body !== undefined && !headers.has("content-type") && status !== 204) {
        headers.set("content-type", "application/json");
      }

      const rawBody =
        status === 204 || body === null || body === undefined
          ? null
          : typeof body === "string"
            ? body
            : JSON.stringify(body);

      const raw = new Response(rawBody, { status, headers });

      return {
        status,
        headers: raw.headers,
        raw,
        body,
      };
    },
  };
}
