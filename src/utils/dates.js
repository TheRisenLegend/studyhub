/**
 * Kleine Datums-Helfer — bewusst ohne externe Library (kein Schmarri).
 */

/** Tage bis zu einem Datum ('YYYY-MM-DD'), ab heute 00:00 Uhr gerechnet. 0 = heute. */
export function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.round((target - today) / 86_400_000);
}

/** '2026-06-25' → '25.06.2026' */
export function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Timestamp (ms) → echtes Datum mit Uhrzeit: '10.06.26, 14:32' */
export function formatDateTime(ts) {
  return new Date(ts).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Timestamp (ms) → 'gerade eben' / 'vor 5 Min.' / 'vor 3 Std.' / 'vor 2 Tagen' */
export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return 'gerade eben';
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.floor(min / 60);
  if (h < 24) return `vor ${h} Std.`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'gestern' : `vor ${d} Tagen`;
}
