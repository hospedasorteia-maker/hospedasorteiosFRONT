"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search, Users, Ticket, DollarSign, Trophy, MoreHorizontal,
  Phone, Mail, Calendar, Download, TrendingUp, CheckCircle2,
  Clock, XCircle, ChevronDown, Eye, MessageCircle, Trash2,
  ArrowUpDown, Filter, RefreshCw, X, Copy,
} from "lucide-react";
import AppShell from "@/components/AppShell";

// ── Dados (mock, iguais ao protótipo) ────────────────────────
const MOCK_PARTICIPANTS = [
  { id: 1,  name: "João Silva",       phone: "(11) 99999-1234", email: "joao@email.com",     numbers: [7, 23, 45],              pricePerNumber: 15.00, raffle: "iPhone 15 Pro", total: 45.00, date: "05/06/2026", status: "confirmado", paymentMethod: "PIX" },
  { id: 2,  name: "Maria Souza",      phone: "(21) 98888-5678", email: "maria@email.com",    numbers: [12, 88],                 pricePerNumber: 15.00, raffle: "PS5 + 2 Jogos", total: 30.00, date: "06/06/2026", status: "confirmado", paymentMethod: "Cartão" },
  { id: 3,  name: "Carlos Lima",      phone: "(31) 97777-9012", email: "carlos@email.com",   numbers: [3],                      pricePerNumber: 15.00, raffle: "iPhone 15 Pro", total: 15.00, date: "07/06/2026", status: "pendente",   paymentMethod: "PIX" },
  { id: 4,  name: "Ana Costa",        phone: "(41) 96666-3456", email: "ana@email.com",      numbers: [55, 66, 77, 88],         pricePerNumber: 15.00, raffle: "PS5 + 2 Jogos", total: 60.00, date: "07/06/2026", status: "confirmado", paymentMethod: "PIX" },
  { id: 5,  name: "Pedro Alves",      phone: "(51) 95555-7890", email: "pedro@email.com",    numbers: [2, 19],                  pricePerNumber: 15.00, raffle: "iPhone 15 Pro", total: 30.00, date: "08/06/2026", status: "cancelado",  paymentMethod: "Boleto" },
  { id: 6,  name: "Fernanda Rocha",   phone: "(61) 94444-2345", email: "fernanda@email.com", numbers: [100],                    pricePerNumber: 15.00, raffle: "PS5 + 2 Jogos", total: 15.00, date: "08/06/2026", status: "pendente",   paymentMethod: "PIX" },
  { id: 7,  name: "Rafael Nunes",     phone: "(71) 93333-6789", email: "rafael@email.com",   numbers: [14, 27, 38, 50, 61],     pricePerNumber: 15.00, raffle: "iPhone 15 Pro", total: 75.00, date: "08/06/2026", status: "confirmado", paymentMethod: "Cartão" },
  { id: 8,  name: "Juliana Martins",  phone: "(81) 92222-0123", email: "juliana@email.com",  numbers: [5, 9],                   pricePerNumber: 15.00, raffle: "PS5 + 2 Jogos", total: 30.00, date: "09/06/2026", status: "confirmado", paymentMethod: "PIX" },
  { id: 9,  name: "Bruno Ferreira",   phone: "(91) 91111-4567", email: "bruno@email.com",    numbers: [72],                     pricePerNumber: 15.00, raffle: "iPhone 15 Pro", total: 15.00, date: "09/06/2026", status: "pendente",   paymentMethod: "PIX" },
  { id: 10, name: "Camila Dias",      phone: "(11) 90000-8901", email: "camila@email.com",   numbers: [33, 44],                 pricePerNumber: 15.00, raffle: "PS5 + 2 Jogos", total: 30.00, date: "09/06/2026", status: "cancelado",  paymentMethod: "Cartão" },
  { id: 11, name: "Lucas Oliveira",   phone: "(11) 98765-4321", email: "lucas@email.com",    numbers: [1, 8, 16, 24],           pricePerNumber: 20.00, raffle: "Moto 0km",      total: 80.00, date: "09/06/2026", status: "confirmado", paymentMethod: "PIX" },
  { id: 12, name: "Beatriz Santos",   phone: "(21) 97654-3210", email: "beatriz@email.com",  numbers: [10, 20, 30],             pricePerNumber: 20.00, raffle: "Moto 0km",      total: 60.00, date: "09/06/2026", status: "confirmado", paymentMethod: "PIX" },
  { id: 13, name: "Thiago Mendes",    phone: "(31) 96543-2109", email: "thiago@email.com",   numbers: [99],                     pricePerNumber: 20.00, raffle: "Moto 0km",      total: 20.00, date: "09/06/2026", status: "pendente",   paymentMethod: "Boleto" },
  { id: 14, name: "Larissa Carvalho", phone: "(41) 95432-1098", email: "larissa@email.com",  numbers: [4, 17, 29, 42, 58, 73],  pricePerNumber: 10.00, raffle: "iPhone 15 Pro", total: 60.00, date: "09/06/2026", status: "confirmado", paymentMethod: "Cartão" },
  { id: 15, name: "Diego Nascimento", phone: "(51) 94321-0987", email: "diego@email.com",    numbers: [6, 11],                  pricePerNumber: 10.00, raffle: "PS5 + 2 Jogos", total: 20.00, date: "09/06/2026", status: "confirmado", paymentMethod: "PIX" },
  { id: 16, name: "Vanessa Barbosa",  phone: "(61) 93210-9876", email: "vanessa@email.com",  numbers: [48],                     pricePerNumber: 20.00, raffle: "Moto 0km",      total: 20.00, date: "09/06/2026", status: "cancelado",  paymentMethod: "PIX" },
  { id: 17, name: "Rodrigo Castro",   phone: "(71) 92109-8765", email: "rodrigo@email.com",  numbers: [35, 52, 67],             pricePerNumber: 15.00, raffle: "iPhone 15 Pro", total: 45.00, date: "09/06/2026", status: "confirmado", paymentMethod: "Cartão" },
  { id: 18, name: "Patrícia Lima",    phone: "(81) 91098-7654", email: "patricia@email.com", numbers: [21, 36, 49, 64, 79],     pricePerNumber: 15.00, raffle: "PS5 + 2 Jogos", total: 75.00, date: "09/06/2026", status: "confirmado", paymentMethod: "PIX" },
  { id: 19, name: "Gustavo Ribeiro",  phone: "(91) 90987-6543", email: "gustavo@email.com",  numbers: [80, 85, 90, 95],         pricePerNumber: 20.00, raffle: "Moto 0km",      total: 80.00, date: "09/06/2026", status: "pendente",   paymentMethod: "PIX" },
  { id: 20, name: "Isabela Gomes",    phone: "(11) 89876-5432", email: "isabela@email.com",  numbers: [13, 26],                 pricePerNumber: 10.00, raffle: "iPhone 15 Pro", total: 20.00, date: "09/06/2026", status: "confirmado", paymentMethod: "Cartão" },
  { id: 21, name: "Marcelo Teixeira", phone: "(21) 88765-4321", email: "marcelo@email.com",  numbers: [40, 41, 42, 43, 44, 45], pricePerNumber: 10.00, raffle: "PS5 + 2 Jogos", total: 60.00, date: "09/06/2026", status: "confirmado", paymentMethod: "PIX" },
  { id: 22, name: "Aline Pereira",    phone: "(31) 87654-3210", email: "aline@email.com",    numbers: [60],                     pricePerNumber: 20.00, raffle: "Moto 0km",      total: 20.00, date: "09/06/2026", status: "pendente",   paymentMethod: "Boleto" },
  { id: 23, name: "Felipe Correia",   phone: "(41) 86543-2109", email: "felipe@email.com",   numbers: [15, 31, 47],             pricePerNumber: 15.00, raffle: "iPhone 15 Pro", total: 45.00, date: "09/06/2026", status: "confirmado", paymentMethod: "PIX" },
  { id: 24, name: "Tatiane Moreira",  phone: "(51) 85432-1098", email: "tatiane@email.com",  numbers: [18, 37],                 pricePerNumber: 15.00, raffle: "PS5 + 2 Jogos", total: 30.00, date: "09/06/2026", status: "cancelado",  paymentMethod: "Cartão" },
  { id: 25, name: "Eduardo Pinto",    phone: "(61) 84321-0987", email: "eduardo@email.com",  numbers: [25, 50, 75, 100],        pricePerNumber: 20.00, raffle: "Moto 0km",      total: 80.00, date: "09/06/2026", status: "confirmado", paymentMethod: "PIX" },
];

