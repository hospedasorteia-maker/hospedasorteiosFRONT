"use client";

import { useEffect, useState } from "react";

function ReportsBarChart({ data, valueKey, formatLabel, variant = "default" }) {
  const [animated, setAnimated] = useState(false);
  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [data, valueKey]);

  if (data.length === 0) {
    return <p className="reports__chart-empty">Sem dados para exibir</p>;
  }

  const gridLines = [100, 75, 50, 25, 0];

  return (
    <div className={`reports-chart reports-chart--${variant}`}>
      <div className="reports-chart__grid">
        {gridLines.map((line) => (
          <div key={line} className="reports-chart__grid-line">
            <span>{line === 100 ? (formatLabel ? formatLabel(max) : max) : line === 0 ? "0" : ""}</span>
          </div>
        ))}
      </div>
      <div className="reports-chart__bars">
        {data.map((item, index) => {
          const value = item[valueKey];
          const height = Math.max(6, Math.round((value / max) * 100));
          const label = formatLabel ? formatLabel(value) : value;
          return (
            <div key={item.id} className="reports-chart__item" style={{ animationDelay: `${index * 60}ms` }}>
              <div className="reports-chart__tooltip">
                <strong>{item.fullName || item.name}</strong>
                <span>{label}</span>
              </div>
              <div className="reports-chart__value">{label}</div>
              <div className="reports-chart__bar-track">
                <div
                  className={`reports-chart__bar${animated ? " is-animated" : ""}`}
                  style={{
                    height: animated ? `${height}%` : "0%",
                    background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}cc 100%)`,
                    boxShadow: `0 4px 14px ${item.color}44`,
                  }}
                />
              </div>
              <div className="reports-chart__label" title={item.fullName || item.name}>
                {item.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReportsBarChart;
