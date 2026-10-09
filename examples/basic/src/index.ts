import {
  createApi,
  createMock,
  get,
  post,
  loggingMiddleware,
  isApiError,
} from "@apixa/core";

type User = {
  id: string;
  name: string;
  email: string;
};

const api = createApi({
  baseURL: "https://api.example.com",
  middleware: [loggingMiddleware],
  mocks: [
    createMock({
      method: "GET",
      path: "/users",
      data: [
        { id: "1", name: "Ada Lovelace", email: "ada@example.com" },
        { id: "2", name: "Grace Hopper", email: "grace@example.com" },
      ] satisfies User[],
    }),
    createMock({
      method: "GET",
      path: "/users/:id",
      data: { id: "1", name: "Ada Lovelace", email: "ada@example.com" } satisfies User,
    }),
    createMock({
      method: "POST",
      path: "/users",
      status: 201,
      data: { id: "3", name: "Alan Turing", email: "alan@example.com" } satisfies User,
    }),
  ],
});

const users = api.resource("users", {
  endpoints: {
    list: get<User[]>("/users"),
    get: get<User>("/users/:id"),
    create: post<User>("/users"),
  },
});

async function main() {
  const list = await users.list();
  console.log("users.list →", list.data);

  const user = await users.get({ params: { id: "1" } });
  console.log("users.get →", user.data);

  const created = await users.create({
    body: {
      name: "Alan Turing",
      email: "alan@example.com",
    },
  });
  console.log("users.create →", created.data);
}

main().catch((error) => {
  if (isApiError(error)) {
    console.error("API error:", error.name, error.message, error.status);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
