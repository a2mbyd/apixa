import type { ApiResponse, RequestConfig } from "./types.js";

export class ApiError extends Error {
  status?: number;
  code?: string;
  data?: unknown;
  request?: RequestConfig;
  response?: ApiResponse<unknown>;
  override cause?: unknown;

  constructor(
    message: string,
    options?: {
      status?: number;
      code?: string;
      data?: unknown;
      request?: RequestConfig;
      response?: ApiResponse<unknown>;
      cause?: unknown;
    }
  ) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "ApiError";
    this.status = options?.status;
    this.code = options?.code;
    this.data = options?.data;
    this.request = options?.request;
    this.response = options?.response;
    this.cause = options?.cause;
  }
}

export class NetworkError extends ApiError {
  constructor(message = "Network request failed", options?: ConstructorParameters<typeof ApiError>[1]) {
    super(message, { code: "NETWORK_ERROR", ...options });
    this.name = "NetworkError";
  }
}

export class HttpError extends ApiError {
  constructor(
    message: string,
    options: NonNullable<ConstructorParameters<typeof ApiError>[1]> & { status: number }
  ) {
    super(message, { code: "HTTP_ERROR", ...options });
    this.name = "HttpError";
  }
}

export class ParseError extends ApiError {
  constructor(message = "Failed to parse response", options?: ConstructorParameters<typeof ApiError>[1]) {
    super(message, { code: "PARSE_ERROR", ...options });
    this.name = "ParseError";
  }
}

export class ValidationError extends ApiError {
  constructor(
    message = "Response validation failed",
    options?: ConstructorParameters<typeof ApiError>[1]
  ) {
    super(message, { code: "VALIDATION_ERROR", ...options });
    this.name = "ValidationError";
  }
}

export class TimeoutError extends ApiError {
  constructor(message = "Request timed out", options?: ConstructorParameters<typeof ApiError>[1]) {
    super(message, { code: "TIMEOUT_ERROR", ...options });
    this.name = "TimeoutError";
  }
}

export class AbortError extends ApiError {
  constructor(message = "Request was aborted", options?: ConstructorParameters<typeof ApiError>[1]) {
    super(message, { code: "ABORT_ERROR", ...options });
    this.name = "AbortError";
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