const statusConfig = {
  confirmado: { label: "Confirmado", class: "bg-green-100 text-green-700",  icon: CheckCircle2, iconClass: "text-green-500" },
  pendente:   { label: "Pendente",   class: "bg-yellow-100 text-yellow-700", icon: Clock,       iconClass: "text-yellow-500" },
  cancelado:  { label: "Cancelado",  class: "bg-red-100 text-red-700",     icon: XCircle,      iconClass: "text-red-500" },
};

const RAFFLES = ["Todos os sorteios", "iPhone 15 Pro", "PS5 + 2 Jogos", "Moto 0km"];
const PAYMENT_METHODS = ["Todos", "PIX", "Cartão", "Boleto"];

const pad3 = (n) => String(n).padStart(3, "0");

// ── Dropdown genérico ────────────────────────────────────────
function Dropdown({ trigger, children, align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={`absolute top-full mt-1 z-30 min-w-44 bg-white border border-border rounded-xl shadow-lg p-1 ${align === "right" ? "right-0" : "left-0"}`}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ children, onClick, active, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-muted transition-colors ${active ? "text-primary font-semibold" : ""} ${danger ? "text-destructive" : ""}`}
    >
      {children}
    </button>
  );
}

// ── Modal de detalhes ────────────────────────────────────────
function ParticipantDetailModal({ participant: p, onClose }) {
  const status = statusConfig[p.status];
  const StatusIcon = status.icon;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/70 p-6 text-primary-foreground">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
              {p.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading">{p.name}</h2>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${status.class}`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Contato */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Contato</p>
            <div className="space-y-2">
              {[
                { icon: Phone, value: p.phone },
                { icon: Mail, value: p.email },
              ].map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                  <button onClick={() => copyToClipboard(value)} className="p-1 rounded-lg hover:bg-muted transition-colors" title="Copiar">
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Compra */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Compra</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-muted/40 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">Sorteio</span>
                </div>
                <p className="text-sm font-semibold leading-tight">{p.raffle}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs text-muted-foreground">Total pago</span>
                </div>
                <p className="text-sm font-bold text-emerald-600">R$ {p.total.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">Data</span>
                </div>
                <p className="text-sm font-semibold">{p.date}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Pagamento</span>
                </div>
                <p className="text-sm font-semibold">{p.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Números */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Números ({p.numbers.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {p.numbers.map((n) => (
                <span key={n} className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-xl font-mono font-bold border border-primary/20">
                  {pad3(n)}
                </span>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-1">
            <button className="flex-1 inline-flex items-center justify-center gap-2 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <MessageCircle className="w-4 h-4" />
              Enviar mensagem
            </button>
            <button onClick={onClose} className="inline-flex items-center justify-center h-9 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Página ───────────────────────────────────────────────────
export default function Participantes() {
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterRaffle, setFilterRaffle] = useState("Todos os sorteios");
  const [filterPayment, setFilterPayment] = useState("Todos");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = participants.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || p.status === filterStatus;
    const matchRaffle = filterRaffle === "Todos os sorteios" || p.raffle === filterRaffle;
    const matchPayment = filterPayment === "Todos" || p.paymentMethod === filterPayment;
    return matchSearch && matchStatus && matchRaffle && matchPayment;
  }).sort((a, b) => {
    if (sortField === "total" || sortField === "pricePerNumber") {
      return sortDir === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    }
    if (sortField === "numbers") {
      return sortDir === "asc" ? a.numbers.length - b.numbers.length : b.numbers.length - a.numbers.length;
    }
    const valA = String(a[sortField]);
    const valB = String(b[sortField]);
    return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const confirmados = participants.filter((p) => p.status === "confirmado");
  const receita = confirmados.reduce((acc, p) => acc + p.total, 0);
  const stats = {
    total: participants.length,
    confirmados: confirmados.length,
    pendentes: participants.filter((p) => p.status === "pendente").length,
    receita,
    numeros: participants.reduce((acc, p) => acc + p.numbers.length, 0),
    ticketMedio: receita / (confirmados.length || 1),
  };

  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((p) => p.id));

  const removeParticipant = (id) => {
    if (!confirm("Remover participante? (visual apenas — os dados voltam ao recarregar)")) return;
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const removeSelected = () => {
    if (!confirm(`Remover ${selectedIds.length} participante(s)? (visual apenas)`)) return;
    setParticipants((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  const exportCsv = () => {
    const header = "Nome;Telefone;E-mail;Sorteio;Numeros;Pagamento;Valor por numero;Total;Data;Status";
    const rows = filtered.map((p) =>
      [p.name, p.phone, p.email, p.raffle, p.numbers.join(" "), p.paymentMethod,
       p.pricePerNumber.toFixed(2), p.total.toFixed(2), p.date, statusConfig[p.status].label].join(";")
    );
    const blob = new Blob(["\uFEFF" + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "participantes.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const hasFilters =
    filterStatus !== "todos" || filterRaffle !== "Todos os sorteios" || filterPayment !== "Todos" || search;

  const SortIcon = ({ field }) => (
    <ArrowUpDown className={`w-3.5 h-3.5 ml-1 inline ${sortField === field ? "opacity-100 text-primary" : "opacity-40"}`} />
  );

  const outlineBtn =
    "inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors";

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl font-bold font-heading">Participantes</h1>
            <p className="text-muted-foreground text-sm mt-1">Gerencie todos os compradores dos seus sorteios</p>
          </div>
          <div className="flex gap-2">
            <button className={outlineBtn}>
              <RefreshCw className="w-3.5 h-3.5" />
              Atualizar
            </button>
            <button className={outlineBtn} onClick={exportCsv}>
              <Download className="w-3.5 h-3.5" />
              Exportar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[
            { icon: Users,        accent: "bg-primary/10 text-primary",       label: "Total",        value: stats.total },
            { icon: CheckCircle2, accent: "bg-green-100 text-green-600",      label: "Confirmados",  value: stats.confirmados },
            { icon: Clock,        accent: "bg-yellow-100 text-yellow-600",    label: "Pendentes",    value: stats.pendentes },
            { icon: Ticket,       accent: "bg-blue-100 text-blue-600",        label: "Nºs Vendidos", value: stats.numeros },
            { icon: DollarSign,   accent: "bg-emerald-100 text-emerald-600",  label: "Receita",      value: `R$ ${stats.receita.toFixed(2)}`,      valueClass: "text-emerald-600 text-lg" },
            { icon: TrendingUp,   accent: "bg-purple-100 text-purple-600",    label: "Ticket Médio", value: `R$ ${stats.ticketMedio.toFixed(2)}`,  valueClass: "text-purple-600 text-lg" },
          ].map(({ icon: Icon, accent, label, value, valueClass }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`font-bold ${valueClass || "text-xl"}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 min-w-0 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, telefone ou e-mail..."
              className="w-full pl-11 pr-3 h-10 rounded-xl border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {/* Status */}
            <Dropdown
              trigger={
                <button className={outlineBtn}>
                  <Filter className="w-3.5 h-3.5" />
                  {filterStatus === "todos" ? "Status" : statusConfig[filterStatus]?.label}
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
              }
            >
              {["todos", "confirmado", "pendente", "cancelado"].map((s) => (
                <DropdownItem key={s} onClick={() => setFilterStatus(s)} active={filterStatus === s}>
                  {s === "todos" ? "Todos os status" : statusConfig[s]?.label}
                </DropdownItem>
              ))}
            </Dropdown>

            {/* Sorteio */}
            <Dropdown
              trigger={
                <button className={outlineBtn}>
                  <Trophy className="w-3.5 h-3.5" />
                  {filterRaffle === "Todos os sorteios" ? "Sorteio" : filterRaffle.slice(0, 12) + "..."}
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
              }
            >
              {RAFFLES.map((r) => (
                <DropdownItem key={r} onClick={() => setFilterRaffle(r)} active={filterRaffle === r}>
                  {r}
                </DropdownItem>
              ))}
            </Dropdown>

            {/* Pagamento */}
            <Dropdown
              trigger={
                <button className={outlineBtn}>
                  <DollarSign className="w-3.5 h-3.5" />
                  {filterPayment}
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
              }
            >
              {PAYMENT_METHODS.map((m) => (
                <DropdownItem key={m} onClick={() => setFilterPayment(m)} active={filterPayment === m}>
                  {m}
                </DropdownItem>
              ))}
            </Dropdown>

            {hasFilters && (
              <button
                className="h-10 px-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                onClick={() => { setFilterStatus("todos"); setFilterRaffle("Todos os sorteios"); setFilterPayment("Todos"); setSearch(""); }}
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Barra de seleção em massa */}
        {selectedIds.length > 0 && (
          <div className="mb-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
            <span className="text-sm font-semibold text-primary">{selectedIds.length} selecionado(s)</span>
            <div className="flex gap-2 ml-auto">
              <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted transition-colors">
                <MessageCircle className="w-3.5 h-3.5" /> Notificar
              </button>
              <button
                onClick={removeSelected}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-card text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remover
              </button>
            </div>
          </div>
        )}

        {/* Tabela */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-245">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      className="rounded accent-primary cursor-pointer"
                      checked={selectedIds.length === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  {[
                    { field: "name", label: "Participante" },
                    { field: "raffle", label: "Sorteio" },
                    { field: "numbers", label: "Números" },
                    { field: null, label: "Pagamento" },
                    { field: "pricePerNumber", label: "Valor/Nº" },
                    { field: "total", label: "Total" },
                    { field: "date", label: "Data" },
                    { field: null, label: "Status" },
                  ].map(({ field, label }) => (
                    <th
                      key={label}
                      onClick={field ? () => toggleSort(field) : undefined}
                      className={`text-left px-4 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap ${field ? "cursor-pointer select-none hover:text-foreground" : ""}`}
                    >
                      {label} {field && <SortIcon field={field} />}
                    </th>
                  ))}
                  <th className="px-4 py-3.5 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-20 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-semibold text-base">Nenhum participante encontrado</p>
                      <p className="text-sm mt-1 opacity-70">Tente ajustar os filtros de busca</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const status = statusConfig[p.status];
                    const StatusIcon = status.icon;
                    const isSelected = selectedIds.includes(p.id);
                    return (
                      <tr key={p.id} className={`hover:bg-muted/20 transition-colors ${isSelected ? "bg-primary/5" : ""}`}>
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            className="rounded accent-primary cursor-pointer"
                            checked={isSelected}
                            onChange={() => toggleSelect(p.id)}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                              {p.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold leading-tight">{p.name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3" />{p.phone}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />{p.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-muted-foreground">{p.raffle}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1 max-w-35">
                            {p.numbers.slice(0, 3).map((n) => (
                              <span key={n} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-lg font-mono font-semibold">
                                {pad3(n)}
                              </span>
                            ))}
                            {p.numbers.length > 3 && (
                              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-lg font-semibold">
                                +{p.numbers.length - 3}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{p.numbers.length} número(s)</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap ${
                            p.paymentMethod === "PIX" ? "bg-green-50 text-green-700" :
                            p.paymentMethod === "Cartão" ? "bg-blue-50 text-blue-700" :
                            "bg-orange-50 text-orange-700"
                          }`}>
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-muted text-muted-foreground font-mono whitespace-nowrap">
                            R$ {p.pricePerNumber.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-bold text-base whitespace-nowrap">
                          R$ {p.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          <span className="flex items-center gap-1 text-sm whitespace-nowrap">
                            <Calendar className="w-3 h-3" />{p.date}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${status.class}`}>
                            <StatusIcon className={`w-3 h-3 ${status.iconClass}`} />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Dropdown
                            trigger={
                              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            }
                          >
                            <DropdownItem onClick={() => setSelectedParticipant(p)}>
                              <Eye className="w-3.5 h-3.5" /> Ver detalhes
                            </DropdownItem>
                            <DropdownItem onClick={() => alert(`Funcionalidade visual: mensagem para ${p.name} (${p.phone})`)}>
                              <MessageCircle className="w-3.5 h-3.5" /> Enviar mensagem
                            </DropdownItem>
                            <div className="h-px bg-border my-1" />
                            <DropdownItem danger onClick={() => removeParticipant(p.id)}>
                              <Trash2 className="w-3.5 h-3.5" /> Remover
                            </DropdownItem>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Rodapé */}
          {filtered.length > 0 && (
            <div className="px-5 py-3.5 border-t border-border bg-muted/10 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Mostrando <span className="font-semibold text-foreground">{filtered.length}</span> de{" "}
                <span className="font-semibold text-foreground">{participants.length}</span> participantes
              </p>
              <p className="text-xs text-muted-foreground">
                Total filtrado:{" "}
                <span className="font-bold text-foreground">
                  R$ {filtered.reduce((acc, p) => acc + p.total, 0).toFixed(2)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedParticipant && (
          <ParticipantDetailModal
            participant={selectedParticipant}
            onClose={() => setSelectedParticipant(null)}
          />
        )}
      </div>
    </AppShell>
  );
}
