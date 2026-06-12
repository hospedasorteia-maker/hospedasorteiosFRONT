const STEPS = [
  {
    num: "01",
    title: "Crie sua rifa",
    text: "Preencha as informações do prêmio, quantidade de números e preço. Leva menos de 5 minutos.",
  },
  {
    num: "02",
    title: "Compartilhe",
    text: "Envie o link pelo WhatsApp, Instagram ou qualquer rede social. Seus seguidores compram pelo celular.",
  },
  {
    num: "03",
    title: "Receba na hora",
    text: "O comprador paga via PIX (QR Code ou copia-e-cola). Você acompanha reservas e vendas no painel.",
  },
  {
    num: "04",
    title: "Realize o sorteio",
    text: "Na data combinada, registre o ganhador e publique o resultado para os participantes.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section how-steps" id="como-funciona">
      <div className="how-steps__glow" aria-hidden="true" />

      <div className="container">
        <div className="section__head">
          <span className="section__tag">Como funciona</span>
          <h2 className="section__title">Do zero ao sorteio em 4 passos</h2>
          <p className="how-steps__subtitle">
            Um fluxo simples do cadastro à divulgação do resultado — tudo pelo celular ou computador.
          </p>
        </div>

        <div className="how-steps__grid">
          {STEPS.map((step) => (
            <article className="how-steps__card" key={step.num}>
              <span className="how-steps__index">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
