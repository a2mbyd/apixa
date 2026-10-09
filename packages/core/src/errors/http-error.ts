import { ApiError } from "./api-error.js";

export class HttpError extends ApiError {
  constructor(
    message: string,
    options: NonNullable<ConstructorParameters<typeof ApiError>[1]> & { status: number },
  ) {
    super(message, { code: "HTTP_ERROR", ...options });
    this.name = "HttpError";
  }
}
