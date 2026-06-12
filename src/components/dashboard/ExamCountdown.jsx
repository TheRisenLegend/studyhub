import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard.jsx';
import NeonButton from '../ui/NeonButton.jsx';
import { daysUntil, formatDate } from '../../utils/dates.js';

/**
 * Klausur-Countdown-Widget.
 * Zeigt alle anstehenden Klausuren sortiert nach Datum; die Tage-Zahl
 * eskaliert farblich: ≤ 3 Tage = Pink (Alarm), ≤ 10 = Grün, sonst neutral.
 * Neue Klausuren werden direkt im Widget angelegt — kein extra Screen.
 */
export default function ExamCountdown({ exams, onAdd, onDelete }) {
  const [formOpen, setFormOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');

  const upcoming = exams
    .map((e) => ({ ...e, days: daysUntil(e.date) }))
    .filter((e) => e.days >= 0)
    .sort((a, b) => a.days - b.days);

  const submit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !date) return;
    onAdd({ subject: subject.trim(), date });
    setSubject('');
    setDate('');
    setFormOpen(false);
  };

  const daysColor = (d) =>
    d <= 3 ? 'text-neon-pink' : d <= 10 ? 'text-neon-green' : 'text-ink-hi';

  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-ink-mid">
          <CalendarDays size={16} className="text-neon-green" />
          Klausuren
        </h2>
        <button
          onClick={() => setFormOpen((o) => !o)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-xs text-neon-green transition-colors hover:bg-neon-green/10"
        >
          <Plus size={14} /> Klausur
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
            <div className="flex flex-col gap-2 rounded-xl border border-line bg-white/[0.03] p-3 sm:flex-row">
              <input
                className="field flex-1"
                placeholder="Fach, z. B. Statistik"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                autoFocus
              />
              <input
                type="date"
                className="field sm:w-40 [color-scheme:dark]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <NeonButton type="submit" className="sm:px-3">
                OK
              </NeonButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Liste */}
      {upcoming.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-mid">
          Nichts in Sicht. Mit „+ Klausur" den nächsten Termin eintragen.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {upcoming.map((e) => (
            <li key={e.id} className="group flex items-center gap-3 py-2.5">
              <span className="w-20 shrink-0 font-mono text-xs text-ink-low">
                {formatDate(e.date)}
              </span>
              <span className="flex-1 truncate text-sm font-medium">{e.subject}</span>
              <span
                className={`font-mono text-sm font-semibold tabular-nums ${daysColor(e.days)}`}
              >
                {e.days === 0 ? 'HEUTE' : e.days === 1 ? 'morgen' : `${e.days} Tage`}
              </span>
              <button
                onClick={() => onDelete(e.id)}
                aria-label={`Klausur ${e.subject} löschen`}
                className="rounded-md p-1 text-ink-low opacity-100 transition-all hover:text-neon-pink md:opacity-0 md:group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
