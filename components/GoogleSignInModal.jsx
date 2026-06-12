"use client";

import { useEffect, useState } from "react";
import GoogleIcon from "./GoogleIcon";

const SUGGESTED_ACCOUNTS = [
  { name: "João Silva", email: "joao.silva@gmail.com", color: "#4285F4" },
  { name: "Maria Souza", email: "maria.souza@gmail.com", color: "#EA4335" },
];

export default function GoogleSignInModal({ open, onClose, onSuccess }) {
  const [step, setStep] = useState("pick");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!open) return;
    setStep("pick");
    setEmail("");
    setLoading(false);
    setSelected(null);
    document.body.style.overflow = "hidden";

    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function handlePickAccount(account) {
    setSelected(account);
    setLoading(true);
    setTimeout(() => {
      onSuccess({ name: account.name, email: account.email });
    }, 900);
  }

  function handleCustomSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    const name = trimmed.split("@")[0].replace(/[._]/g, " ");
    setLoading(true);
    setTimeout(() => {
      onSuccess({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: trimmed,
      });
    }, 900);
  }

  return (
    <div className="google-signin" role="dialog" aria-modal="true" aria-labelledby="google-signin-title">
      <div className="google-signin__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="google-signin__panel">
        <button type="button" className="google-signin__close" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <div className="google-signin__brand">
          <GoogleIcon />
        </div>

        {loading ? (
          <div className="google-signin__loading">
            <div className="google-signin__spinner" />
            <h2 id="google-signin-title">Conectando...</h2>
            <p>{selected ? `Entrando como ${selected.email}` : "Verificando sua conta Google"}</p>
          </div>
        ) : step === "pick" ? (
          <>
            <h2 id="google-signin-title">Fazer login com o Google</h2>
            <p className="google-signin__subtitle">Prosseguir para <strong>TironiDraws</strong></p>

            <div className="google-signin__accounts">
              {SUGGESTED_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  className="google-signin__account"
                  onClick={() => handlePickAccount(account)}
                >
                  <span className="google-signin__avatar" style={{ background: account.color }}>
                    {account.name.charAt(0)}
                  </span>
                  <span className="google-signin__account-info">
                    <strong>{account.name}</strong>
                    <small>{account.email}</small>
                  </span>
                </button>
              ))}
            </div>

            <button type="button" className="google-signin__other" onClick={() => setStep("email")}>
              Usar outra conta
            </button>
          </>
        ) : (
          <>
            <h2 id="google-signin-title">Informe seu e-mail</h2>
            <p className="google-signin__subtitle">Use sua Conta Google</p>

            <form className="google-signin__form" onSubmit={handleCustomSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail ou telefone"
                autoFocus
                required
              />
              <div className="google-signin__form-actions">
                <button type="button" className="google-signin__link" onClick={() => setStep("pick")}>
                  Voltar
                </button>
                <button type="submit" className="google-signin__submit">
                  Avançar
                </button>
              </div>
            </form>
          </>
        )}

        {!loading && (
          <p className="google-signin__legal">
            Para continuar, o Google compartilhará seu nome e e-mail com o TironiDraws.
          </p>
        )}
      </div>
    </div>
  );
}
