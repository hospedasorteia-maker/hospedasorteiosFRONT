import AppShell from "@/components/AppShell";
import PaymentContent from "@/components/configuracoes/PaymentContent";

export const metadata = {
  title: "Meios de Pagamento — RifaMaster",
};

export default function PagamentoPage() {
  return (
    <AppShell>
      <PaymentContent />
    </AppShell>
  );
}
