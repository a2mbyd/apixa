import type { CreateEndpointOptions, EndpointDefinition, HttpMethod } from "./types.js";

function defineEndpoint<TData = unknown>(
  method: HttpMethod,
  path: string,
  options?: CreateEndpointOptions<TData>
): EndpointDefinition<TData> {
  return {
    method,
    path,
    ...options,
  };
}

export function get<TData = unknown>(
  path: string,
  options?: CreateEndpointOptions<TData>
): EndpointDefinition<TData> {
  return defineEndpoint("GET", path, options);
}

export function post<TData = unknown>(
  path: string,
  options?: CreateEndpointOptions<TData>
): EndpointDefinition<TData> {
  return defineEndpoint("POST", path, options);
}

export function put<TData = unknown>(
  path: string,
  options?: CreateEndpointOptions<TData>
): EndpointDefinition<TData> {
  return defineEndpoint("PUT", path, options);
}

export function patch<TData = unknown>(
  path: string,
  options?: CreateEndpointOptions<TData>
): EndpointDefinition<TData> {
  return defineEndpoint("PATCH", path, options);
}

export function del<TData = unknown>(
  path: string,
  options?: CreateEndpointOptions<TData>
): EndpointDefinition<TData> {
  return defineEndpoint("DELETE", path, options);
}

export function head<TData = unknown>(
  path: string,
  options?: CreateEndpointOptions<TData>
): EndpointDefinition<TData> {
  return defineEndpoint("HEAD", path, options);
}

export function options<TData = unknown>(
  path: string,
  options?: CreateEndpointOptions<TData>
): EndpointDefinition<TData> {
  return defineEndpoint("OPTIONS", path, options);
}

export { defineEndpoint };
