import { isApiError } from "@apixa/core";
import { CreateUserForm } from "@/components/create-user-form";
import { UserActions } from "@/components/user-actions";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let users: Awaited<ReturnType<typeof api.users.getAll>> = [];
  let loadError: string | null = null;

  try {
    users = await api.users.getAll();
  } catch (error) {
    loadError = isApiError(error)
      ? `${error.name}: ${error.message}. Is the FastAPI backend running on :8787?`
      : "Failed to load users. Start the backend first.";
  }

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Apixa · Next.js</p>
        <h1>Define once. Call from App Router.</h1>
        <p className="lede">
          This page loads users in a Server Component via <code>api.users.getAll()</code>,
          then creates / updates / deletes from Client Components — same typed client.
        </p>
      </section>

      <div className="grid">
        <section className="panel">
          <h2>Users (server fetch)</h2>
          <p className="meta">
            Source: <code>lib/api.ts</code> → <code>@apixa/core</code> →{" "}
            {process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8787"}
          </p>

          {loadError ? <p className="error">{loadError}</p> : null}

          {!loadError && users.length === 0 ? (
            <p className="empty">No users yet. Create one on the right.</p>
          ) : null}

          {!loadError && users.length > 0 ? (
            <ul className="list">
              {users.map((user) => (
                <li key={user.id}>
                  <div>
                    <strong>{user.name}</strong>
                    <span>
                      {user.email} · id {user.id}
                    </span>
                  </div>
                  <UserActions user={user} />
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="panel">
          <h2>Create user (client)</h2>
          <p className="meta">
            Uses <code>api.users.create</code> from the browser, then refreshes the RSC list.
          </p>
          <CreateUserForm />
        </section>
      </div>

      <p className="footer-note">
        Start backend: <code>./scripts/macos/run-backend.sh</code> · then{" "}
        <code>pnpm --filter @apixa/example-next dev</code>
      </p>
    </main>
  );
}
