"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "./GoogleIcon";

export default function CadastroForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Cadastro visual (sem backend): valida senhas iguais e entra no dashboard
  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const password = form.elements.password.value;
    const confirm = form.elements.confirm.value;

    if (password !== confirm) {
      setError(true);
      return;
    }
    setError(false);
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

      {error && <div className="auth__error">As senhas não coincidem</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <div className="field__input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            <input id="email" name="email" type="email" placeholder="voce@exemplo.com" autoComplete="email" autoFocus required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="password">Senha</label>
          <div className="field__input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="new-password" required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="confirm">Confirmar senha</label>
          <div className="field__input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <input id="confirm" name="confirm" type="password" placeholder="••••••••" autoComplete="new-password" required />
          </div>
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
    </>
  );
}
