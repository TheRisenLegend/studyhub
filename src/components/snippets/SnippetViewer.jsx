import { useState } from 'react';
import { Check, Copy, Pencil, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Badge from '../ui/Badge.jsx';
import NeonButton from '../ui/NeonButton.jsx';
import { formatDateTime } from '../../utils/dates.js';

/**
 * Lese-Ansicht eines Snippets im großen Fenster:
 * voller Code ohne Scroll-Gefummel, Copy direkt im Fuß.
 */
export default function SnippetViewer({ snippet, onEdit, onDelete, onClose }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('Code manuell kopieren:', snippet.code);
    }
  };

  const footer = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <NeonButton variant="danger" onClick={() => onDelete(snippet.id)}>
        <Trash2 size={15} /> Löschen
      </NeonButton>
      <div className="flex gap-2">
        <NeonButton variant="ghost" onClick={copy} className={copied ? 'text-neon-green' : ''}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'kopiert' : 'Code kopieren'}
        </NeonButton>
        <NeonButton onClick={() => onEdit(snippet)}>
          <Pencil size={15} /> Bearbeiten
        </NeonButton>
      </div>
    </div>
  );

  return (
    <Modal title={snippet.title} onClose={onClose} size="full" resizable footer={footer}>
      <div className="flex h-full min-h-[50vh] flex-col">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-ink-low">
          <Badge color="cyan">{snippet.language}</Badge>
          <Badge>{snippet.subject}</Badge>
          <span>zuletzt geändert: {formatDateTime(snippet.updatedAt)}</span>
        </div>

        {snippet.description && (
          <p className="mb-3 text-sm text-ink-mid">{snippet.description}</p>
        )}

        <pre className="grow overflow-auto rounded-xl border border-line bg-panel/80 p-4 text-[13px] leading-relaxed">
          <code className="font-mono text-ink-hi">{snippet.code}</code>
        </pre>
      </div>
    </Modal>
  );
}
