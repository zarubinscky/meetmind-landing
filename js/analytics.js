import { getVisitorId } from './visitor.js';
import { getUtm } from './utm.js';

const sentScrollEvents = new Set();

export function trackEvent(eventName, payload = {}) {
  const event = {
    event: eventName,
    timestamp: new Date().toISOString(),
    visitor_id: getVisitorId(),
    language: document.documentElement.lang || 'en',
    page: window.location.pathname,
    utm: getUtm(),
    ...payload
  };

  // MVP stub. Later: send to GA4, Microsoft Clarity, n8n/Postgres endpoint.
  if (window.MEETMIND_ANALYTICS_DEBUG !== false) {
    console.info('[MeetMind analytics]', event);
  }

  if (window.gtag) window.gtag('event', eventName, payload);
  if (window.clarity) window.clarity('event', eventName);
}

export function bindTrackedLinks() {
  document.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => trackEvent(el.dataset.track, { href: el.getAttribute('href') }));
  });
}

export function initScrollTracking() {
  const thresholds = [25, 50, 75, 100];
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const percent = Math.min(100, Math.round((window.scrollY / max) * 100));
    thresholds.forEach((t) => {
      if (percent >= t && !sentScrollEvents.has(t)) {
        sentScrollEvents.add(t);
        trackEvent(`scroll_${t}`);
      }
    });
  }, { passive: true });
}
