"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SUPPORT_FAQS,
  buildSupportChannels,
  formatTicketDate,
  getSubjectLabel,
  getTicketsFromStorage,
  saveTicket,
} from "@/lib/support";
import { getSettings, updateSettingsSection } from "@/lib/settings";

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`dash-support__faq${open ? " is-open" : ""}`}>
      <button type="button" className="dash-support__faq-trigger" onClick={() => setOpen(!open)}>
        <span className="dash-support__faq-q">{item.q}</span>
        <span className="dash-support__faq-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points={open ? "6 15 12 9 18 15" : "6 9 12 15 18 9"} />
          </svg>
        </span>
      </button>
      {open && (
        <div className="dash-support__faq-body">
          <p>{item.a}</p>
        </div>
      )}
    </div>
  );
}

const STATUS_LABELS = {
  aberto: { label: "Aberto", className: "dash-support__status--open" },
  respondido: { label: "Respondido", className: "dash-support__status--answered" },
  fechado: { label: "Fechado", className: "dash-support__status--closed" },
};

const CHANNEL_ICONS = {
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
  ),
};

export default function SupportContent() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactForm, setContactForm] = useState({ whatsapp: "", email: "" });
  const [channels, setChannels] = useState([]);
  const [contactSaved, setContactSaved] = useState(false);
  const [sent, setSent] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [lastTicket, setLastTicket] = useState(null);
  const [faqSearch, setFaqSearch] = useState("");

  function loadContacts() {
    const settings = getSettings();
    const contacts = {
      whatsapp: settings.support?.whatsapp || settings.profile?.telefone || "",
      email: settings.support?.email || settings.profile?.email || "",
    };
    setContactForm(contacts);
    setChannels(buildSupportChannels({
      ...contacts,
      whatsappMessage: settings.support?.whatsappMessage,
    }));
  }

  useEffect(() => {
    const profile = getSettings().profile;
    setForm((prev) => ({
      ...prev,
      name: prev.name || profile.nome || "",
      email: prev.email || profile.email || "",
    }));
    setTickets(getTicketsFromStorage());
    loadContacts();
  }, []);

  function handleSaveContacts(e) {
    e.preventDefault();
    updateSettingsSection("support", {
      whatsapp: contactForm.whatsapp.trim(),
      email: contactForm.email.trim(),
    });
    loadContacts();
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 2500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const ticket = saveTicket(form);
    setLastTicket(ticket);
    setTickets(getTicketsFromStorage());
    setSent(true);
  }

  function resetForm() {
    setSent(false);
    setForm({ name: getSettings().profile.nome || "", email: getSettings().profile.email || "", subject: "", message: "" });
  }

  const filteredFaqs = SUPPORT_FAQS.filter((item) => {
    const term = faqSearch.trim().toLowerCase();
    if (!term) return true;
    return item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term);
  });

  return (
    <div className="dash-support">
      <div className="dash-support__hero">
        <div className="dash-support__hero-main">
          <div className="dash-support__hero-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" /></svg>
          </div>
          <div>
            <span className="dash-support__eyebrow">Atendimento</span>
            <h1>Suporte</h1>
            <p>Configure seus canais de atendimento para que seus participantes possam falar com você.</p>
          </div>
        </div>
        <div className="dash-support__hero-actions">
          <div className="dash-support__stats">
            <div>
              <strong>2h</strong>
              <span>Tempo médio de resposta</span>
            </div>
            <div>
              <strong>98%</strong>
              <span>Satisfação dos clientes</span>
            </div>
          </div>
          <Link href="/dashboard/ajuda" className="btn btn--outline btn--sm dash-support__help-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            Central de Ajuda
          </Link>
        </div>
      </div>

      <section className="dash-support__config">
        <div className="dash-support__config-head">
          <div>
            <h2>Contatos para seus participantes</h2>
            <p>Defina o WhatsApp e o e-mail que aparecerão na página pública dos seus sorteios.</p>
          </div>
          {contactSaved && <span className="dash-support__config-saved">Contatos salvos!</span>}
        </div>
        <form className="dash-support__config-form" onSubmit={handleSaveContacts}>
          <div className="dash-support__config-field">
            <label htmlFor="support-contact-whatsapp">WhatsApp</label>
            <input
              id="support-contact-whatsapp"
              type="tel"
              value={contactForm.whatsapp}
              onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </div>
          <div className="dash-support__config-field">
            <label htmlFor="support-contact-email">E-mail</label>
            <input
              id="support-contact-email"
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              placeholder="seu@email.com"
            />
          </div>
          <button type="submit" className="btn btn--violet btn--sm">
            Salvar contatos
          </button>
        </form>
      </section>

      {channels.length > 0 ? (
      <div className="dash-support__channels">
        {channels.map((channel) => (
          <a
            key={channel.id}
            href={channel.href}
            target={channel.href.startsWith("http") ? "_blank" : undefined}
            rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`dash-support__channel dash-support__channel--${channel.color}`}
          >
            <div className="dash-support__channel-top">
              <span className="dash-support__channel-icon">{CHANNEL_ICONS[channel.id]}</span>
              <span className="dash-support__channel-badge">{channel.badge}</span>
            </div>
            <strong>{channel.title}</strong>
            <p>{channel.desc}</p>
            <span className="dash-support__channel-action">
              Abrir
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </span>
          </a>
        ))}
      </div>
      ) : (
        <div className="dash-support__channels-empty">
          <p>Preencha pelo menos um contato acima para seus participantes poderem falar com você.</p>
        </div>
      )}

      <div className="dash-support__grid">
        <section className="dash-support__panel dash-support__panel--form">
          <div className="dash-support__panel-head">
            <span className="dash-support__panel-icon dash-support__panel-icon--violet">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
            </span>
            <div>
              <h2>Enviar mensagem</h2>
              <p>Preencha o formulário e nossa equipe entrará em contato</p>
            </div>
          </div>

          {sent ? (
            <div className="dash-support__success">
              <div className="dash-support__success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3>Mensagem enviada!</h3>
              <p>Nossa equipe responderá em breve no e-mail informado.</p>
              {lastTicket && (
                <div className="dash-support__ticket-ref">
                  <span>Protocolo</span>
                  <strong>#{lastTicket.id.slice(-6)}</strong>
                  <small>{formatTicketDate(lastTicket.createdAt)}</small>
                </div>
              )}
              <button type="button" className="btn btn--outline btn--sm" onClick={resetForm}>
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form className="dash-support__form" onSubmit={handleSubmit}>
              <div className="dash-support__form-row">
                <div className="dash-support__field">
                  <label htmlFor="support-name">Nome</label>
                  <input id="support-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Seu nome" required />
                </div>
                <div className="dash-support__field">
                  <label htmlFor="support-email">E-mail</label>
                  <input id="support-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" required />
                </div>
              </div>
              <div className="dash-support__field">
                <label htmlFor="support-subject">Assunto</label>
                <select id="support-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                  <option value="">Selecione um assunto</option>
                  <option value="pagamento">Problema com pagamento</option>
                  <option value="sorteio">Dúvida sobre sorteio</option>
                  <option value="tecnico">Problema técnico</option>
                  <option value="conta">Minha conta</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className="dash-support__field">
                <label htmlFor="support-message">Mensagem</label>
                <textarea id="support-message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Descreva sua dúvida ou problema com o máximo de detalhes..." required />
              </div>
              <p className="dash-support__sla">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Tempo médio de resposta: 2 horas
              </p>
              <button type="submit" className="btn btn--violet btn--full">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                Enviar mensagem
              </button>
            </form>
          )}
        </section>

        <section className="dash-support__panel dash-support__panel--faq">
          <div className="dash-support__panel-head">
            <span className="dash-support__panel-icon dash-support__panel-icon--emerald">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
            </span>
            <div>
              <h2>Perguntas frequentes</h2>
              <p>Respostas rápidas para as dúvidas mais comuns</p>
            </div>
          </div>

          <div className="dash-support__faq-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Buscar nas perguntas..."
            />
          </div>

          <div className="dash-support__faqs">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item) => (
                <FaqItem key={item.q} item={item} />
              ))
            ) : (
              <p className="dash-support__faq-empty">Nenhuma pergunta encontrada para &quot;{faqSearch}&quot;</p>
            )}
          </div>
        </section>
      </div>

      {tickets.length > 0 && (
        <section className="dash-support__history">
          <div className="dash-support__history-head">
            <div>
              <h2>Seus chamados recentes</h2>
              <p>Acompanhe o status das suas solicitações</p>
            </div>
            <span className="dash-support__history-count">{tickets.length} chamado(s)</span>
          </div>
          <div className="dash-support__history-list">
            {tickets.slice(0, 5).map((ticket) => {
              const status = STATUS_LABELS[ticket.status] || STATUS_LABELS.aberto;
              return (
                <div key={ticket.id} className="dash-support__history-item">
                  <div className="dash-support__history-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <div className="dash-support__history-content">
                    <strong>#{ticket.id.slice(-6)} · {getSubjectLabel(ticket.subject)}</strong>
                    <p>{ticket.message.slice(0, 100)}{ticket.message.length > 100 ? "…" : ""}</p>
                  </div>
                  <div className="dash-support__history-meta">
                    <span className={`dash-support__status ${status.className}`}>{status.label}</span>
                    <small>{formatTicketDate(ticket.createdAt)}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
