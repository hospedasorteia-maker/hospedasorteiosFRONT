import Link from "next/link";
import { HeroLogo } from "./BrandLogo";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__aurora" />
        <div className="hero__blob hero__blob--1"></div>
        <div className="hero__blob hero__blob--2"></div>
        <div className="hero__blob hero__blob--3"></div>
        <div className="hero__grid"></div>
        <div className="hero__particles">
          {Array.from({ length: 22 }, (_, i) => (
            <span
              key={`particle-${i}`}
              className="hero__particle"
              style={{
                "--particle-i": i,
                "--particle-x": `${8 + ((i * 41) % 84)}%`,
                "--particle-y": `${6 + ((i * 29) % 88)}%`,
                "--particle-size": `${3 + (i % 4)}px`,
                "--particle-delay": `${(i % 7) * 0.45}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container hero__content">
        <HeroLogo />

        <span className="hero__badge reveal">
          ✦ Plataforma #1 de sorteios online no Brasil
        </span>

        <h1 className="hero__title reveal">
          Crie sorteios que <span className="text-gradient">vendem de verdade</span>
        </h1>

        <p className="hero__text reveal">
          Plataforma completa para criar, divulgar e gerenciar seus sorteios online.
          Sorteios transparentes, pagamentos seguros e painel intuitivo.
        </p>

        <div className="hero__actions reveal">
          <Link href="/cadastro" className="btn btn--gradient btn--lg">
            Criar meu primeiro sorteio
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
          <a href="#como-funciona" className="btn btn--outline-light btn--lg">
            Ver como funciona
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </a>
        </div>

        <div className="hero__trust reveal">
          <span><i className="check"></i> Sem taxa de cadastro</span>
          <span><i className="check"></i> Pagamento via PIX</span>
          <span><i className="check"></i> Sorteio ao vivo</span>
          <span><i className="check"></i> Suporte 24h</span>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
    </section>
  );
}
