import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { daysUntil } from '../../utils/dates.js';
import { timeAgo } from '../../utils/dates.js';

/**
 * Das Signature-Element der App: ein Terminal-Fenster als Dashboard-Hero.
 * "Output" des Befehls ist die wichtigste Info überhaupt — der Countdown
 * zur nächsten Klausur — plus eine getippte Statuszeile mit Live-Daten.
 */
export default function TerminalHero({ exams, notes, snippets, todos = [] }) {
  const reduced = useReducedMotion();

  // Nächste anstehende Klausur ermitteln (heute zählt noch als anstehend)
  const next = exams
    .map((e) => ({ ...e, days: daysUntil(e.date) }))
    .filter((e) => e.days >= 0)
    .sort((a, b) => a.days - b.days)[0];

  // Headline je nach Lage
  const headline = !next
    ? 'Keine Klausur in Sicht.'
    : next.days === 0
      ? `Heute: ${next.subject}.`
      : next.days === 1
        ? `Morgen: ${next.subject}.`
        : null; // Standardfall wird unten mit Glow-Zahl gerendert

  // Statuszeile mit Typing-Effekt
  const lastChange = Math.max(
    0,
    ...notes.map((n) => n.updatedAt),
    ...snippets.map((s) => s.updatedAt)
  );
  const openTodos = todos.filter((t) => !t.done).length;
  const status =
    `${notes.length} ${notes.length === 1 ? 'notiz' : 'notizen'} · ` +
    `${snippets.length} ${snippets.length === 1 ? 'snippet' : 'snippets'} · ` +
    `${openTodos} to-do${openTodos === 1 ? '' : 's'} offen` +
    (lastChange > 0 ? ` · letzte änderung ${timeAgo(lastChange)}` : '');

  const [typed, setTyped] = useState(reduced ? status : '');
  useEffect(() => {
    if (reduced) {
      setTyped(status);
      return;
    }
    setTyped('');
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(status.slice(0, i));
      if (i >= status.length) clearInterval(t);
    }, 22);
    return () => clearInterval(t);
  }, [status, reduced]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="glass overflow-hidden rounded-2xl"
    >
      {/* Terminal-Titelleiste */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-neon-cyan/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-neon-violet/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-neon-green/70" />
        <span className="ml-2 font-mono text-[11px] text-ink-low">
          wi-tha@hub — ~/dashboard
        </span>
      </div>

      {/* Terminal-Body */}
      <div className="px-5 py-6 sm:px-7 sm:py-8">
        <p className="font-mono text-xs text-ink-low">
          <span className="text-neon-green">$</span> hub status --heute
        </p>

        {/* "Rich Output": die Kernaussage groß in der Display-Schrift */}
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-wide sm:text-4xl">
          {headline ?? (
            <>
              <span className="text-neon-green drop-shadow-[0_0_18px_rgba(74,222,128,0.55)]">
                {next.days} Tage
              </span>{' '}
              bis {next.subject}.
            </>
          )}
        </h1>

        <p className="mt-3 font-mono text-sm text-ink-mid">
          <span className="text-neon-cyan">→</span> {typed}
          <span
            className="ml-0.5 inline-block h-[1.05em] w-[0.55ch] translate-y-[2px] animate-blink bg-neon-green"
            aria-hidden="true"
          />
        </p>
      </div>
    </motion.section>
  );
}
