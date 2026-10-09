"use client";

import { isApiError } from "@apixa/core";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

export function CreateUserForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setPending(true);

    try {
      const created = await api.users.create({ name, email });
      setSuccess(`Created ${created.name} (${created.id})`);
      setName("");
      setEmail("");
      router.refresh();
    } catch (err) {
      if (isApiError(err)) {
        setError(`${err.name}: ${err.message}`);
      } else {
        setError("Unexpected error creating user");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label>
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ada Lovelace"
          required
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ada@example.com"
          required
        />
      </label>
      <button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create user"}
      </button>
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}
    </form>
  );
}
