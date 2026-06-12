import { useState } from 'react';
import { Check, Copy, Pencil, Trash2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import { formatDateTime } from '../../utils/dates.js';

/**
 * Code-Snippet-Karte (cyan = Code-Semantik).
 * Klick auf den Titel öffnet die große Lese-Ansicht; Copy-Button
 * mit Häkchen-Feedback; Code-Block mit eigenem Scrollbereich.
 */
export default function SnippetCard({ snippet, onOpen, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback für ältere Browser/HTTP-Kontexte
      window.prompt('Code manuell kopieren:', snippet.code);
    }
  };

  return (
    <GlassCard glow="cyan" className="group flex h-full flex-col overflow-hidden">
      {/* Header im Editor-Tab-Stil */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <Badge color="cyan">{snippet.language}</Badge>
        <button
          onClick={() => onOpen(snippet)}
          className="min-w-0 flex-1 truncate text-left font-display text-sm font-semibold transition-colors hover:text-neon-cyan"
          title="Snippet öffnen"
        >
          {snippet.title}
        </button>

        <button
          onClick={copy}
          aria-label="Code kopieren"
          className={[
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-xs',
            'transition-all duration-300',
            copied
              ? 'bg-neon-green/15 text-neon-green shadow-glow-green'
              : 'text-ink-mid hover:bg-white/5 hover:text-neon-cyan',
          ].join(' ')}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'kopiert' : 'copy'}
        </button>

        <button
          onClick={() => onEdit(snippet)}
          aria-label="Snippet bearbeiten"
          className="rounded-lg p-1.5 text-ink-low transition-colors hover:bg-white/5 hover:text-neon-cyan md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(snippet.id)}
          aria-label="Snippet löschen"
          className="rounded-lg p-1.5 text-ink-low transition-colors hover:bg-white/5 hover:text-neon-pink md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Code-Block */}
      <pre className="max-h-72 flex-1 overflow-auto bg-panel/80 p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-ink-hi">{snippet.code}</code>
      </pre>

      {/* Fußzeile */}
      <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-2.5">
        <p className="min-w-0 truncate text-xs text-ink-mid">
          {snippet.description || '\u00A0'}
        </p>
        <span className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-ink-low">
          <Badge>{snippet.subject}</Badge>
          {formatDateTime(snippet.updatedAt)}
        </span>
      </div>
    </GlassCard>
  );
}
