import AppShell from "@/components/AppShell";
import HelpContent from "@/components/suporte/HelpContent";

export const metadata = {
  title: "Central de Ajuda — RifaMaster",
};

export default function AjudaPage() {
  return (
    <AppShell>
      <HelpContent />
    </AppShell>
  );
}
