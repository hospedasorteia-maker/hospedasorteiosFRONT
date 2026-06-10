"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Ticket, Trophy, Users, Star, CheckCircle2,
  ArrowRight, Zap, Shield, BarChart3, Palette, QrCode,
  ChevronDown, Menu, X, Sparkles, MessageCircle, Mail, Phone, Send,
} from "lucide-react";

// ── Animation variants ──────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

// ── Counter animado ─────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString("pt-BR")}{suffix}</span>;
}

// ── Navbar ──────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <span className={`font-bold text-lg font-heading ${scrolled ? "text-foreground" : "text-white"}`}>RifaMaster</span>
        </div>

        {/* Desktop nav */}
        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${scrolled ? "text-muted-foreground" : "text-slate-300"}`}>
          <a href="#funcionalidades" className="hover:opacity-80 transition-opacity">Funcionalidades</a>
          <a href="#como-funciona" className="hover:opacity-80 transition-opacity">Como funciona</a>
          <a href="#planos" className="hover:opacity-80 transition-opacity">Planos</a>
          <a href="#depoimentos" className="hover:opacity-80 transition-opacity">Depoimentos</a>
          <a href="#suporte" className="hover:opacity-80 transition-opacity">Suporte</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className={`inline-flex items-center justify-center h-9 px-4 rounded-xl text-sm font-medium transition-colors ${scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}>
            Entrar
          </Link>
          <Link href="/cadastro" className="inline-flex items-center justify-center h-9 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-700 hover:opacity-90 shadow transition-opacity">
            Começar grátis
          </Link>
        </div>

        <button className={`md:hidden p-2 ${scrolled ? "text-foreground" : "text-white"}`} onClick={() => setOpen(!open)} aria-label="Abrir menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-5 py-4 flex flex-col gap-4">
          <a href="#funcionalidades" className="text-sm font-medium" onClick={() => setOpen(false)}>Funcionalidades</a>
          <a href="#como-funciona" className="text-sm font-medium" onClick={() => setOpen(false)}>Como funciona</a>
          <a href="#planos" className="text-sm font-medium" onClick={() => setOpen(false)}>Planos</a>
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1 inline-flex items-center justify-center h-10 rounded-xl border border-border text-sm font-medium">
              Entrar
            </Link>
            <Link href="/cadastro" className="flex-1 inline-flex items-center justify-center h-10 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-700">
              Criar conta
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ── Hero ────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 pt-16">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-800/20 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-400/10 blur-[80px]" />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 text-center">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Plataforma #1 de rifas online no Brasil
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading text-white leading-tight mb-6">
            Crie rifas que{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              vendem de verdade
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Plataforma completa para criar, divulgar e gerenciar suas rifas online.
            Sorteios transparentes, pagamentos seguros e painel intuitivo.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 shadow-lg shadow-violet-900/40 text-base font-semibold text-white px-8 h-13 transition-opacity">
              Criar minha primeira rifa
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#como-funciona" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 text-white hover:bg-white/10 text-base font-semibold px-8 h-13 transition-colors">
              Ver como funciona
              <ChevronDown className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeUp} className="mt-14 flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sem taxa de cadastro</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pagamento via PIX</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sorteio ao vivo</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Suporte 24h</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 text-slate-400" />
      </div>
    </section>
  );
}

