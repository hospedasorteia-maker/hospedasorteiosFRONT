"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HELP_CATEGORIES, POPULAR_ARTICLES } from "@/lib/services/support";

const CATEGORY_ICONS = {
  sorteios: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
  ),
  pagamentos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
  ),
  participantes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  conta: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
};

const TOTAL_ARTICLES = HELP_CATEGORIES.reduce((sum, cat) => sum + cat.articles.length, 0);

function CategoryCard({ cat, selected, onSelect }) {
  const isOpen = selected === cat.id;

  return (
    <div className={`dash-help__category${isOpen ? " is-open" : ""}`}>
      <button type="button" className="dash-help__category-head" onClick={() => onSelect(isOpen ? null : cat.id)}>
        <span className={`dash-help__category-icon dash-help__category-icon--${cat.color}`}>
          {CATEGORY_ICONS[cat.id] || cat.title.charAt(0)}
        </span>
        <div className="dash-help__category-info">
          <strong>{cat.title}</strong>
          <p>{cat.desc}</p>
        </div>
        <span className="dash-help__category-count">{cat.articles.length} artigos</span>
        <span className="dash-help__category-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points={isOpen ? "6 15 12 9 18 15" : "9 18 15 12 9 6"} />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="dash-help__articles">
          {cat.articles.map((article) => (
            <Link key={article.title} href={article.href} className="dash-help__article">
              <span className="dash-help__article-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><polyline points="14 2 14 8 20 8" /></svg>
              </span>
              <span className="dash-help__article-text">{article.title}</span>
              <small>{article.time} de leitura</small>
              <svg className="dash-help__article-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HelpContent() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return HELP_CATEGORIES.map((cat) => ({
      ...cat,
      articles: cat.articles.filter((a) => a.title.toLowerCase().includes(term)),
    })).filter((cat) => !term || cat.articles.length > 0);
  }, [search]);

  const resultCount = filtered.reduce((sum, cat) => sum + cat.articles.length, 0);

  return (
    <div className="dash-help">
      <div className="dash-help__hero">
        <div className="dash-help__hero-main">
          <div className="dash-help__hero-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <div>
            <span className="dash-help__eyebrow">Base de conhecimento</span>
            <h1>Central de Ajuda</h1>
            <p>Encontre respostas rápidas sobre sorteios, pagamentos, participantes e configurações da sua conta.</p>
          </div>
        </div>
        <div className="dash-help__hero-actions">
          <div className="dash-help__stats">
            <div>
              <strong>{HELP_CATEGORIES.length}</strong>
              <span>Categorias</span>
            </div>
            <div>
              <strong>{TOTAL_ARTICLES}</strong>
              <span>Artigos</span>
            </div>
          </div>
          <Link href="/dashboard/suporte" className="btn btn--outline btn--sm dash-help__support-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" /></svg>
            Falar com suporte
          </Link>
        </div>
      </div>

      <div className="dash-help__search-wrap">
        <div className="dash-help__search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar artigos, tutoriais e guias..."
          />
          {search && (
            <button type="button" className="dash-help__search-clear" onClick={() => setSearch("")} aria-label="Limpar busca">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>
        {search && (
          <p className="dash-help__search-results">{resultCount} resultado(s) encontrado(s)</p>
        )}
      </div>

      {!search && (
        <div className="dash-help__popular">
          <p>Mais buscados</p>
          <div className="dash-help__tags">
            {POPULAR_ARTICLES.map((item) => (
              <button key={item} type="button" onClick={() => setSearch(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="dash-help__categories">
        {filtered.length === 0 ? (
          <div className="dash-help__empty">
            <div className="dash-help__empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /></svg>
            </div>
            <h3>Nenhum artigo encontrado</h3>
            <p>
              Tente outro termo ou{" "}
              <Link href="/dashboard/suporte">fale com o suporte</Link>.
            </p>
          </div>
        ) : (
          filtered.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} selected={selectedCat} onSelect={setSelectedCat} />
          ))
        )}
      </div>

      {!search && (
        <div className="dash-help__cta">
          <span className="dash-help__cta-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" /></svg>
          </span>
          <div>
            <strong>Não encontrou o que precisava?</strong>
            <p>Nossa equipe de suporte está pronta para te ajudar com qualquer dúvida.</p>
          </div>
          <Link href="/dashboard/suporte" className="btn btn--violet btn--sm">Abrir chamado</Link>
        </div>
      )}
    </div>
  );
}
