import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, X } from 'lucide-react';

/**
 * Overlay-Modal in Glass-Optik mit wählbarer Größe.
 *
 *   size:      'md' | 'lg' | 'xl' | 'full'  (full = fast Vollbild, feste Höhe)
 *   resizable: zeigt einen Maximieren/Verkleinern-Button im Kopf
 *   footer:    optionaler Bereich unter dem scrollbaren Inhalt
 *              (Buttons bleiben so immer sichtbar, auch bei langem Inhalt)
 *
 * Schließt per ESC, Backdrop-Klick oder X. Wird vom Parent in
 * <AnimatePresence> gerendert, damit auch das Schließen animiert ist.
 */
const SIZES = {
  md: 'w-full max-w-lg',
  lg: 'w-full max-w-2xl',
  xl: 'w-full max-w-4xl',
  full: 'h-[88vh] w-[min(1150px,96vw)]',
};

export default function Modal({
  title,
  onClose,
  children,
  footer = null,
  size = 'md',
  resizable = false,
}) {
  // Aktuelle Größe — kann per Toggle zwischen `size` und 'full' wechseln
  const [cur, setCur] = useState(size);
  useEffect(() => setCur(size), [size]); // Größenwechsel des Parents (z. B. Schritt 1 → 2) übernehmen

  // ESC zum Schließen
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggleSize = () =>
    setCur((c) => (c === 'full' ? (size === 'full' ? 'lg' : size) : 'full'));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Abgedunkelter, geblurrter Hintergrund */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        role="dialog"
        aria-modal="true"
        className={`glass-strong relative flex max-h-[88vh] flex-col overflow-hidden rounded-2xl shadow-glow-cyan/30 ${SIZES[cur]}`}
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      >
        {/* Kopf: Titel + Größen-Toggle + Schließen */}
        <div className="flex items-center gap-1 border-b border-line px-5 py-3.5 sm:px-6">
          <h2 className="min-w-0 flex-1 truncate font-display text-lg font-semibold tracking-wide">
            {title}
          </h2>
          {resizable && (
            <button
              onClick={toggleSize}
              aria-label={cur === 'full' ? 'Fenster verkleinern' : 'Fenster maximieren'}
              title={cur === 'full' ? 'Verkleinern' : 'Maximieren'}
              className="rounded-lg p-1.5 text-ink-mid transition-colors hover:bg-white/5 hover:text-neon-cyan"
            >
              {cur === 'full' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="rounded-lg p-1.5 text-ink-mid transition-colors hover:bg-white/5 hover:text-neon-pink"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollbarer Inhalt */}
        <div className="grow overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        {/* Optionaler, immer sichtbarer Fußbereich */}
        {footer && <div className="border-t border-line px-5 py-4 sm:px-6">{footer}</div>}
      </motion.div>
    </motion.div>
  );
}
