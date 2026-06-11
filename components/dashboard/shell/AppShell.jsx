"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { initSettingsAppearance } from "@/lib/settings";
import { signOut } from "@/lib/auth";
import { getPageTitle, NAV_SECTIONS, NAV_BOTTOM, isActive } from "./navConfig";

const ICONS = {
  campaign: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  payment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
  ),
  help: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" /></svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  ),
  brand: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
  ),
};

function NavLink({ item, pathname, onNavigate }) {
  const router = useRouter();
  const active = isActive(pathname, item);
  const classes = [
    "nav-item",
    item.sub ? "nav-item--sub" : "",
    item.highlight ? "nav-item--highlight" : "",
    item.logout ? "nav-item--logout" : "",
    active ? "nav-item--active" : "",
  ].filter(Boolean).join(" ");

  function handleLogout(e) {
    e.preventDefault();
    signOut();
    onNavigate?.();
    router.push("/");
  }

  if (item.logout) {
    return (
      <a href="/" className={classes} onClick={handleLogout}>
        {ICONS[item.icon]}
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href} className={classes} onClick={onNavigate}>
      {ICONS[item.icon]}
      {item.label}
    </Link>
  );
}

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    initSettingsAppearance();
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app">
      <aside className={`sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="sidebar__logo">
          <BrandLogo prominent />
        </div>

        <nav className="sidebar__nav">
          {NAV_SECTIONS.map((section) => (
            <div className="nav-section" key={section.label}>
              <p className="nav-section__label">{section.label}</p>
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onNavigate={closeSidebar} />
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar__bottom">
          {NAV_BOTTOM.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onNavigate={closeSidebar} />
          ))}

          <div className="plan-card">
            <div className="plan-card__head">
              <span className="plan-card__icon">{ICONS.brand}</span>
              <div>
                <p className="plan-card__title">Minha conta</p>
                <p className="plan-card__plan">Plano gratuito</p>
              </div>
            </div>
            <Link href="/dashboard/editor/new" className="plan-card__btn">Criar sorteio</Link>
          </div>
        </div>
      </aside>

      <div
        className={`sidebar-overlay${sidebarOpen ? " is-visible" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <main className="main">
        <div className="topbar">
          <button className="topbar__menu" type="button" aria-label="Abrir menu" onClick={() => setSidebarOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
          </button>
          <span className="topbar__title">{pageTitle}</span>
        </div>

        <div className="content">{children}</div>
      </main>
    </div>
  );
}
