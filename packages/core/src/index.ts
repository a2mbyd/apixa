export { defineApi } from "./api.js";

export {
  ApiError,
  NetworkError,
  HttpError,
  ParseError,
  ValidationError,
  TimeoutError,
  AbortError,
  isApiError,
} from "./errors.js";

export { createFetchTransport } from "./transport/fetch.js";

export type {
  HttpMethod,
  PathParams,
  QueryParams,
  HeadersInitLike,
  RequestConfig,
  ApiResponse,
  TransportRequest,
  TransportResponse,
  Transport,
  OperationDefinition,
  ResourceDefinition,
  RequestOptions,
  ApiRootConfig,
  ApiClient,
  ResourceClient,
} from "./types.js";
