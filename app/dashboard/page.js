"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Trophy, Sparkles, DollarSign,
  TrendingUp, ShoppingBag, ArrowUpRight, Ticket, Wallet, Users, Star,
} from "lucide-react";
import AppShell from "@/components/AppShell";

// ── Dados de exemplo (sem backend) ───────────────────────────
const RAFFLES = [
  { id: 1, title: "Sorteio iPhone 16 Pro",   prize: "iPhone 16 Pro",  emoji: "📱", price: 10, sold: 72,  total: 100, status: "active",   bg: "from-violet-100 to-violet-200" },
  { id: 2, title: "Rifa Moto Honda CG 160",  prize: "Moto Honda",     emoji: "🏍️", price: 25, sold: 225, total: 500, status: "active",   bg: "from-amber-100 to-amber-200" },
  { id: 3, title: "Cesta de Natal Premium",  prize: "Cesta de Natal", emoji: "🎁", price: 5,  sold: 50,  total: 50,  status: "finished", bg: "from-emerald-100 to-emerald-200" },
];

const METRICS = {
  receita: 8450,
  comprasConfirmadas: 142,
  ticketMedio: 59.51,
  numerosVendidos: 315,
  sorteiosAtivos: 2,
  participantes: 87,
  totalCompras: 142,
};

const fmtMoeda = (v) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Card de métrica principal (grande) ───────────────────────
function PrimaryMetric({ icon: Icon, label, value, sub, gradient, trend }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 ${gradient}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4" />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <span className="flex items-center gap-1 text-xs font-bold text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              {trend}
            </span>
          )}
        </div>
        <p className="text-white/70 text-sm font-semibold mb-1">{label}</p>
        <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading leading-tight">
          {value}
        </p>
        {sub && <p className="text-white/60 text-xs mt-2 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

// ── Card de métrica secundária (pequeno) ─────────────────────
function SecondaryMetric({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-sm font-semibold text-slate-600">{label}</p>
      </div>
      <p className="text-2xl font-bold text-slate-900 font-heading">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

// ── Card de sorteio ──────────────────────────────────────────
function RaffleCard({ raffle }) {
  const pct = Math.round((raffle.sold / raffle.total) * 100);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className={`relative h-32 grid place-items-center text-5xl bg-gradient-to-br ${raffle.bg}`}>
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white ${raffle.status === "active" ? "bg-emerald-500" : "bg-slate-600"}`}>
          {raffle.status === "active" ? "Ativo" : "Finalizado"}
        </span>
        {raffle.emoji}
      </div>
      <div className="p-5">
        <h3 className="font-heading font-bold text-slate-900">{raffle.title}</h3>
        <p className="text-sm font-bold text-violet-600 mt-1">
          R$ {fmtMoeda(raffle.price)} <span className="font-normal text-slate-400">por número</span>
        </p>
        <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>{raffle.sold} / {raffle.total} vendidos</span>
          <span>{pct}%</span>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 h-9 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors">
            {raffle.status === "active" ? "Ver sorteio" : "Ver resultado"}
          </button>
          <button className="flex-1 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">
            {raffle.status === "active" ? "Editar" : "Detalhes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const filtered = RAFFLES.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.prize.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Acompanhe suas vendas e sorteios em tempo real</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm h-11 px-6 text-sm transition-colors">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Novo Sorteio</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>

        {/* MÉTRICAS PRINCIPAIS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <PrimaryMetric
              icon={DollarSign}
              label="Total Arrecadado"
              value={`R$ ${fmtMoeda(METRICS.receita)}`}
              sub={`${METRICS.comprasConfirmadas} compras confirmadas · Ticket médio: R$ ${fmtMoeda(METRICS.ticketMedio)}`}
              gradient="bg-gradient-to-br from-violet-600 via-violet-700 to-violet-800"
              trend="+12%"
            />
          </div>

          <PrimaryMetric
            icon={Ticket}
            label="Números Vendidos"
            value={METRICS.numerosVendidos}
            sub={`${METRICS.sorteiosAtivos} sorteios ativos · ${METRICS.participantes} participantes`}
            gradient="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700"
            trend="+8%"
          />
        </div>

        {/* Métricas secundárias */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SecondaryMetric
            icon={Trophy}
            label="Sorteios Ativos"
            value={METRICS.sorteiosAtivos}
            sub={`de ${RAFFLES.length} total`}
            accent="bg-emerald-100 text-emerald-700"
          />
          <SecondaryMetric
            icon={ShoppingBag}
            label="Total de Compras"
            value={METRICS.totalCompras}
            sub="todas as transações"
            accent="bg-sky-100 text-sky-600"
          />
          <SecondaryMetric
            icon={Users}
            label="Participantes"
            value={METRICS.participantes}
            sub="únicos"
            accent="bg-rose-100 text-rose-600"
          />
          <SecondaryMetric
            icon={Wallet}
            label="Ticket Médio"
            value={`R$ ${fmtMoeda(METRICS.ticketMedio)}`}
            sub="por compra"
            accent="bg-indigo-100 text-indigo-600"
          />
        </div>

        {/* Atalhos rápidos */}
        <div className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Acesso Rápido
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Relatórios", href: "#relatorios", icon: TrendingUp, color: "text-violet-600 bg-violet-50 border-violet-100 hover:bg-violet-100" },
              { label: "Participantes", href: "/participantes", icon: Users, color: "text-slate-700 bg-white border-slate-200 hover:bg-slate-50" },
              { label: "Configurações", href: "#configuracoes", icon: Sparkles, color: "text-slate-700 bg-white border-slate-200 hover:bg-slate-50" },
            ].map(({ label, href, icon: Icon, color }) => {
              const className = `flex items-center justify-between px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${color}`;
              const content = (
                <>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                </>
              );
              return href.startsWith("#") ? (
                <a key={href} href={href} className={className}>{content}</a>
              ) : (
                <Link key={href} href={href} className={className}>{content}</Link>
              );
            })}
          </div>
        </div>

        {/* Lista de sorteios */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold font-heading text-slate-900">Seus Sorteios</h2>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar sorteios..."
                className="w-full pl-9 pr-3 h-10 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-violet-300" />
              </div>
              <h3 className="text-base font-bold text-slate-700">Nenhum resultado encontrado</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                Tente buscar por outro termo ou crie um novo sorteio.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((raffle) => (
                <RaffleCard key={raffle.id} raffle={raffle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
