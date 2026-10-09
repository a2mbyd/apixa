"use client";

import { isApiError } from "@apixa/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, type User } from "@/lib/api";

export function UserActions({ user }: { user: User }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function rename() {
    setError(null);
    setPending(true);
    try {
      await api.users.update(user.id, { name: `${user.name} ★` });
      router.refresh();
    } catch (err) {
      setError(isApiError(err) ? err.message : "Update failed");
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    setError(null);
    setPending(true);
    try {
      await api.users.delete(user.id);
      router.refresh();
    } catch (err) {
      setError(isApiError(err) ? err.message : "Delete failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="actions">
        <button type="button" className="secondary" disabled={pending} onClick={rename}>
          Rename
        </button>
        <button type="button" className="danger" disabled={pending} onClick={remove}>
          Delete
        </button>
      </div>
      {error ? <p className="error" style={{ marginTop: "0.6rem" }}>{error}</p> : null}
    </div>
  );
}
