import SupportForm from "./SupportForm";

export default function Support() {
  return (
    <section className="section" id="suporte">
      <div className="container">
        <div className="section__head reveal">
          <span className="section__tag">Suporte</span>
          <h2 className="section__title">Estamos aqui para ajudar</h2>
          <p className="section__subtitle">
            Tem alguma dúvida? Fale com a nossa equipe. Respondemos em até 2 horas.
          </p>
        </div>

        <div className="support__grid">
          <div className="support__channels reveal">
            <div className="channel">
              <div className="channel__icon channel__icon--violet">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
              </div>
              <div>
                <strong>Chat ao vivo</strong>
                <p>Disponível de seg a sex, das 8h às 20h. Respostas em minutos.</p>
              </div>
            </div>
            <div className="channel">
              <div className="channel__icon channel__icon--purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <div>
                <strong>E-mail</strong>
                <p>suporte@TironiDraws.com.br — respondemos em até 2 horas.</p>
              </div>
            </div>
            <div className="channel">
              <div className="channel__icon channel__icon--fuchsia">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
              <div>
                <strong>WhatsApp</strong>
                <p>(11) 99999-0000 — Mande uma mensagem a qualquer hora.</p>
              </div>
            </div>
          </div>

          <SupportForm />
        </div>
      </div>
    </section>
  );
}
