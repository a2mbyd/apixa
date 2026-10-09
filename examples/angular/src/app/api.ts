import { defineApi } from "@apixa/core";

export type User = {
  id: string;
  name: string;
  email: string;
};

export const api = defineApi({
  baseURL: "http://127.0.0.1:8787",
  headers: { Accept: "application/json" },
  users: {
    path: "/users",
    operations: {
      getAll: { method: "GET", response: {} as User[] },
      create: { method: "POST", body: {} as Omit<User, "id">, response: {} as User },
      delete: { method: "DELETE", path: "/:id", response: undefined as void },
    },
  },
});
