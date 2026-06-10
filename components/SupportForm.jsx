"use client";

import { useState } from "react";

export default function SupportForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="support__form-card reveal is-visible">
        <div className="form-success">
          <div className="form-success__icon">✓</div>
          <h3>Mensagem enviada!</h3>
          <p>Nossa equipe responderá em breve no e-mail informado.</p>
          <button type="button" className="link-btn" onClick={() => setSent(false)}>
            Enviar outra mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="support__form-card reveal">
      <form onSubmit={handleSubmit}>
        <h3>Envie sua mensagem</h3>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="fName">Nome</label>
            <input id="fName" type="text" placeholder="Seu nome" required />
          </div>
          <div className="form-field">
            <label htmlFor="fEmail">E-mail</label>
            <input id="fEmail" type="email" placeholder="seu@email.com" required />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="fSubject">Assunto</label>
          <input id="fSubject" type="text" placeholder="Como podemos ajudar?" required />
        </div>
        <div className="form-field">
          <label htmlFor="fMessage">Mensagem</label>
          <textarea id="fMessage" rows={5} placeholder="Descreva sua dúvida ou problema..." required />
        </div>
        <button type="submit" className="btn btn--gradient btn--full">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
          Enviar mensagem
        </button>
      </form>
    </div>
  );
}
