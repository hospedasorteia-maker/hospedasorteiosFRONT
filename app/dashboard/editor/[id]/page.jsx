import AppShell from "@/components/AppShell";
import RaffleEditor from "@/components/RaffleEditor";

export const metadata = {
  title: "Editor de Sorteio — RifaMaster",
};

export default function EditorPage() {
  return (
    <AppShell fullWidth>
      <RaffleEditor />
    </AppShell>
  );
}
