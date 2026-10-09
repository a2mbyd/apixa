export { createApi } from "./api.js";
export type { Api } from "./api.js";

export { get, post, put, patch, del, head, options, defineEndpoint } from "./endpoint.js";

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
export { applyAuth } from "./auth.js";
export { loggingMiddleware, compose } from "./middleware.js";
export { createMock } from "./mock.js";
export type { CreateMockOptions } from "./mock.js";

export type {
  HttpMethod,
  PathParams,
  QueryParams,
  HeadersInitLike,
  Validator,
  Parser,
  TransformFn,
  AuthConfig,
  RequestConfig,
  ApiResponse,
  TransportRequest,
  TransportResponse,
  Transport,
  Middleware,
  MiddlewareNext,
  EndpointDefinition,
  CallOptions,
  EndpointFn,
  ResourceEndpoints,
  ResourceClient,
  MockHandler,
  ApiConfig,
  CreateEndpointOptions,
} from "./types.js";
