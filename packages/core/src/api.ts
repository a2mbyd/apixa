import { createEndpointCaller } from "./client.js";
import { createFetchTransport } from "./transport/fetch.js";
import type {
  ApiConfig,
  EndpointDefinition,
  ResourceClient,
  ResourceEndpoints,
} from "./types.js";

export interface Api {
  readonly config: Readonly<ApiConfig>;
  resource: <TEndpoints extends ResourceEndpoints>(
    name: string,
    definition: { endpoints: TEndpoints }
  ) => ResourceClient<TEndpoints>;
}

export function createApi(config: ApiConfig): Api {
  const resolved: ApiConfig = {
    ...config,
    transport: config.transport ?? createFetchTransport(),
    middleware: config.middleware ?? [],
    mocks: config.mocks ?? [],
  };

  return {
    config: resolved,

    resource<TEndpoints extends ResourceEndpoints>(
      _name: string,
      definition: { endpoints: TEndpoints }
    ): ResourceClient<TEndpoints> {
      const client = {} as ResourceClient<TEndpoints>;

      for (const [key, endpoint] of Object.entries(definition.endpoints)) {
        (client as Record<string, unknown>)[key] = createEndpointCaller(
          resolved,
          endpoint as EndpointDefinition
        );
      }

      return client;
    },
  };
}
