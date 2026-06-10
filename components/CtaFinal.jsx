import Link from "next/link";

export default function CtaFinal() {
  return (
    <section className="cta">
      <div className="cta__blob" aria-hidden="true"></div>
      <div className="container cta__content">
        <div className="cta__trophy reveal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
        </div>
        <h2 className="reveal">Pronto para criar sua<br />primeira rifa?</h2>
        <p className="reveal">
          Junte-se a milhares de organizadores que já arrecadaram mais de R$ 4 milhões na plataforma.
        </p>
        <div className="cta__actions reveal">
          <Link href="/cadastro" className="btn btn--gradient btn--lg">
            Criar conta grátis
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
          <Link href="/login" className="btn btn--outline-light btn--lg">Já tenho conta</Link>
        </div>
      </div>
    </section>
  );
}
