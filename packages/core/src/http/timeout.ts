export function createTimeoutSignal(
  timeoutMs: number | undefined,
  external?: AbortSignal,
): { signal?: AbortSignal; cleanup: () => void } {
  if (!timeoutMs && !external) {
    return { cleanup: () => undefined };
  }

  if (!timeoutMs) {
    return { signal: external, cleanup: () => undefined };
  }

  const controller = new AbortController();
  const onExternalAbort = () => {
    controller.abort(external?.reason);
  };

  if (external) {
    if (external.aborted) {
      controller.abort(external.reason);
    } else {
      external.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  const timer = setTimeout(() => {
    controller.abort(new DOMException("Request timed out", "TimeoutError"));
  }, timeoutMs);

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      external?.removeEventListener("abort", onExternalAbort);
    },
  };
}
