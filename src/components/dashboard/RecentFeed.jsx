import { Code2, FileText, History } from 'lucide-react';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import { formatDateTime } from '../../utils/dates.js';

/**
 * "Zuletzt im Hub": kombinierter Feed aus Notizen + Snippets,
 * sortiert nach letzter Änderung. Typ ist über Icon-Farbe sofort
 * erkennbar (violet = Notiz, cyan = Snippet). Klick springt in den Bereich.
 */
export default function RecentFeed({ notes, snippets, onNavigate }) {
  const items = [
    ...notes.map((n) => ({ ...n, type: 'note' })),
    ...snippets.map((s) => ({ ...s, type: 'snippet' })),
  ]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  return (
    <GlassCard className="p-5">
      <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-ink-mid">
        <History size={16} className="text-neon-cyan" />
        Zuletzt im Hub
      </h2>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-mid">
          Noch nichts geteilt — leg in „Notizen" oder „Snippets" los.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((item) => {
            const isNote = item.type === 'note';
            const Icon = isNote ? FileText : Code2;
            return (
              <li key={`${item.type}-${item.id}`}>
                <button
                  onClick={() => onNavigate(isNote ? 'notes' : 'snippets')}
                  className="group flex w-full items-center gap-3 py-2.5 text-left"
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${
                      isNote
                        ? 'border-neon-violet/30 bg-neon-violet/10 text-neon-violet'
                        : 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan'
                    }`}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium transition-colors group-hover:text-ink-hi">
                      {item.title}
                    </span>
                    <span className="font-mono text-[11px] text-ink-low">
                      {formatDateTime(item.updatedAt)}
                    </span>
                  </span>
                  <Badge color={isNote ? 'violet' : 'cyan'}>{item.subject}</Badge>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}
