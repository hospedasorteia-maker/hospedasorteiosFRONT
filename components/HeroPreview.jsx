const CHART_HEIGHTS = [55, 80, 45, 90, 65, 75, 50, 85];

export default function HeroPreview() {
  return (
    <div className="hero__preview reveal">
      <div className="hero__preview-glow" aria-hidden="true" />
      <div className="hero__preview-frame">
        <div className="hero__preview-bar">
          <span className="hero__preview-dot hero__preview-dot--red" />
          <span className="hero__preview-dot hero__preview-dot--yellow" />
          <span className="hero__preview-dot hero__preview-dot--green" />
          <span className="hero__preview-url">app.rifamaster.com.br/dashboard</span>
        </div>

        <div className="hero__preview-body">
          <div className="hero__preview-sidebar" aria-hidden="true">
            <div className="hero__preview-nav hero__preview-nav--active" />
            <div className="hero__preview-nav" />
            <div className="hero__preview-nav" />
            <div className="hero__preview-nav" />
            <div className="hero__preview-nav" />
          </div>

          <div className="hero__preview-main">
            <div className="hero__preview-metrics">
              <div className="hero__preview-metric">
                <p className="hero__preview-metric-label">Receita</p>
                <p className="hero__preview-metric-value">R$ 12.4k</p>
              </div>
              <div className="hero__preview-metric">
                <p className="hero__preview-metric-label">Vendidos</p>
                <p className="hero__preview-metric-value">847</p>
              </div>
              <div className="hero__preview-metric">
                <p className="hero__preview-metric-label">Conversão</p>
                <p className="hero__preview-metric-value">68%</p>
              </div>
            </div>

            <div className="hero__preview-chart" aria-hidden="true">
              {CHART_HEIGHTS.map((h, i) => (
                <div
                  key={`bar-${i}`}
                  className="hero__preview-bar-chart"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
