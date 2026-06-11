"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`navbar${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}
      id="navbar"
    >
      <div className="container navbar__inner">
        <BrandLogo prominent />

        <nav className="navbar__links">
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#planos">Planos</a>
          <a href="#suporte">Suporte</a>
        </nav>

        <div className="navbar__actions">
          <Link href="/login" className="btn btn--ghost btn--sm">Entrar</Link>
          <Link href="/cadastro" className="btn btn--gradient btn--sm">Começar grátis</Link>
        </div>

        <button
          className={`navbar__toggle${open ? " is-open" : ""}`}
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
          <svg className="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
        </button>
      </div>

      <div className="navbar__mobile" id="navMobile">
        <a href="#funcionalidades" onClick={closeMenu}>Funcionalidades</a>
        <a href="#como-funciona" onClick={closeMenu}>Como funciona</a>
        <a href="#planos" onClick={closeMenu}>Planos</a>
        <div className="navbar__mobile-actions">
          <Link href="/login" className="btn btn--outline" onClick={closeMenu}>Entrar</Link>
          <Link href="/cadastro" className="btn btn--gradient" onClick={closeMenu}>Criar conta</Link>
        </div>
      </div>
    </header>
  );
}
