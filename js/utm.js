const UTM_KEY = 'meetmind_utm';
const UTM_FIELDS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];

export function captureUtm() {
  const params = new URLSearchParams(window.location.search);
  const existing = JSON.parse(localStorage.getItem(UTM_KEY) || '{}');
  const next = { ...existing };
  let changed = false;
  UTM_FIELDS.forEach((field) => {
    const value = params.get(field);
    if (value) { next[field] = value; changed = true; }
  });
  const referrer = document.referrer;
  if (referrer && !next.referrer) { next.referrer = referrer; changed = true; }
  if (changed) localStorage.setItem(UTM_KEY, JSON.stringify(next));
  return next;
}

export function getUtm() {
  return JSON.parse(localStorage.getItem(UTM_KEY) || '{}');
}
