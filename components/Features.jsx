const FEATURES = [
  {
    grad: "grad-1",
    title: "Personalização total",
    text: "Cores, imagens, temas e layout do seu jeito. Sua rifa com a sua cara.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
    ),
  },
  {
    grad: "grad-2",
    title: "PIX integrado",
    text: "Pagamentos instantâneos via PIX, cartão ou boleto. Aprovação em segundos.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
    ),
  },
  {
    grad: "grad-3",
    title: "Relatórios em tempo real",
    text: "Acompanhe vendas, receita e participantes com gráficos detalhados.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
    ),
  },
  {
    grad: "grad-4",
    title: "Sorteio transparente",
    text: "Sorteio ao vivo com certificado de autenticidade para todos os participantes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
    ),
  },
  {
    grad: "grad-5",
    title: "Divulgação fácil",
    text: "Link único para compartilhar. Funciona no WhatsApp, Instagram e mais.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    ),
  },
  {
    grad: "grad-6",
    title: "Gestão de participantes",
    text: "Controle quem comprou, quem pagou e gerencie contatos com facilidade.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
  },
];

export default function Features() {
  return (
    <section className="section" id="funcionalidades">
      <div className="container">
        <div className="section__head reveal">
          <span className="section__tag">Funcionalidades</span>
          <h2 className="section__title">
            Tudo que você precisa para<br className="br-desktop" /> vender mais
          </h2>
          <p className="section__subtitle">
            Uma plataforma completa do início ao fim, sem complicação.
          </p>
        </div>

        <div className="features__grid">
          {FEATURES.map((feature) => (
            <article className="feature reveal" key={feature.title}>
              <div className={`feature__icon ${feature.grad}`}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
