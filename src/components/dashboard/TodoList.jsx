import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ListChecks, Plus, Trash2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard.jsx';
import { daysUntil, formatDate } from '../../utils/dates.js';

/**
 * To-Do-Widget fürs Dashboard (pinker Akzent).
 * Aufgaben optional mit Fälligkeitsdatum; überfällige und heutige
 * Termine springen farblich ins Auge, damit nichts mehr verpasst wird.
 * Sortierung: offen vor erledigt, innerhalb dessen nach Fälligkeit.
 */
export default function TodoList({ todos, onAdd, onToggle, onDelete }) {
  const [formOpen, setFormOpen] = useState(false);
  const [text, setText] = useState('');
  const [due, setDue] = useState('');

  const open = todos.filter((t) => !t.done).length;

  const sorted = [...todos].sort(
    (a, b) =>
      Number(a.done) - Number(b.done) ||
      (a.due ?? '9999-12-31').localeCompare(b.due ?? '9999-12-31')
  );

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd({ text: text.trim(), due: due || null });
    setText('');
    setDue('');
    setFormOpen(false);
  };

  /** Fälligkeits-Badge: überfällig (pink) > heute/morgen (grün) > Datum (neutral) */
  const dueBadge = (t) => {
    if (!t.due) return null;
    const d = daysUntil(t.due);
    let label = formatDate(t.due);
    let cls = 'text-ink-low';
    if (!t.done) {
      if (d < 0) {
        label = `überfällig · ${formatDate(t.due)}`;
        cls = 'text-neon-pink';
      } else if (d === 0) {
        label = 'HEUTE';
        cls = 'text-neon-green';
      } else if (d === 1) {
        label = 'morgen';
        cls = 'text-neon-green';
      }
    }
    return <span className={`shrink-0 font-mono text-[11px] ${cls}`}>{label}</span>;
  };

  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-ink-mid">
          <ListChecks size={16} className="text-neon-pink" />
          To-Do
          <span className="font-mono text-[11px] normal-case tracking-normal text-ink-low">
            · {open} offen
          </span>
        </h2>
        <button
          onClick={() => setFormOpen((o) => !o)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-xs text-neon-pink transition-colors hover:bg-neon-pink/10"
        >
          <Plus size={14} /> To-Do
        </button>
      </div>

      {/* Inline-Formular zum Anlegen */}
      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.form
            onSubmit={submit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-3 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 p-px">
              <input
                className="field min-w-40 flex-1"
                placeholder="Was steht an?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                aria-label="Aufgabe"
              />
              <input
                type="date"
                className="field w-auto font-mono text-xs [color-scheme:dark]"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                aria-label="Fällig am (optional)"
              />
              <button
                type="submit"
                className="rounded-xl border border-neon-pink/40 bg-neon-pink/15 px-3.5 py-2 font-mono text-xs text-neon-pink transition-all duration-300 hover:bg-neon-pink/25 hover:shadow-glow-pink"
              >
                ok
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Liste */}
      {sorted.length === 0 ? (
        <p className="py-6 text-center font-mono text-xs text-ink-low">
          Keine To-Dos. Alles im Griff.
        </p>
      ) : (
        <ul>
          <AnimatePresence initial={false}>
            {sorted.map((t) => (
              <motion.li
                key={t.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -14, transition: { duration: 0.15 } }}
                className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.03]"
              >
                {/* Checkbox */}
                <button
                  onClick={() => onToggle(t.id)}
                  aria-label={t.done ? 'Als offen markieren' : 'Als erledigt markieren'}
                  className={[
                    'grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all duration-300',
                    t.done
                      ? 'border-neon-pink/60 bg-neon-pink/20 text-neon-pink shadow-glow-pink'
                      : 'border-line text-transparent hover:border-neon-pink/50',
                  ].join(' ')}
                >
                  <Check size={12} strokeWidth={3} />
                </button>

                <span
                  className={[
                    'min-w-0 flex-1 truncate text-sm transition-colors',
                    t.done ? 'text-ink-low line-through' : 'text-ink-hi',
                  ].join(' ')}
                >
                  {t.text}
                </span>

                {dueBadge(t)}

                <button
                  onClick={() => onDelete(t.id)}
                  aria-label="To-Do löschen"
                  className="rounded-lg p-1 text-ink-low transition-colors hover:bg-white/5 hover:text-neon-pink md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </GlassCard>
  );
}
