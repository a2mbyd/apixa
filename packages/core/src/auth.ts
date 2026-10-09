import type { AuthConfig } from "./types.js";

async function resolveValue(
  value: string | (() => string | Promise<string>) | undefined
): Promise<string | undefined> {
  if (value === undefined) return undefined;
  return typeof value === "function" ? value() : value;
}

function encodeBasicCredentials(username: string, password: string): string {
  const credentials = `${username}:${password}`;

  if (typeof btoa === "function") {
    return btoa(credentials);
  }

  // Node.js without DOM lib — Buffer is available at runtime.
  const nodeBuffer = (globalThis as typeof globalThis & {
    Buffer?: { from(data: string): { toString(encoding: string): string } };
  }).Buffer;

  if (nodeBuffer) {
    return nodeBuffer.from(credentials).toString("base64");
  }

  throw new Error("No base64 encoder available for basic auth");
}

export async function applyAuth(headers: Headers, auth?: AuthConfig | false): Promise<void> {
  if (!auth) return;

  switch (auth.type) {
    case "bearer": {
      const token = await resolveValue(auth.token);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      break;
    }
    case "apiKey": {
      const key = await resolveValue(auth.key ?? auth.token);
      if (key) {
        headers.set(auth.header ?? "X-API-Key", key);
      }
      break;
    }
    case "basic": {
      const username = auth.username ?? "";
      const password = auth.password ?? "";
      headers.set("authorization", `Basic ${encodeBasicCredentials(username, password)}`);
      break;
    }
    case "custom": {
      await auth.apply?.(headers);
      break;
    }
    default:
      break;
  }
}
