import { motion } from 'framer-motion';

/** Akzentfarbe je Bereich (Semantik: cyan=Code, violet=Notizen, green=Termine) */
const ACCENT = {
  cyan: { text: 'text-neon-cyan', bar: 'bg-neon-cyan shadow-glow-cyan' },
  violet: { text: 'text-neon-violet', bar: 'bg-neon-violet shadow-glow-violet' },
  green: { text: 'text-neon-green', bar: 'bg-neon-green shadow-glow-green' },
};

/**
 * Feste Desktop-Sidebar (ab md sichtbar).
 * Der aktive Eintrag bekommt einen leuchtenden Indikator-Balken, der
 * dank Framer-Motion-layoutId flüssig zwischen den Einträgen gleitet.
 */
export default function Sidebar({ items, view, onNavigate }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-void/70 backdrop-blur-xl md:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pb-6 pt-7">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 font-mono text-lg font-semibold text-neon-cyan shadow-glow-cyan">
          &amp;
        </div>
        <div className="leading-tight">
          <p className="font-display text-[15px] font-bold tracking-wider">
            STUDY<span className="text-neon-cyan">&amp;</span>CODE
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-low">
            hub · wi@tha
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map(({ id, label, icon: Icon, accent }) => {
          const active = view === id;
          const a = ACCENT[accent];
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={[
                'relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm',
                'transition-colors duration-300',
                active
                  ? `bg-white/[0.06] font-medium ${a.text}`
                  : 'text-ink-mid hover:bg-white/[0.04] hover:text-ink-hi',
              ].join(' ')}
            >
              {/* Gleitender Aktiv-Indikator */}
              {active && (
                <motion.span
                  layoutId="sidebar-indicator"
                  className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full ${a.bar}`}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Status-Footer */}
      <div className="flex items-center gap-2 border-t border-line px-5 py-4 font-mono text-[10px] uppercase tracking-widest text-ink-low">
        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-neon-green shadow-glow-green" />
        v0.2 · localStorage
      </div>
    </aside>
  );
}
