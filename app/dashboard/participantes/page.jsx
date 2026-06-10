import AppShell from "@/components/AppShell";
import ParticipantsContent from "@/components/participantes/ParticipantsContent";

export const metadata = {
  title: "Participantes — RifaMaster",
};

export default function ParticipantesPage() {
  return (
    <AppShell>
      <ParticipantsContent />
    </AppShell>
  );
}
