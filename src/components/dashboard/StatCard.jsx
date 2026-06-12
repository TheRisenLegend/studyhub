import GlassCard from '../ui/GlassCard.jsx';

const ACCENT = {
  cyan: { icon: 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan', glow: 'cyan' },
  violet: { icon: 'border-neon-violet/30 bg-neon-violet/10 text-neon-violet', glow: 'violet' },
  green: { icon: 'border-neon-green/30 bg-neon-green/10 text-neon-green', glow: 'green' },
  pink: { icon: 'border-neon-pink/30 bg-neon-pink/10 text-neon-pink', glow: 'pink' },
};

/**
 * Kennzahl-Karte fürs Dashboard. Klickbar → springt in den Bereich.
 */
export default function StatCard({ icon: Icon, value, label, accent, onClick }) {
  const a = ACCENT[accent];
  return (
    <GlassCard
      glow={a.glow}
      lift
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className="flex cursor-pointer items-center gap-4 p-5"
    >
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border ${a.icon}`}>
        <Icon size={22} strokeWidth={1.9} />
      </div>
      <div className="leading-tight">
        <p className="font-display text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-sm text-ink-mid">{label}</p>
      </div>
    </GlassCard>
  );
}
