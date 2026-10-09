import { ApiError } from "./api-error.js";

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
