import {
  BICHO_DRAW_BANCA,
  BICHO_DRAW_SCHEDULE,
  BICHO_DRAW_URL,
} from "@/lib/services/jogoDoBicho";

export default function BichoDrawSourceLink({ variant = "public", primaryColor = "#7C3AED" }) {
  const isEditor = variant === "editor";

  return (
    <div className={`bicho-draw-source${isEditor ? " bicho-draw-source--editor" : ""}`}>
      <div className="bicho-draw-source__head">
        <span className="bicho-draw-source__dot" aria-hidden />
        <div>
          <strong>Resultado oficial — {BICHO_DRAW_BANCA}</strong>
          <p>
            {isEditor
              ? "Confira a dezena sorteada no site e informe o vencedor abaixo."
              : "O sorteio segue o resultado publicado em tempo real no Lotodobicho."}
          </p>
        </div>
      </div>
      <p className="bicho-draw-source__times">
        Horários: {BICHO_DRAW_SCHEDULE.join(", ")}
      </p>
      <a
        href={BICHO_DRAW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="bicho-draw-source__link"
        style={isEditor ? undefined : { borderColor: `${primaryColor}40`, color: primaryColor }}
      >
        Ver resultados no Lotodobicho
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </div>
  );
}
