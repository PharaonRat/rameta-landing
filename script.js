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

/* ===== МОДАЛЬНОЕ ОКНО: ЗАЯВКА С ТАРИФА ===== */
(function(){
  const BOT_TOKEN = '8668923201:AAG-cx4FyKhFYwX0IVjpv47Ajjj2z2m2Hlc';
  const CHAT_ID   = '-1003905330173';
  const TG_API    = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const overlay   = document.getElementById('leadModal');
  const closeBtn  = document.getElementById('modalClose');
  const form      = document.getElementById('leadForm');
  const nameInput = document.getElementById('leadName');
  const phoneInput= document.getElementById('leadPhone');
  const submitBtn = document.getElementById('modalSubmit');
  const tariffEl  = document.getElementById('modalTariff');
  const successEl = document.getElementById('modalSuccess');

  let currentTariff = '';

  // Открыть модальное окно
  function openModal(tariff) {
    currentTariff = tariff;
    tariffEl.textContent = tariff;
    form.hidden = false;
    successEl.hidden = true;
    nameInput.value = '';
    phoneInput.value = '';
    nameInput.classList.remove('error');
    phoneInput.classList.remove('error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить заявку';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => nameInput.focus(), 300);
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Клик по кнопке тарифа
  document.querySelectorAll('.pricing-cta-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.tariff));
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Маска телефона
  phoneInput.addEventListener('input', () => {
    let v = phoneInput.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (!v.startsWith('7') && v.length > 0) v = '7' + v;
    v = v.slice(0, 11);
    let out = '';
    if (v.length > 0) out = '+' + v[0];
    if (v.length > 1) out += ' (' + v.slice(1, 4);
    if (v.length >= 4) out += ') ' + v.slice(4, 7);
    if (v.length >= 7) out += '-' + v.slice(7, 9);
    if (v.length >= 9) out += '-' + v.slice(9, 11);
    phoneInput.value = out;
  });

  // Отправка
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name  = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    let valid = true;

    if (!name) { nameInput.classList.add('error'); valid = false; } else nameInput.classList.remove('error');
    if (phone.replace(/\D/g,'').length < 11) { phoneInput.classList.add('error'); valid = false; } else phoneInput.classList.remove('error');
    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';

    const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', hour12: false });
    const text =
      `📩 <b>НОВАЯ ЗАЯВКА С САЙТА</b>\n\n` +
      `👤 Имя: <b>${name}</b>\n` +
      `📱 Телефон: <b>${phone}</b>\n` +
      `📦 Тариф: <b>${currentTariff}</b>\n` +
      `🕐 Время: ${now} (МСК)`;

    try {
      const res = await fetch(TG_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
      });
      const data = await res.json();
      if (data.ok) {
        form.hidden = true;
        successEl.hidden = false;
        setTimeout(closeModal, 4000);
      } else {
        throw new Error(data.description);
      }
    } catch(err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Ошибка, попробуйте снова';
      console.error('Telegram send error:', err);
    }
  });
})();

/* ===== ПАРАЛЛАКС HERO (лёгкий) ===== */
const heroBg = document.querySelector('.hero__bg img');
if (heroBg && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
}
