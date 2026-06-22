const VISITOR_KEY = 'meetmind_visitor_id';

export function getVisitorId(prefix = 'mm_') {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    const random = crypto?.randomUUID ? crypto.randomUUID().replaceAll('-', '').slice(0, 16) : Math.random().toString(36).slice(2, 18);
    id = `${prefix}${random}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}
