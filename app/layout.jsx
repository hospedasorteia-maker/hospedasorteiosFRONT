import "./globals.css";
import "./premium.css";

export const metadata = {
  title: "RifaMaster — Crie rifas que vendem de verdade",
  description:
    "Plataforma completa para criar, divulgar e gerenciar suas rifas online. Sorteios transparentes, pagamentos seguros e painel intuitivo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