// ── Stats ───────────────────────────────────────────────────
function Stats() {
  return (
    <section className="bg-gradient-to-r from-violet-600 to-fuchsia-600 py-16">
      <div className="max-w-5xl mx-auto px-5">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white"
        >
          {[
            { value: 12400, suffix: "+", label: "Rifas criadas" },
            { value: 350000, suffix: "+", label: "Participantes" },
            { value: 4200000, suffix: " R$", label: "Arrecadados" },
            { value: 98, suffix: "%", label: "Satisfação" },
          ].map((s) => (
            <motion.div key={s.label} variants={fadeUp}>
              <p className="text-3xl sm:text-4xl font-extrabold font-heading">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-white/80 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Features ────────────────────────────────────────────────
const FEATURES = [
  { icon: Palette,   color: "from-violet-500 to-purple-600",  title: "Personalização total",     desc: "Cores, imagens, temas e layout do seu jeito. Sua rifa com a sua cara." },
  { icon: QrCode,    color: "from-violet-600 to-fuchsia-600", title: "PIX integrado",            desc: "Pagamentos instantâneos via PIX, cartão ou boleto. Aprovação em segundos." },
  { icon: BarChart3, color: "from-purple-500 to-violet-600",  title: "Relatórios em tempo real", desc: "Acompanhe vendas, receita e participantes com gráficos detalhados." },
  { icon: Shield,    color: "from-fuchsia-500 to-purple-600", title: "Sorteio transparente",     desc: "Sorteio ao vivo com certificado de autenticidade para todos os participantes." },
  { icon: Zap,       color: "from-violet-400 to-purple-500",  title: "Divulgação fácil",         desc: "Link único para compartilhar. Funciona no WhatsApp, Instagram e mais." },
  { icon: Users,     color: "from-purple-600 to-fuchsia-600", title: "Gestão de participantes",  desc: "Controle quem comprou, quem pagou e gerencie contatos com facilidade." },
];

function Features() {
  return (
    <section id="funcionalidades" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Funcionalidades</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading mt-2 mb-4">
              Tudo que você precisa para<br className="hidden sm:block" /> vender mais
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Uma plataforma completa do início ao fim, sem complicação.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} variants={fadeUp}
                  className="group bg-card border border-border rounded-3xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-2 font-heading">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── How it works ────────────────────────────────────────────
const STEPS = [
  { num: "01", title: "Crie sua rifa",     desc: "Preencha as informações do prêmio, quantidade de números e preço. Leva menos de 5 minutos." },
  { num: "02", title: "Compartilhe",       desc: "Envie o link pelo WhatsApp, Instagram ou qualquer rede social. Seus seguidores compram pelo celular." },
  { num: "03", title: "Receba na hora",    desc: "Os pagamentos via PIX caem direto na sua conta. Acompanhe tudo em tempo real no painel." },
  { num: "04", title: "Realize o sorteio", desc: "Na data combinada, faça o sorteio ao vivo pela plataforma. Resultado transparente e certificado." },
];

function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-muted/40">
      <div className="max-w-5xl mx-auto px-5">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Como funciona</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading mt-2">Do zero ao sorteio em 4 passos</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.num} variants={fadeUp} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-xl font-extrabold font-heading flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-200">
                  {s.num}
                </div>
                <h3 className="font-bold text-base mb-2 font-heading">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Planos ──────────────────────────────────────────────────
const PLANS = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "/mês",
    desc: "Para quem está começando",
    features: ["1 rifa ativa por vez", "Até 100 números", "PIX integrado", "Suporte por e-mail"],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$ 49",
    period: "/mês",
    desc: "Para quem quer vender mais",
    features: ["Rifas ilimitadas", "Até 10.000 números", "Cartão + Boleto + PIX", "Relatórios avançados", "Domínio personalizado", "Suporte prioritário"],
    cta: "Assinar Pro",
    highlight: true,
    badge: "Mais popular",
  },
  {
    name: "Business",
    price: "R$ 149",
    period: "/mês",
    desc: "Para grandes operações",
    features: ["Tudo do Pro", "Múltiplos organizadores", "API completa", "White-label", "Gerente dedicado"],
    cta: "Falar com vendas",
    highlight: false,
  },
];

function Plans() {
  return (
    <section id="planos" className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-5">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Planos</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading mt-2 mb-4">Preços simples e transparentes</h2>
            <p className="text-muted-foreground text-lg">Sem taxas escondidas. Cancele quando quiser.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 items-center">
            {PLANS.map((p) => (
              <motion.div key={p.name} variants={fadeUp}
                className={`rounded-3xl p-7 border transition-all duration-300 ${p.highlight ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 border-transparent text-white shadow-2xl shadow-violet-300/30 sm:scale-105" : "bg-card border-border hover:shadow-lg"}`}>
                {p.badge && (
                  <span className="inline-block bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                    {p.badge}
                  </span>
                )}
                <p className={`text-sm font-semibold mb-1 ${p.highlight ? "text-white/80" : "text-muted-foreground"}`}>{p.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-extrabold font-heading">{p.price}</span>
                  <span className={`text-sm pb-1 ${p.highlight ? "text-white/70" : "text-muted-foreground"}`}>{p.period}</span>
                </div>
                <p className={`text-xs mb-6 ${p.highlight ? "text-white/70" : "text-muted-foreground"}`}>{p.desc}</p>
                <ul className="space-y-2.5 mb-7">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${p.highlight ? "text-white" : "text-emerald-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/cadastro" className={`inline-flex items-center justify-center w-full h-10 rounded-xl text-sm font-semibold transition-colors ${p.highlight ? "bg-white text-violet-700 hover:bg-white/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Testimonials ────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Mariana Costa",  role: "Empreendedora",       avatar: "MC", stars: 5, text: "Criei minha primeira rifa em 10 minutos e arrecadei R$ 3.000 no primeiro dia. Plataforma incrível!" },
  { name: "Rafael Souza",   role: "Influencer digital",  avatar: "RS", stars: 5, text: "Já testei várias plataformas e essa é de longe a melhor. PIX instantâneo e relatórios detalhados." },
  { name: "Juliana Alves",  role: "Loja de roupas",      avatar: "JA", stars: 5, text: "Minha rifa de moto vendeu 100% em menos de 48h! O link funciona perfeitamente no WhatsApp." },
  { name: "Carlos Menezes", role: "Corretor de imóveis", avatar: "CM", stars: 5, text: "O sorteio ao vivo deu muita credibilidade. Todos os participantes ficaram satisfeitos." },
  { name: "Fernanda Lima",  role: "Microempreendedora",  avatar: "FL", stars: 5, text: "Suporte excelente, responde na hora. Nunca tive nenhum problema com pagamentos." },
  { name: "Diego Martins",  role: "Youtuber",            avatar: "DM", stars: 5, text: "Interface linda e super intuitiva. Minha comunidade amou participar pela plataforma." },
];

function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 bg-muted/40">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Depoimentos</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading mt-2 mb-4">Quem usa, aprova</h2>
            <div className="flex items-center justify-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <span className="ml-2 text-muted-foreground text-sm">4.9 de 5 — mais de 2.000 avaliações</span>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <motion.div key={t.name} variants={fadeUp}
                className="bg-card border border-border rounded-3xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Suporte ─────────────────────────────────────────────────
function Support() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="suporte" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Suporte</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading mt-2 mb-4">Estamos aqui para ajudar</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Tem alguma dúvida? Fale com a nossa equipe. Respondemos em até 2 horas.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Info lateral */}
            <motion.div variants={fadeUp} className="lg:col-span-2 space-y-5">
              {[
                { icon: MessageCircle, color: "bg-violet-100 text-violet-700",   title: "Chat ao vivo", desc: "Disponível de seg a sex, das 8h às 20h. Respostas em minutos." },
                { icon: Mail,          color: "bg-purple-100 text-purple-700",   title: "E-mail",       desc: "suporte@rifamaster.com.br — respondemos em até 2 horas." },
                { icon: Phone,         color: "bg-fuchsia-100 text-fuchsia-700", title: "WhatsApp",     desc: "(11) 99999-0000 — Mande uma mensagem a qualquer hora." },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.title} className="flex items-start gap-4 bg-card border border-border rounded-2xl p-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{c.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Formulário */}
            <motion.div variants={fadeUp} className="lg:col-span-3 bg-card border border-border rounded-3xl p-8">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-2">Mensagem enviada!</h3>
                  <p className="text-muted-foreground text-sm">Nossa equipe responderá em breve no e-mail informado.</p>
                  <button onClick={() => setSent(false)} className="mt-5 text-primary text-sm font-medium hover:underline">
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold font-heading mb-6">Envie sua mensagem</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Nome</label>
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Seu nome"
                          className="w-full h-10 px-3 rounded-xl border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">E-mail</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="seu@email.com"
                          className="w-full h-10 px-3 rounded-xl border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Assunto</label>
                      <input
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Como podemos ajudar?"
                        className="w-full h-10 px-3 rounded-xl border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Mensagem</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Descreva sua dúvida ou problema..."
                        className="w-full px-3 py-2 rounded-xl border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground resize-none"
                      />
                    </div>
                    <button type="submit" className="inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition-opacity">
                      <Send className="w-4 h-4" />
                      Enviar mensagem
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── CTA Final ───────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <Trophy className="w-14 h-14 mx-auto mb-6 text-violet-400" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold font-heading text-white mb-5">
            Pronto para criar sua<br />primeira rifa?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-300 text-lg mb-10">
            Junte-se a milhares de organizadores que já arrecadaram mais de R$ 4 milhões na plataforma.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 shadow-xl shadow-violet-900/50 text-base font-semibold text-white px-10 h-13 transition-opacity">
              Criar conta grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-white/20 text-white hover:bg-white/10 text-base font-semibold px-10 h-13 transition-colors">
              Já tenho conta
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ──────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white font-heading">RifaMaster</span>
          </div>
          <p className="text-sm text-center">© 2026 RifaMaster. Todos os direitos reservados.</p>
          <div className="flex gap-5 text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#suporte" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Page ────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Plans />
      <Testimonials />
      <Support />
      <CTA />
      <Footer />
    </div>
  );
}
