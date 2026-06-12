"use client";

import "../../styles/dashboard.css";
import "../../styles/dashboard-pages.css";
import AppShell from "@/components/dashboard/shell/AppShell";

export default function DashboardShellLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
