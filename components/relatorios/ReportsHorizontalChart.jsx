"use client";

import { useEffect, useState } from "react";

export default function ReportsHorizontalChart({ data, valueKey, formatLabel }) {
  const [animated, setAnimated] = useState(false);
  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [data, valueKey]);

  if (data.length === 0) {
    return <p className="reports__chart-empty">Sem dados para exibir</p>;
  }

  return (
    <div className="reports-h-chart">
      {data.map((item, index) => {
        const value = item[valueKey];
        const pct = Math.max(4, Math.round((value / max) * 100));
        const label = formatLabel ? formatLabel(value) : value;

        return (
          <div
            key={item.id}
            className="reports-h-chart__row"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="reports-h-chart__meta">
              <span className="reports-h-chart__rank">{index + 1}</span>
              <span className="reports-h-chart__name" title={item.fullName || item.name}>
                {item.fullName || item.name}
              </span>
            </div>
            <div className="reports-h-chart__track">
              <div
                className={`reports-h-chart__fill${animated ? " is-animated" : ""}`}
                style={{
                  width: animated ? `${pct}%` : "0%",
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
                  boxShadow: `0 2px 8px ${item.color}33`,
                }}
              />
            </div>
            <span className="reports-h-chart__value">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
