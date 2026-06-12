import Link from "next/link";
import BackToDashboard from "@/components/public/rifa/BackToDashboard";

export default function AuthLayout({ icon, title, subtitle, footer, children }) {
  return (
    <main className="auth">
      <div className="auth__box">
        <div className="auth__head">
          <div className="auth__icon">{icon}</div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="auth__card">{children}</div>

        <p className="auth__footer">{footer}</p>

        <p className="auth__back">
          <BackToDashboard label="Ir para o painel" />
          {" · "}
          <Link href="/">Voltar para o site</Link>
        </p>
      </div>
    </main>
  );
}
