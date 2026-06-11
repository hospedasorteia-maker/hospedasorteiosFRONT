import { Suspense } from "react";
import SettingsContent from "@/components/dashboard/configuracoes/SettingsContent";

export const metadata = {
  title: "Configurações — RifaMaster",
};

export default function ConfiguracoesPage() {
  return (
    <Suspense fallback={<div className="settings settings--loading"><div className="rifa-publica__spinner" /></div>}>
      <SettingsContent />
    </Suspense>
  );
}
