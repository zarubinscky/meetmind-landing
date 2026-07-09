import { applyLanguage, initLanguageSwitcher } from './i18n.js';
import { bindTrackedLinks, initScrollTracking, trackEvent } from './analytics.js';
import { captureUtm } from './utm.js';
import { getVisitorId } from './visitor.js';

const TELEGRAM_BOT_URL = 'https://t.me/meetmind_app_bot';

function initTelegramLinks() {
  const visitorId = getVisitorId();
  const url = `${TELEGRAM_BOT_URL}?start=${encodeURIComponent(visitorId)}`;
  document.querySelectorAll('[data-telegram-link]').forEach((link) => {
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.addEventListener('click', () => trackEvent('telegram_open', { url }));
  });
}

function initIcons() {
  const icons = {
    summary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z"/><path d="M8 9h8M8 13h6M8 17h4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"/></svg>',
    tasks: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m4 6 1 1 2-2M4 12h3M4 18h3"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5M12 18h.01"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>'
  };
  document.querySelectorAll('[data-icon]').forEach((el) => {
    const key = el.dataset.icon;
    if (icons[key]) el.innerHTML = icons[key];
  });
}

function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

async function init() {
  window.MEETMIND_ANALYTICS_DEBUG = true;
  captureUtm();
  getVisitorId();
  initIcons();
  await applyLanguage();
  initLanguageSwitcher();
  initTelegramLinks();
  bindTrackedLinks();
  initScrollTracking();
  initRevealAnimations();
  trackEvent('page_view');
}

init().catch((error) => console.error('MeetMind init failed', error));
