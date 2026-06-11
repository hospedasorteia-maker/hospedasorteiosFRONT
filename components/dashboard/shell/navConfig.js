export const PAGE_TITLES = {
  "/dashboard": "Campanhas",
  "/dashboard/participantes": "Participantes",
  "/dashboard/relatorios": "Relatórios",
  "/dashboard/configuracoes": "Configurações",
  "/dashboard/configuracoes/pagamento": "Meios de pagamento",
  "/dashboard/suporte": "Suporte",
  "/dashboard/ajuda": "Central de ajuda",
};

export function getPageTitle(pathname) {
  if (pathname.startsWith("/dashboard/editor")) return "Editor de sorteio";
  return PAGE_TITLES[pathname] || "RifaMaster";
}

function isActive(pathname, item) {
  if (item.match === "exact") return pathname === item.href;
  if (item.match === "editor") return pathname.startsWith("/dashboard/editor");
  if (item.match === "config") return pathname.startsWith("/dashboard/configuracoes");
  if (item.sub) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export const NAV_SECTIONS = [
  {
    label: "Operação",
    items: [
      { href: "/dashboard", label: "Campanhas", match: "exact", icon: "campaign" },
      { href: "/dashboard/participantes", label: "Participantes", icon: "users" },
      { href: "/dashboard/relatorios", label: "Relatórios", icon: "chart" },
    ],
  },
  {
    label: "Criar",
    items: [
      { href: "/dashboard/editor/new", label: "Novo sorteio", match: "editor", icon: "plus", highlight: true },
    ],
  },
  {
    label: "Conta",
    items: [
      { href: "/dashboard/configuracoes", label: "Configurações", match: "config", icon: "settings" },
      { href: "/dashboard/configuracoes/pagamento", label: "Meios de pagamento", sub: true, icon: "payment" },
    ],
  },
];

export const NAV_BOTTOM = [
  { href: "/dashboard/ajuda", label: "Central de ajuda", icon: "help" },
  { href: "/dashboard/suporte", label: "Suporte", icon: "support" },
  { href: "/login", label: "Sair", icon: "logout", logout: true },
];

export { isActive };
