"use client";

function ReportsBarChart({ data, valueKey, formatLabel }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  if (data.length === 0) {
    return <p className="reports__chart-empty">Sem dados para exibir</p>;
  }

  return (
    <div className="reports-chart">
      {data.map((item) => {
        const value = item[valueKey];
        const height = Math.max(4, Math.round((value / max) * 100));
        return (
          <div key={item.id} className="reports-chart__item">
            <div className="reports-chart__value">{formatLabel ? formatLabel(value) : value}</div>
            <div className="reports-chart__bar-track">
              <div
                className="reports-chart__bar"
                style={{ height: `${height}%`, backgroundColor: item.color }}
                title={`${item.fullName || item.name}: ${formatLabel ? formatLabel(value) : value}`}
              />
            </div>
            <div className="reports-chart__label">{item.name}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ReportsBarChart;
