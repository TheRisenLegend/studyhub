/**
 * HTML-Helfer für Notizen.
 * Notiz-Inhalte werden seit dem Rich-Text-Editor als HTML gespeichert;
 * ältere Notizen (reiner Text) werden beim Öffnen on-the-fly konvertiert.
 */

/** Grobe Erkennung: enthält der String HTML-Tags? */
export function looksLikeHtml(s = '') {
  return /<\/?[a-z][\s\S]*>/i.test(s);
}

export function escapeHtml(s = '') {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Reinen Text (mit \n) in einfaches HTML überführen — für Alt-Notizen. */
export function plainTextToHtml(text = '') {
  if (!text) return '';
  return text
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/** Inhalt editierbar machen: HTML durchreichen, Plain-Text konvertieren. */
export function toEditableHtml(content = '') {
  return looksLikeHtml(content) ? content : plainTextToHtml(content);
}

/**
 * Minimaler Sanitizer fürs Rendern mit dangerouslySetInnerHTML.
 * Reicht hier aus, weil ausschließlich selbst erstellte, lokal
 * gespeicherte Inhalte angezeigt werden (kein fremder Input von außen).
 * Entfernt Script-/Embed-Tags, on*-Handler und javascript:-URLs.
 */
export function sanitizeHtml(html = '') {
  return html
    .replace(/<\/?(script|style|iframe|object|embed|link|meta)[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(['"]?)\s*javascript:[^'">]*\2/gi, '$1="#"');
}

/** HTML → kompakter Plain-Text für Karten-Vorschauen. */
export function stripHtml(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<sup[^>]*>/gi, '^')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
