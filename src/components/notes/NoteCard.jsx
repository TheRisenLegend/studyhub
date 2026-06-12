import { Pencil, Trash2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import { formatDateTime } from '../../utils/dates.js';
import { stripHtml } from '../../utils/html.js';

/**
 * Einzelne Notiz-Karte (violetter Glow = Notizen-Semantik).
 * Klick auf die Karte öffnet die große Lese-Ansicht,
 * der Stift springt direkt ins Bearbeiten.
 */
export default function NoteCard({ note, onOpen, onEdit, onDelete }) {
  return (
    <GlassCard glow="violet" lift className="group flex h-full flex-col p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge color="violet">{note.subject}</Badge>
        <span className="font-mono text-[11px] text-ink-low">
          {formatDateTime(note.updatedAt)}
        </span>
      </div>

      {/* Titel + Vorschau sind die Klickfläche zum Öffnen */}
      <button onClick={() => onOpen(note)} className="flex-1 text-left">
        <h3 className="font-display font-semibold leading-snug transition-colors group-hover:text-neon-violet">
          {note.title}
        </h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-mid line-clamp-4">
          {stripHtml(note.content)}
        </p>
      </button>

      {/* Aktionen: auf Touch immer sichtbar, am Desktop erst beim Hover */}
      <div className="mt-4 flex justify-end gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
        <button
          onClick={() => onEdit(note)}
          aria-label="Notiz bearbeiten"
          className="rounded-lg p-1.5 text-ink-low transition-colors hover:bg-white/5 hover:text-neon-violet"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(note.id)}
          aria-label="Notiz löschen"
          className="rounded-lg p-1.5 text-ink-low transition-colors hover:bg-white/5 hover:text-neon-pink"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </GlassCard>
  );
}
