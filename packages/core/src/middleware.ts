import type { Middleware } from "./types.js";

/** Simple request/response logger for development. */
export const loggingMiddleware: Middleware = async (request, next) => {
  const started = Date.now();
  console.info(`[apixa] → ${request.method} ${request.url}`);

  try {
    const response = await next();
    console.info(
      `[apixa] ← ${request.method} ${request.url} ${response.status} (${Date.now() - started}ms)`
    );
    return response;
  } catch (error) {
    console.error(
      `[apixa] ✕ ${request.method} ${request.url} failed (${Date.now() - started}ms)`,
      error
    );
    throw error;
  }
};

/** Compose multiple middleware into one. */
export function compose(...middleware: Middleware[]): Middleware {
  return (request, next) => {
    const chain = middleware.reduceRight<() => ReturnType<typeof next>>(
      (nxt, mw) => () => mw(request, nxt),
      next
    );
    return chain();
  };
}
