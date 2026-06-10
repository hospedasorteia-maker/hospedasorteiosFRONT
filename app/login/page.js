"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

const inputClass =
  "w-full h-12 pl-10 pr-3 rounded-xl border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Login visual (sem backend): qualquer e-mail/senha entra no dashboard
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 800);
  };

  const handleGoogle = () => {
    router.push("/dashboard");
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta"
      footer={
        <>
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-primary font-medium hover:underline">
            Criar uma
          </Link>
        </>
      }
    >
      <button
        type="button"
        onClick={handleGoogle}
        className="inline-flex items-center justify-center gap-2 w-full h-12 text-sm font-medium mb-6 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
      >
        <GoogleIcon className="w-5 h-5" />
        Continuar com Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">ou</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">Senha</label>
            <a href="#" className="text-xs text-primary hover:underline">Esqueceu a senha?</a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-xl text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
