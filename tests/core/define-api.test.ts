import { defineApi } from "@apixa/core";
import { describe, expect, expectTypeOf, it } from "vitest";
import { createFakeTransport } from "../helpers/fake-transport.js";

type User = { id: string; name: string; email: string };

describe("defineApi", () => {
  it("exposes only configured operations on a resource client", async () => {
    const api = defineApi({
      baseURL: "https://api.example.com",
      transport: createFakeTransport(() => ({
        body: [{ id: "1", name: "Ada", email: "ada@example.com" }] satisfies User[],
      })),
      users: {
        path: "/users",
        operations: {
          getAll: { method: "GET", response: {} as User[] },
          getByID: { method: "GET", path: "/:id", response: {} as User },
          create: { method: "POST", body: {} as Omit<User, "id">, response: {} as User },
        },
      },
    });

    expect(Object.keys(api.users).sort()).toEqual(["create", "getAll", "getByID"]);
    expect(api.users).not.toHaveProperty("update");
    expect(api.users).not.toHaveProperty("delete");

    expectTypeOf(api.users).toHaveProperty("getAll");
    expectTypeOf(api.users).toHaveProperty("getByID");
    expectTypeOf(api.users).toHaveProperty("create");
    expectTypeOf(api.users).not.toHaveProperty("update");
    expectTypeOf(api.users).not.toHaveProperty("delete");

    const users = await api.users.getAll();
    expect(users).toEqual([{ id: "1", name: "Ada", email: "ada@example.com" }]);
  });

  it("applies convention method and path defaults when they are omitted", async () => {
    const urls: string[] = [];

    const api = defineApi({
      baseURL: "https://api.example.com",
      transport: createFakeTransport((request) => {
        urls.push(`${request.method} ${request.url}`);
        return { body: { id: "1", name: "Ada", email: "ada@example.com" } satisfies User };
      }),
      users: {
        path: "/users",
        operations: {
          getByID: { response: {} as User },
        },
      },
    });

    await api.users.getByID("1");
    expect(urls).toEqual(["GET https://api.example.com/users/1"]);
  });

  it("lets a custom definition override a convention name", async () => {
    const urls: string[] = [];

    const api = defineApi({
      baseURL: "https://api.example.com",
      transport: createFakeTransport((request) => {
        urls.push(request.url);
        return { body: { id: "abc", name: "Ada", email: "ada@example.com" } satisfies User };
      }),
      users: {
        path: "/users",
        operations: {
          getByID: { method: "GET", path: "/by-uuid/:id", response: {} as User },
        },
      },
    });

    await api.users.getByID("abc");
    expect(urls).toEqual(["https://api.example.com/users/by-uuid/abc"]);
  });

  it("infers argument and response types without casts at call sites", async () => {
    const api = defineApi({
      baseURL: "https://api.example.com",
      transport: createFakeTransport((request) => {
        if (request.method === "POST") {
          return { status: 201, body: { id: "3", name: "Ada", email: "ada@example.com" } };
        }
        if (request.url.endsWith("/users/1")) {
          return { body: { id: "1", name: "Ada", email: "ada@example.com" } };
        }
        return { body: [] };
      }),
      users: {
        path: "/users",
        operations: {
          getAll: { method: "GET", response: {} as User[] },
          getByID: { method: "GET", path: "/:id", response: {} as User },
          create: { method: "POST", body: {} as Omit<User, "id">, response: {} as User },
          update: { method: "PUT", path: "/:id", body: {} as Partial<User>, response: {} as User },
          delete: { method: "DELETE", path: "/:id", response: undefined as void },
        },
      },
    });

    expectTypeOf(api.users.getAll).returns.toEqualTypeOf<Promise<User[]>>();
    expectTypeOf(api.users.getByID).parameter(0).toEqualTypeOf<string | number>();
    expectTypeOf(api.users.getByID).returns.toEqualTypeOf<Promise<User>>();
    expectTypeOf(api.users.create).parameter(0).toEqualTypeOf<Omit<User, "id">>();
    expectTypeOf(api.users.create).returns.toEqualTypeOf<Promise<User>>();
    expectTypeOf(api.users.update).parameter(0).toEqualTypeOf<string | number>();
    expectTypeOf(api.users.update).parameter(1).toEqualTypeOf<Partial<User>>();
    expectTypeOf(api.users.delete).returns.toEqualTypeOf<Promise<void>>();

    const created = await api.users.create({ name: "Ada", email: "ada@example.com" });
    const user = await api.users.getByID("1");

    expect(created.id).toBe("3");
    expect(user.email).toBe("ada@example.com");
  });
});
