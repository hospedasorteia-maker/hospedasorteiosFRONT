import Link from "next/link";

export const LOGO_SRC = "/logo.png";

export default function BrandLogo({ footer = false, prominent = false, showTag = true }) {
  const classes = [
    "brand",
    footer ? "brand--footer" : "",
    prominent ? "brand--prominent" : "",
  ].filter(Boolean).join(" ");

  const iconSize = footer ? 34 : prominent ? 44 : 40;

  return (
    <Link href="/" className={classes}>
      <img
        src={LOGO_SRC}
        alt="RifaMaster"
        width={iconSize}
        height={iconSize}
        className="brand__image"
        decoding="async"
      />
      <span className="brand__copy">
        <span className="brand__name">RifaMaster</span>
        {prominent && showTag && <span className="brand__tag">Sorteios online</span>}
      </span>
    </Link>
  );
}

export function HeroLogo() {
  return (
    <div className="hero__logo reveal">
      <div className="hero__logo-glow" aria-hidden />
      <img
        src={LOGO_SRC}
        alt="RifaMaster"
        width={320}
        height={320}
        className="hero__logo-image"
        decoding="async"
      />
    </div>
  );
}
