import { trackEvent } from './analytics.js';

const LANG_KEY = 'meetmind_language';
const DEFAULT_LANG = 'en';
const SUPPORTED = ['en', 'ru', 'es', 'pt'];

const labels = {
  en: '🇬🇧 English',
  ru: '🇷🇺 Русский',
  es: '🇪🇸 Español',
  pt: '🇵🇹 Português'
};

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

function detectLanguage() {
  const saved = localStorage.getItem(LANG_KEY);
  if (SUPPORTED.includes(saved)) return saved;
  const browserLang = navigator.language?.slice(0, 2).toLowerCase();
  return SUPPORTED.includes(browserLang) ? browserLang : DEFAULT_LANG;
}

export async function loadLocale(lang) {
  const safeLang = SUPPORTED.includes(lang) ? lang : DEFAULT_LANG;
  const response = await fetch(`locales/${safeLang}.json`, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Cannot load locale: ${safeLang}`);
  return response.json();
}

export async function applyLanguage(lang = detectLanguage()) {
  const safeLang = SUPPORTED.includes(lang) ? lang : DEFAULT_LANG;
  const dict = await loadLocale(safeLang);
  document.documentElement.lang = safeLang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = getByPath(dict, el.dataset.i18n);
    if (typeof value === 'string') el.textContent = value;
  });
  const current = document.querySelector('[data-language-current]');
  if (current) current.textContent = labels[safeLang];
  localStorage.setItem(LANG_KEY, safeLang);
  return safeLang;
}

export function initLanguageSwitcher() {
  const button = document.querySelector('[data-language-button]');
  const menu = document.querySelector('[data-language-menu]');
  if (!button || !menu) return;

  button.addEventListener('click', () => {
    const isOpen = !menu.hidden;
    menu.hidden = isOpen;
    button.setAttribute('aria-expanded', String(!isOpen));
  });

  menu.querySelectorAll('[data-lang]').forEach((option) => {
    option.addEventListener('click', async () => {
      const lang = option.dataset.lang;
      await applyLanguage(lang);
      trackEvent('language_change', { language: lang });
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-language-switcher]')) {
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    }
  });
}
