import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Entrar — TironiDraws",
};

export default function LoginPage() {
  return (
    <AuthLayout
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 17 5-5-5-5" /><path d="M15 12H3" /><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></svg>
      }
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta"
      footer={
        <>Não tem conta? <Link href="/cadastro">Criar uma</Link></>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
