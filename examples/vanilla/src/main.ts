import { isApiError } from "@apixa/core";
import { api, type User } from "./api";

const listEl = document.querySelector<HTMLUListElement>("#list")!;
const statusEl = document.querySelector<HTMLParagraphElement>("#status")!;
const formEl = document.querySelector<HTMLFormElement>("#form")!;
const nameEl = document.querySelector<HTMLInputElement>("#name")!;
const emailEl = document.querySelector<HTMLInputElement>("#email")!;

function setStatus(message: string, isError = false) {
  statusEl.textContent = message;
  statusEl.className = isError ? "error" : "";
}

function render(users: User[]) {
  listEl.innerHTML = "";
  for (const user of users) {
    const li = document.createElement("li");
    const info = document.createElement("div");
    info.innerHTML = `<strong>${user.name}</strong><span>${user.email} · ${user.id}</span>`;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Delete";
    button.addEventListener("click", () => {
      void remove(user.id);
    });
    li.append(info, button);
    listEl.append(li);
  }
}

async function load() {
  try {
    const users = await api.users.getAll();
    render(users);
    setStatus(`${users.length} user(s)`);
  } catch (err) {
    setStatus(
      isApiError(err)
        ? `${err.name}: ${err.message}. Start the FastAPI backend on :8787.`
        : "Failed to load users",
      true,
    );
  }
}

async function remove(id: string) {
  try {
    await api.users.delete(id);
    await load();
  } catch (err) {
    setStatus(isApiError(err) ? err.message : "Delete failed", true);
  }
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  void (async () => {
    try {
      await api.users.create({ name: nameEl.value, email: emailEl.value });
      nameEl.value = "";
      emailEl.value = "";
      await load();
    } catch (err) {
      setStatus(isApiError(err) ? err.message : "Create failed", true);
    }
  })();
});

void load();
