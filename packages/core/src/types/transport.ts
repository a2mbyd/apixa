import type { HeadersInitLike, HttpMethod, PathParams, QueryParams } from "./http.js";

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  path: string;
  baseURL?: string;
  headers: Headers;
  params?: PathParams;
  query?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
  timeout?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  raw: Response;
}

export interface TransportRequest {
  url: string;
  method: HttpMethod;
  headers: Headers;
  body?: BodyInit | null;
  signal?: AbortSignal;
}

export interface TransportResponse {
  status: number;
  headers: Headers;
  raw: Response;
  /** Parsed JSON when Content-Type is JSON; otherwise text or null. */
  body: unknown;
}

export interface Transport {
  request(input: TransportRequest): Promise<TransportResponse>;
}

export type RequestOptions<TQuery = QueryParams> = {
  query?: TQuery;
  headers?: HeadersInitLike;
  signal?: AbortSignal;
  timeout?: number;
};
