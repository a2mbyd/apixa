import { defineApi, isApiError } from "@apixa/core";

type User = {
  id: string;
  name: string;
  email: string;
};

/**
 * Implemented `defineApi` client.
 * Start the local FastAPI app first (`./scripts/macos/run-backend.sh`) so requests hit real HTTP.
 */
const api = defineApi({
  baseURL: "http://127.0.0.1:8787",
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

async function main() {
  const users = await api.users.getAll();
  console.log("users.getAll →", users);

  const user = await api.users.getByID("1");
  console.log("users.getByID →", user);

  const created = await api.users.create({
    name: "Alan Turing",
    email: "alan@example.com",
  });
  console.log("users.create →", created);
}

main().catch((error) => {
  if (isApiError(error)) {
    console.error("API error:", error.name, error.message, error.status);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
