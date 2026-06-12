import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Plus, Search } from 'lucide-react';
import NoteCard from './NoteCard.jsx';
import NoteModal from './NoteModal.jsx';
import NoteViewer from './NoteViewer.jsx';
import NeonButton from '../ui/NeonButton.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { stripHtml } from '../../utils/html.js';

/**
 * Notizen-Bereich: Suche + Fach-Filter + responsives Karten-Grid.
 * Karten-Klick → große Lese-Ansicht; Erstellen läuft zweistufig
 * (Details → Inhalt im Rich-Text-Editor).
 */
export default function NotesView({ notes, onUpsert, onDelete }) {
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('Alle');
  const [viewer, setViewer] = useState(null);          // Notiz in der Lese-Ansicht
  const [editor, setEditor] = useState(null);          // { note: object|null, startStep: 1|2 }

  // Fach-Chips dynamisch aus den vorhandenen Notizen ableiten
  const subjects = useMemo(
    () => [...new Set(notes.map((n) => n.subject))].sort(),
    [notes]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter((n) => subjectFilter === 'Alle' || n.subject === subjectFilter)
      .filter(
        (n) =>
          !q ||
          n.title.toLowerCase().includes(q) ||
          stripHtml(n.content).toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q)
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, query, subjectFilter]);

  /** Mit Rückfrage löschen; gibt zurück, ob wirklich gelöscht wurde. */
  const remove = (id) => {
    if (window.confirm('Notiz wirklich löschen?')) {
      onDelete(id);
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-5">
      {/* Kopfzeile */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-wide">Notizen</h1>
          <p className="mt-1 text-sm text-ink-mid">
            {notes.length} {notes.length === 1 ? 'Eintrag' : 'Einträge'} · gemeinsam fürs Semester
          </p>
        </div>
        <NeonButton onClick={() => setEditor({ note: null, startStep: 1 })}>
          <Plus size={16} /> Neue Notiz
        </NeonButton>
      </div>

      {/* Suche */}
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-low" />
        <input
          className="field pl-10 font-mono"
          placeholder="suchen …"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Notizen durchsuchen"
        />
      </div>

      {/* Fach-Filter */}
      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {['Alle', ...subjects].map((s) => {
            const active = subjectFilter === s;
            return (
              <button
                key={s}
                onClick={() => setSubjectFilter(s)}
                className={[
                  'rounded-lg border px-3 py-1 font-mono text-xs transition-all duration-300',
                  active
                    ? 'border-neon-violet/50 bg-neon-violet/15 text-neon-violet shadow-glow-violet'
                    : 'border-line bg-white/[0.03] text-ink-mid hover:border-neon-violet/30 hover:text-ink-hi',
                ].join(' ')}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={notes.length === 0 ? 'Noch keine Notizen hier.' : 'Nichts gefunden.'}
          hint={
            notes.length === 0
              ? 'Leg mit „Neue Notiz" die erste Zusammenfassung für die Crew an.'
              : 'Anderen Suchbegriff probieren oder Filter zurücksetzen.'
          }
        />
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filtered.map((note, i) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.35 } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
              >
                <NoteCard
                  note={note}
                  onOpen={setViewer}
                  onEdit={(n) => setEditor({ note: n, startStep: 2 })}
                  onDelete={remove}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lese-Ansicht + Erstellen/Bearbeiten */}
      <AnimatePresence>
        {viewer && (
          <NoteViewer
            key="viewer"
            note={viewer}
            onClose={() => setViewer(null)}
            onEdit={(n) => {
              setViewer(null);
              setEditor({ note: n, startStep: 2 });
            }}
            onDelete={(id) => {
              if (remove(id)) setViewer(null);
            }}
          />
        )}
        {editor && (
          <NoteModal
            key="editor"
            note={editor.note}
            startStep={editor.startStep}
            subjects={subjects}
            onSave={onUpsert}
            onClose={() => setEditor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
