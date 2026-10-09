import { isJsonContentType } from "../http/body.js";

export async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (isJsonContentType(response.headers)) {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text) as unknown;
  }

  if (contentType.startsWith("text/")) {
    return response.text();
  }

  // Prefer JSON when no content-type is set but body looks like JSON.
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
