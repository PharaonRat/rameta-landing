/* ===== КОНСТАНТЫ ===== */
const TELEGRAM_URL  = 'https://t.me/StrawberryRa_bot';
const CHANNEL_URL   = 'https://t.me/+ZiU4ZCSGEgk0NzU6';  // канал — в подвале и эксперте
const INSTAGRAM_URL = 'https://instagram.com/rameta7777';

/* ===== ССЫЛКИ ВШИТЫ В HTML (href прямо на кнопках) ===== */
/* JS-подстановка убрана — Edge блокировал динамически заданные href */

/* ===== АНАЛИТИКА: клики по кнопкам ===== */
document.querySelectorAll('.cta-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const label = btn.dataset.label || 'unknown';
    // Google Tag Manager
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({ event: 'telegram_click', button_label: label });
    }
    // Яндекс.Метрика — раскомментировать когда добавите ID:
    // if (typeof ym !== 'undefined') ym(ВАШЕ_ID, 'reachGoal', 'telegram_click', { button_label: label });
  });
});

/* ===== АНИМАЦИЯ ПОЯВЛЕНИЯ (IntersectionObserver) ===== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ===== АККОРДЕОН FAQ ===== */
document.querySelectorAll('.accordion__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    // Закрыть все
    document.querySelectorAll('.accordion__btn').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    // Открыть текущий
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});

/* ===== ПЛАВАЮЩАЯ КНОПКА (FAB) — появляется после скролла ===== */
const fab = document.querySelector('.fab');
const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;

const toggleFab = () => {
  fab.classList.toggle('fab--visible', window.scrollY > heroHeight * 0.6);
};
window.addEventListener('scroll', toggleFab, { passive: true });
toggleFab();

/* ===== ПАРАЛЛАКС HERO (лёгкий) ===== */
const heroBg = document.querySelector('.hero__bg img');
if (heroBg && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
}
