"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "./GoogleIcon";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Login visual (sem backend): qualquer e-mail/senha entra no dashboard
  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 800);
  }

  return (
    <>
      <button type="button" className="btn btn--outline btn--block" onClick={() => router.push("/dashboard")}>
        <GoogleIcon />
        Continuar com Google
      </button>

      <div className="divider"><span>ou</span></div>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <div className="field__input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            <input id="email" type="email" placeholder="voce@exemplo.com" autoComplete="email" autoFocus required />
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
