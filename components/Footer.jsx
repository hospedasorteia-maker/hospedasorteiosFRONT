import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <BrandLogo footer />
        <p className="footer__copy">© 2026 RifaMaster. Todos os direitos reservados.</p>
        <div className="footer__links">
          <a href="#">Termos</a>
          <a href="#">Privacidade</a>
          <a href="#suporte">Contato</a>
        </div>
      </div>
    </footer>
  );
}
