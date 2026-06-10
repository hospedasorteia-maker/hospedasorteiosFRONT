const TESTIMONIALS = [
  {
    text: '"Criei minha primeira rifa em 10 minutos e arrecadei R$ 3.000 no primeiro dia. Plataforma incrível!"',
    initials: "MC",
    name: "Mariana Costa",
    role: "Empreendedora",
  },
  {
    text: '"Já testei várias plataformas e essa é de longe a melhor. PIX instantâneo e relatórios detalhados."',
    initials: "RS",
    name: "Rafael Souza",
    role: "Influencer digital",
  },
  {
    text: '"Minha rifa de moto vendeu 100% em menos de 48h! O link funciona perfeitamente no WhatsApp."',
    initials: "JA",
    name: "Juliana Alves",
    role: "Loja de roupas",
  },
  {
    text: '"O sorteio ao vivo deu muita credibilidade. Todos os participantes ficaram satisfeitos."',
    initials: "CM",
    name: "Carlos Menezes",
    role: "Corretor de imóveis",
  },
  {
    text: '"Suporte excelente, responde na hora. Nunca tive nenhum problema com pagamentos."',
    initials: "FL",
    name: "Fernanda Lima",
    role: "Microempreendedora",
  },
  {
    text: '"Interface linda e super intuitiva. Minha comunidade amou participar pela plataforma."',
    initials: "DM",
    name: "Diego Martins",
    role: "Youtuber",
  },
];

export default function Testimonials() {
  return (
    <section className="section section--muted" id="depoimentos">
      <div className="container">
        <div className="section__head reveal">
          <span className="section__tag">Depoimentos</span>
          <h2 className="section__title">Quem usa, aprova</h2>
          <div className="rating">
            <span className="stars">★★★★★</span>
            <span className="rating__label">4.9 de 5 — mais de 2.000 avaliações</span>
          </div>
        </div>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial reveal" key={t.name}>
              <div className="stars stars--sm">★★★★★</div>
              <p>{t.text}</p>
              <div className="testimonial__author">
                <span className="avatar">{t.initials}</span>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
