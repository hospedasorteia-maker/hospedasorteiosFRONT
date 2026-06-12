import Link from "next/link";
import HeroPreview from "./HeroPreview";

const SYSTEM_INFO = [
  {
    title: "Painel completo",
    text: "Crie campanhas, edite números, cores e prêmios em um só lugar.",
    icon: "📊",
  },
  {
    title: "PIX automático",
    text: "Receba pagamentos na hora com confirmação e reserva de números.",
    icon: "⚡",
  },
  {
    title: "Página pública",
    text: "Link exclusivo para divulgar no WhatsApp, Instagram e grupos.",
    icon: "🔗",
  },
  {
    title: "Jogo do Bicho",
    text: "Modo integrado com 25 bichos, 100 dezenas e resultado oficial.",
    icon: "🎯",
  },
  {
    title: "Relatórios ao vivo",
    text: "Acompanhe vendas, receita, participantes e desempenho da campanha.",
    icon: "📈",
  },
  {
    title: "Sorteio seguro",
    text: "Processo transparente com certificado e histórico do resultado.",
    icon: "🛡️",
  },
];

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
        <span className="hero__badge">
          ✦ A plataforma feita para quem quer vender números e sortear com confiança
        </span>

        <h1 className="hero__title">
          Lance seu sorteio online e <span className="text-gradient">comece a arrecadar agora</span>
        </h1>

        <p className="hero__text">
          Crie campanhas profissionais em poucos cliques, receba via PIX automaticamente
          e acompanhe tudo em um painel simples. Sem planilha, sem dor de cabeça.
        </p>

        <div className="hero__actions">
          <Link href="/cadastro" className="btn btn--gradient btn--lg">
            Quero criar meu sorteio grátis
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
          <a href="#como-funciona" className="btn btn--outline-light btn--lg">
            Ver como funciona
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </a>
        </div>

        <div className="hero__trust">
          <span><i className="check"></i> Cadastro gratuito</span>
          <span><i className="check"></i> Sem cartão para começar</span>
          <span><i className="check"></i> Jogo do Bicho integrado</span>
          <span><i className="check"></i> Suporte humano</span>
        </div>

        <HeroPreview />

        <div className="hero__info">
          <p className="hero__info-label">O que você encontra no TironiDraws</p>
          <div className="hero__info-grid">
            {SYSTEM_INFO.map((item) => (
              <article className="hero__info-card" key={item.title}>
                <span className="hero__info-icon" aria-hidden>{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
    </section>
  );
}
