import { Pencil, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Badge from '../ui/Badge.jsx';
import NeonButton from '../ui/NeonButton.jsx';
import { formatDateTime } from '../../utils/dates.js';
import { sanitizeHtml, toEditableHtml } from '../../utils/html.js';

/**
 * Lese-Ansicht einer Notiz im großen Fenster (Größe umschaltbar).
 * Von hier aus geht's direkt ins Bearbeiten oder Löschen.
 */
export default function NoteViewer({ note, onEdit, onDelete, onClose }) {
  // Beim Rendern bereinigen — reicht hier, da ausschließlich selbst
  // erstellte, lokal gespeicherte Inhalte angezeigt werden.
  const html = sanitizeHtml(toEditableHtml(note.content));

  const footer = (
    <div className="flex items-center justify-between gap-2">
      <NeonButton variant="danger" onClick={() => onDelete(note.id)}>
        <Trash2 size={15} /> Löschen
      </NeonButton>
      <NeonButton onClick={() => onEdit(note)}>
        <Pencil size={15} /> Bearbeiten
      </NeonButton>
    </div>
  );

  return (
    <Modal title={note.title} onClose={onClose} size="full" resizable footer={footer}>
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-ink-low">
        <Badge color="violet">{note.subject}</Badge>
        <span>zuletzt geändert: {formatDateTime(note.updatedAt)}</span>
      </div>

      <div
        className="rich-content max-w-3xl text-[15px] leading-relaxed text-ink-hi"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Modal>
  );
}
