"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy, Users, BarChart2, Settings, CreditCard, Palette,
  HelpCircle, Headphones, LogOut, ChevronRight, Ticket, Menu,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Plataforma",
    items: [
      { path: "/dashboard", label: "Campanhas", icon: Ticket },
      { path: "/participantes", label: "Participantes", icon: Users },
      { path: "#relatorios", label: "Relatórios", icon: BarChart2 },
    ],
  },
  {
    label: "Configurações",
    items: [
      { path: "#configuracoes", label: "Configurações", icon: Settings, hasArrow: true },
      { path: "#pagamento", label: "Meio de Pagamento", icon: CreditCard },
      { path: "#personalizar", label: "Personalizar Rifa", icon: Palette },
    ],
  },
];

const BOTTOM_ITEMS = [
  { path: "#suporte", label: "Suporte", icon: Headphones },
  { path: "#ajuda", label: "Central de Ajuda", icon: HelpCircle },
];

function NavItem({ item, isActive, onNavigate }) {
  const Icon = item.icon;
  const className = `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
    isActive
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-foreground/80 hover:bg-muted hover:text-foreground"
  }`;

  const content = (
    <>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.hasArrow && (
        <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
      )}
    </>
  );

  if (item.path.startsWith("#")) {
    return <a href={item.path} className={className}>{content}</a>;
  }
  return (
    <Link href={item.path} className={className} onClick={onNavigate}>
      {content}
    </Link>
  );
}

function SidebarContent({ pathname, onNavigate }) {
  return (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onNavigate}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg">Sorteios</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  isActive={pathname === item.path}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border space-y-0.5">
        {BOTTOM_ITEMS.map((item) => (
          <NavItem key={item.path} item={item} isActive={false} onNavigate={onNavigate} />
        ))}

        <Link
          href="/login"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all mt-1"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </Link>

        {/* Plan badge */}
        <div className="mt-3 mx-1 p-3 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Minha Conta</p>
              <p className="text-[10px] text-muted-foreground">Plano gratuito</p>
            </div>
          </div>
          <button className="w-full text-xs font-semibold bg-primary text-primary-foreground rounded-lg py-1.5 hover:bg-primary/90 transition-colors">
            Criar Sorteio
          </button>
        </div>
      </div>
    </>
  );
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 flex-shrink-0 bg-card border-r border-border flex-col h-screen sticky top-0">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Sidebar mobile (drawer) */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 flex w-60 bg-card border-r border-border flex-col h-screen md:hidden">
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      <div className="flex-1 min-w-0">
        {/* Topbar mobile */}
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
          <button onClick={() => setMobileOpen(true)} className="p-1.5" aria-label="Abrir menu">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-bold">Sorteios</span>
        </div>

        {children}
      </div>
    </div>
  );
}
