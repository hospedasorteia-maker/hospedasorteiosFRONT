// ============================================================
// RifaMaster — Landing Page
// ============================================================

// ---------- Navbar: fundo ao rolar ----------
const navbar = document.getElementById("navbar");

function updateNavbar() {
  navbar.classList.toggle("is-scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", updateNavbar);
updateNavbar();

// ---------- Menu mobile ----------
const navToggle = document.getElementById("navToggle");

navToggle.addEventListener("click", () => {
  const isOpen = navbar.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".navbar__mobile a").forEach((link) => {
  link.addEventListener("click", () => {
    navbar.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ---------- Animação reveal ao rolar ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Contadores animados (seção stats) ----------
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const step = Math.ceil(target / 60);
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

// ---------- Formulário de suporte ----------
const supportForm = document.getElementById("supportForm");
const formSuccess = document.getElementById("formSuccess");
const formAgain = document.getElementById("formAgain");

supportForm.addEventListener("submit", (e) => {
  e.preventDefault();
  supportForm.hidden = true;
  formSuccess.hidden = false;
});

formAgain.addEventListener("click", () => {
  supportForm.reset();
  supportForm.hidden = false;
  formSuccess.hidden = true;
});
