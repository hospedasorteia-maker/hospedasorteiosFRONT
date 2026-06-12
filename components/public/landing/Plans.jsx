import Link from "next/link";

export default function Plans() {
  return (
    <section className="section" id="planos">
      <div className="container">
        <div className="section__head reveal">
          <span className="section__tag">Planos</span>
          <h2 className="section__title">Preços simples e transparentes</h2>
          <p className="section__subtitle">Sem taxas escondidas. Cancele quando quiser.</p>
        </div>

        <div className="plans__grid reveal-stagger">
          <div className="plan reveal">
            <p className="plan__name">Grátis</p>
            <div className="plan__price"><strong>R$ 0</strong><span>/mês</span></div>
            <p className="plan__desc">Para quem está começando</p>
            <ul className="plan__features">
              <li><i className="check check--green"></i> 1 rifa ativa por vez</li>
              <li><i className="check check--green"></i> Até 100 números</li>
              <li><i className="check check--green"></i> Checkout PIX (QR + copia-e-cola)</li>
              <li><i className="check check--green"></i> Suporte por e-mail</li>
            </ul>
            <Link href="/cadastro" className="btn btn--primary btn--full">Começar grátis</Link>
          </div>

          <div className="plan plan--highlight reveal">
            <span className="plan__badge">Mais popular</span>
            <p className="plan__name">Pro</p>
            <div className="plan__price"><strong>R$ 49</strong><span>/mês</span></div>
            <p className="plan__desc">Para quem quer vender mais</p>
            <ul className="plan__features">
              <li><i className="check check--white"></i> Rifas ilimitadas</li>
              <li><i className="check check--white"></i> Até 10.000 números</li>
              <li><i className="check check--white"></i> PIX avançado + relatórios completos</li>
              <li><i className="check check--white"></i> Cartão e boleto (em breve)</li>
              <li><i className="check check--white"></i> Domínio personalizado</li>
              <li><i className="check check--white"></i> Suporte prioritário</li>
            </ul>
            <Link href="/cadastro" className="btn btn--white btn--full">Assinar Pro</Link>
          </div>

          <div className="plan reveal">
            <p className="plan__name">Business</p>
            <div className="plan__price"><strong>R$ 149</strong><span>/mês</span></div>
            <p className="plan__desc">Para grandes operações</p>
            <ul className="plan__features">
              <li><i className="check check--green"></i> Tudo do Pro</li>
              <li><i className="check check--green"></i> Múltiplos organizadores</li>
              <li><i className="check check--green"></i> API completa</li>
              <li><i className="check check--green"></i> White-label</li>
              <li><i className="check check--green"></i> Gerente dedicado</li>
            </ul>
            <Link href="/cadastro" className="btn btn--primary btn--full">Falar com vendas</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
