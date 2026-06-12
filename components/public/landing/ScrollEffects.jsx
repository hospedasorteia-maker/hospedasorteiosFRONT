"use client";

import { useEffect } from "react";

/**
 * Efeitos visuais globais: reveal, contadores, spotlight e stagger.
 */
export default function ScrollEffects() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      revealObserver.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        el.classList.add("is-visible");
      }
    });

    document.querySelectorAll(".reveal-stagger").forEach((group) => {
      group.querySelectorAll(".reveal").forEach((el, index) => {
        el.style.setProperty("--reveal-delay", `${Math.min(index * 0.08, 0.48)}s`);
      });
    });

    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10);
      const step = Math.max(1, Math.ceil(target / 60));
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current.toLocaleString("pt-BR");
      }, 25);
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll(".counter").forEach((el) => counterObserver.observe(el));

    const hero = document.querySelector(".hero");
    let spotlight = null;
    let onMove = null;

    if (hero && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      spotlight = document.createElement("div");
      spotlight.className = "fx-spotlight";
      hero.appendChild(spotlight);

      onMove = (event) => {
        const rect = hero.getBoundingClientRect();
        spotlight.style.setProperty("--fx-x", `${event.clientX - rect.left}px`);
        spotlight.style.setProperty("--fx-y", `${event.clientY - rect.top}px`);
      };

      hero.addEventListener("mousemove", onMove);
    }

    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
      if (hero && onMove) hero.removeEventListener("mousemove", onMove);
      spotlight?.remove();
    };
  }, []);

  return null;
}
