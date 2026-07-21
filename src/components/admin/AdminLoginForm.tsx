"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInAdmin } from "@/lib/data";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await signInAdmin(email, password);
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <Link className="brand" href="/">
          <span className="brand-mark">🍰</span>
          <span>Cheta Homemade</span>
        </Link>
        <h1 style={{ fontSize: "3rem", marginTop: 24 }}>Admin Login</h1>
        <p className="lead">This page is separated from the customer website.</p>
        {error ? <p className="prototype-note" role="alert">{error}</p> : null}
        <div className="form-grid" style={{ marginTop: 18 }}>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" autoComplete="current-password" required />
          </label>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Enter dashboard"}
          </button>
          <Link className="btn btn-secondary" href="/">Back to customer website</Link>
        </div>
      </form>
    </main>
  );
}
