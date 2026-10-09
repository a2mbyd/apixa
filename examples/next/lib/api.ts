import { defineApi } from "@apixa/core";

export type User = {
  id: string;
  name: string;
  email: string;
};

/**
 * Shared Apixa client for the Next example.
 * Point NEXT_PUBLIC_API_URL at the FastAPI backend (default http://127.0.0.1:8787).
 */
export const api = defineApi({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8787",
  headers: { Accept: "application/json" },
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
