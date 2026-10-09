import type { ApiError } from "./errors.js";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type PathParams = Record<string, string | number>;
export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined | Array<string | number | boolean>
>;

export type HeadersInitLike = HeadersInit | Record<string, string | undefined>;

export interface Validator<T> {
  validate(value: unknown): T;
}

export type Parser<T> = (data: unknown) => T;
export type TransformFn<T = unknown, R = unknown> = (value: T) => R;

export interface AuthConfig {
  type: "bearer" | "apiKey" | "basic" | "custom";
  /** Bearer token, or a function that returns one. */
  token?: string | (() => string | Promise<string>);
  /** API key value. */
  key?: string | (() => string | Promise<string>);
  /** Header name for API key auth. Defaults to `X-API-Key`. */
  header?: string;
  /** Basic auth username. */
  username?: string;
  /** Basic auth password. */
  password?: string;
  /** Custom auth handler — mutates or returns headers to merge. */
  apply?: (headers: Headers) => void | Promise<void>;
}

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

export type MiddlewareNext = () => Promise<ApiResponse<unknown>>;

export type Middleware = (
  request: RequestConfig,
  next: MiddlewareNext
) => Promise<ApiResponse<unknown>>;

export interface EndpointDefinition<TData = unknown> {
  method: HttpMethod;
  path: string;
  headers?: HeadersInitLike;
  parse?: Parser<TData>;
  validate?: Validator<TData>;
  transformRequest?: TransformFn<unknown, unknown>;
  transformResponse?: TransformFn<unknown, unknown>;
  auth?: AuthConfig | false;
  middleware?: Middleware[];
  timeout?: number;
}

export interface CallOptions<TBody = unknown> {
  params?: PathParams;
  query?: QueryParams;
  body?: TBody;
  headers?: HeadersInitLike;
  signal?: AbortSignal;
  timeout?: number;
  /** Skip API-level auth for this call. */
  auth?: false;
}

export type EndpointFn<TData = unknown, TBody = unknown> = (
  options?: CallOptions<TBody>
) => Promise<ApiResponse<TData>>;

export type ResourceEndpoints = Record<string, EndpointDefinition>;

export type ResourceClient<TEndpoints extends ResourceEndpoints> = {
  [K in keyof TEndpoints]: TEndpoints[K] extends EndpointDefinition<infer TData>
    ? EndpointFn<TData>
    : EndpointFn;
};

export interface MockHandler {
  match: (request: RequestConfig) => boolean;
  resolve: (request: RequestConfig) => Promise<ApiResponse<unknown>> | ApiResponse<unknown>;
}

export interface ApiConfig {
  baseURL: string;
  headers?: HeadersInitLike;
  auth?: AuthConfig;
  middleware?: Middleware[];
  transport?: Transport;
  timeout?: number;
  /** Optional mock handlers — checked before the real transport. */
  mocks?: MockHandler[];
  /** Called when a request fails with an ApiError subclass. */
  onError?: (error: ApiError) => void;
}

export interface CreateEndpointOptions<TData = unknown>
  extends Omit<EndpointDefinition<TData>, "method" | "path"> {}
