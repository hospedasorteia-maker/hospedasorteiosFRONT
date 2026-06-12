import Link from "next/link";
import AuthLayout from "@/components/public/auth/AuthLayout";
import CadastroForm from "@/components/public/auth/CadastroForm";

export const metadata = {
  title: "Criar conta — TironiDraws",
};

export default function CadastroPage() {
  return (
    <AuthLayout
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21a8 8 0 0 1 13.292-6" /><circle cx="10" cy="8" r="5" /><path d="M19 16v6" /><path d="M22 19h-6" /></svg>
      }
      title="Crie sua conta"
      subtitle="Cadastre-se para começar"
      footer={
        <>Já tem uma conta? <Link href="/login">Entrar</Link></>
      }
    >
      <CadastroForm />
    </AuthLayout>
  );
}
