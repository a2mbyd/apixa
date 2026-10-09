import type { HeadersInitLike } from "../types/http.js";

export function mergeHeaders(...sources: Array<HeadersInitLike | undefined>): Headers {
  const headers = new Headers();

  for (const source of sources) {
    if (!source) continue;

    if (source instanceof Headers) {
      source.forEach((value, key) => {
        headers.set(key, value);
      });
      continue;
    }

    if (Array.isArray(source)) {
      for (const [key, value] of source) {
        headers.set(key, value);
      }
      continue;
    }

    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) {
        headers.delete(key);
      } else {
        headers.set(key, value);
      }
    }
  }

  return headers;
}
