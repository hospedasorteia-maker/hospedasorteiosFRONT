import AppShell from "@/components/AppShell";
import ReportsContent from "@/components/relatorios/ReportsContent";

export const metadata = {
  title: "Relatórios — RifaMaster",
};

export default function RelatoriosPage() {
  return (
    <AppShell>
      <ReportsContent />
    </AppShell>
  );
}
