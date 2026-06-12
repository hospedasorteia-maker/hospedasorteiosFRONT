"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleIcon from "./GoogleIcon";
import GoogleSignInModal from "./GoogleSignInModal";
import { signInWithEmail, completeGoogleSignIn } from "@/lib/services/auth";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [googleOpen, setGoogleOpen] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.email.value;

    setLoading(true);
    setError("");

    try {
      signInWithEmail({ email });
      router.push(nextPath.startsWith("/") ? nextPath : "/dashboard");
    } catch (err) {
      setError(err.message || "Não foi possível entrar.");
      setLoading(false);
    }
  }

  function handleGoogleSuccess({ name, email }) {
    completeGoogleSignIn({ name, email });
    router.push(nextPath.startsWith("/") ? nextPath : "/dashboard");
  }

  return (
    <>
      <button type="button" className="btn btn--outline btn--block" onClick={() => setGoogleOpen(true)}>
        <GoogleIcon />
        Continuar com Google
      </button>

      <GoogleSignInModal
        open={googleOpen}
        onClose={() => setGoogleOpen(false)}
        onSuccess={handleGoogleSuccess}
      />

      <div className="divider"><span>ou</span></div>

      {error && <div className="auth__error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <div className="field__input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            <input id="email" name="email" type="email" placeholder="voce@exemplo.com" autoComplete="email" autoFocus required />
          </div>
        </div>

        <div className="field">
          <div className="field__label-row">
            <label htmlFor="password">Senha</label>
            <a href="#" className="field__link">Esqueceu a senha?</a>
          </div>
          <div className="field__input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <input id="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
          </div>
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </>
  );
}
