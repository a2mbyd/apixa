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

/** Type marker object for an operation. Values are not read at runtime except `method`, `path`, `headers`, `timeout`, and the presence of `body`. */
export interface OperationDefinition {
  method?: HttpMethod;
  /** Path relative to the resource `path`. Convention names default when omitted. */
  path?: string;
  /** Type marker for the JSON request body (`{} as Body`). */
  body?: unknown;
  /** Type marker for the unwrapped response payload (`{} as User`). */
  response?: unknown;
  /** Type marker for query-string parameters. */
  query?: unknown;
  headers?: HeadersInitLike;
  timeout?: number;
}

export interface ResourceDefinition {
  path: string;
  operations: Record<string, OperationDefinition>;
}

export type RequestOptions<TQuery = QueryParams> = {
  query?: TQuery;
  headers?: HeadersInitLike;
  signal?: AbortSignal;
  timeout?: number;
};

export type ReservedApiConfigKey = "baseURL" | "headers" | "transport" | "timeout";

export interface ApiRootConfig {
  baseURL: string;
  headers?: HeadersInitLike;
  transport?: Transport;
  timeout?: number;
}

export interface ResolvedApiConfig {
  baseURL: string;
  headers?: HeadersInitLike;
  transport: Transport;
  timeout?: number;
}

export interface ResolvedOperation {
  name: string;
  method: HttpMethod;
  path: string;
  hasBody: boolean;
  headers?: HeadersInitLike;
  timeout?: number;
}

type DefaultPath<Name extends string> = Name extends "getByID" | "update" | "delete"
  ? "/:id"
  : "";

export type EffectivePath<Name extends string, Op> = Op extends { path: infer P }
  ? P extends string
    ? P
    : DefaultPath<Name>
  : DefaultPath<Name>;

type PathParamName<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? Param | PathParamName<`/${Rest}`>
  : T extends `${string}:${infer Param}`
    ? Param
    : never;

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type PathArity<Path extends string> = [PathParamName<Path>] extends [never]
  ? 0
  : IsUnion<PathParamName<Path>> extends true
    ? 2
    : 1;

type PathParamsOf<Path extends string> = [PathParamName<Path>] extends [never]
  ? PathParams
  : { [K in PathParamName<Path>]: string | number };

type InferResponse<Op> = Op extends { response: infer R } ? R : unknown;
type InferBody<Op> = Op extends { body: infer B } ? B : undefined;
type InferQuery<Op> = Op extends { query: infer Q } ? Q : QueryParams;
type HasBody<Op> = Op extends { body: infer B }
  ? [B] extends [undefined]
    ? false
    : true
  : false;

type OperationFn<Name extends string, Op> = BuildOperationFn<
  PathArity<EffectivePath<Name, Op>>,
  PathParamsOf<EffectivePath<Name, Op>>,
  HasBody<Op> extends true ? InferBody<Op> : undefined,
  InferResponse<Op>,
  InferQuery<Op>
>;

type BuildOperationFn<
  Arity extends 0 | 1 | 2,
  Params,
  Body,
  Result,
  Query,
> = [Body] extends [undefined]
  ? Arity extends 0
    ? (options?: RequestOptions<Query>) => Promise<Result>
    : Arity extends 1
      ? (id: string | number, options?: RequestOptions<Query>) => Promise<Result>
      : (params: Params, options?: RequestOptions<Query>) => Promise<Result>
  : Arity extends 0
    ? (body: Body, options?: RequestOptions<Query>) => Promise<Result>
    : Arity extends 1
      ? (id: string | number, body: Body, options?: RequestOptions<Query>) => Promise<Result>
      : (params: Params, body: Body, options?: RequestOptions<Query>) => Promise<Result>;

export type ResourceClient<Ops> = {
  [K in keyof Ops]: OperationFn<Extract<K, string>, Ops[K]>;
};

export type ApiClient<T> = {
  [K in keyof T as K extends ReservedApiConfigKey ? never : K]: T[K] extends {
    operations: infer Ops;
  }
    ? ResourceClient<Ops>
    : never;
};

type ValidOperationValue = {
  method?: HttpMethod;
  path?: string;
  body?: unknown;
  response?: unknown;
  query?: unknown;
  headers?: HeadersInitLike;
  timeout?: number;
};

type ValidResourceValue = {
  path: string;
  operations: Record<string, ValidOperationValue>;
};

/** Structural check that preserves inferred operation types on `defineApi` input. */
export type ValidateApiConfig<T> = {
  [K in keyof T]: K extends ReservedApiConfigKey
    ? T[K]
    : T[K] extends ValidResourceValue
      ? T[K]
      : ValidResourceValue;
};
