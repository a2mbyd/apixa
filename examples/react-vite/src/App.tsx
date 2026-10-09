import { isApiError } from "@apixa/core";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { api, type User } from "./api";

export function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError(null);
    try {
      setUsers(await api.users.getAll());
    } catch (err) {
      setError(
        isApiError(err)
          ? `${err.name}: ${err.message}. Start the FastAPI backend on :8787.`
          : "Failed to load users",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await api.users.create({ name, email });
      setName("");
      setEmail("");
      await load();
    } catch (err) {
      setError(isApiError(err) ? err.message : "Create failed");
    }
  }

  async function onDelete(id: string) {
    setError(null);
    try {
      await api.users.delete(id);
      await load();
    } catch (err) {
      setError(isApiError(err) ? err.message : "Delete failed");
    }
  }

  return (
    <main>
      <p className="eyebrow">Apixa · React + Vite</p>
      <h1>Typed client in a Vite React app</h1>
      <p className="lede">Same <code>defineApi</code> client as Next — browser-only here.</p>

      {error ? <p className="error">{error}</p> : null}
      {loading ? <p>Loading…</p> : null}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div>
              <strong>{user.name}</strong>
              <span>
                {user.email} · {user.id}
              </span>
            </div>
            <button type="button" onClick={() => void onDelete(user.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={onCreate}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Create</button>
      </form>
    </main>
  );
}
