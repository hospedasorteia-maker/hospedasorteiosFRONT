const STATS = [
  { target: 12400, suffix: "+", label: "Rifas criadas" },
  { target: 350000, suffix: "+", label: "Participantes" },
  { target: 4200000, suffix: " R$", label: "Arrecadados" },
  { target: 98, suffix: "%", label: "Satisfação" },
];

export default function Stats() {
  return (
    <section className="stats">
      <div className="container stats__grid">
        {STATS.map((stat) => (
          <div className="stat reveal" key={stat.label}>
            <p className="stat__value">
              <span className="counter" data-target={stat.target}>0</span>
              {stat.suffix}
            </p>
            <p className="stat__label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
