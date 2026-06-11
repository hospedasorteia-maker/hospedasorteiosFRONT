"use client";

export default function ReportsRevenueRing({ data, total, formatLabel }) {
  const segments = data.filter((d) => d.receita > 0);
  const safeTotal = total > 0 ? total : segments.reduce((sum, d) => sum + d.receita, 0);

  if (!safeTotal || segments.length === 0) {
    return (
      <div className="reports-ring reports-ring--empty">
        <p>Nenhuma receita registrada</p>
      </div>
    );
  }

  let acc = 0;
  const gradient = segments
    .map((d) => {
      const pct = (d.receita / safeTotal) * 100;
      const start = acc;
      acc += pct;
      return `${d.color} ${start}% ${acc}%`;
    })
    .join(", ");

  return (
    <div className="reports-ring">
      <div
        className="reports-ring__donut"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="reports-ring__center">
          <span>Total</span>
          <strong>{formatLabel(safeTotal)}</strong>
        </div>
      </div>
      <ul className="reports-ring__legend">
        {segments.map((d) => {
          const pct = Math.round((d.receita / safeTotal) * 100);
          return (
            <li key={d.id}>
              <span className="reports-ring__dot" style={{ background: d.color }} />
              <span className="reports-ring__legend-name" title={d.fullName || d.name}>
                {d.name}
              </span>
              <span className="reports-ring__legend-pct">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
