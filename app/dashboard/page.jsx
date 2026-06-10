import AppShell from "@/components/AppShell";
import DashboardContent from "@/components/DashboardContent";

export const metadata = {
  title: "Dashboard — RifaMaster",
};

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
