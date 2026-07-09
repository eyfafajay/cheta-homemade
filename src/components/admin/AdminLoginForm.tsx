"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/local-store";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginAdmin();
    router.push("/admin/dashboard");
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
        <p className="prototype-note">
          Prototype mode: this form does not validate real credentials yet. Supabase Auth will replace this login later.
        </p>
        <div className="form-grid" style={{ marginTop: 18 }}>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="mom@example.com" type="email" />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" />
          </label>
          <button className="btn btn-primary" type="submit">Enter dashboard</button>
          <Link className="btn btn-secondary" href="/">Back to customer website</Link>
        </div>
      </form>
    </main>
  );
}
