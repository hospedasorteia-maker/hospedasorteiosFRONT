import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import SettingsContent from "@/components/configuracoes/SettingsContent";

export const metadata = {
  title: "Configurações — RifaMaster",
};

export default function ConfiguracoesPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="settings settings--loading"><div className="rifa-publica__spinner" /></div>}>
        <SettingsContent />
      </Suspense>
    </AppShell>
  );
}
