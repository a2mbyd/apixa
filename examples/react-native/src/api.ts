import { defineApi } from "@apixa/core";
import { Platform } from "react-native";

export type User = {
  id: string;
  name: string;
  email: string;
};

/** Android emulator reaches the host machine via 10.0.2.2; iOS simulator uses localhost. */
const defaultBaseURL =
  Platform.OS === "android" ? "http://10.0.2.2:8787" : "http://127.0.0.1:8787";

export const api = defineApi({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? defaultBaseURL,
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
