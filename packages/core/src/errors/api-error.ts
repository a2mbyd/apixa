import type { ApiResponse, RequestConfig } from "../types/transport.js";

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
    },
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
