import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Code2, Plus, Search } from 'lucide-react';
import SnippetCard from './SnippetCard.jsx';
import SnippetModal from './SnippetModal.jsx';
import SnippetViewer from './SnippetViewer.jsx';
import NeonButton from '../ui/NeonButton.jsx';
import EmptyState from '../ui/EmptyState.jsx';

/**
 * Code-Snippets-Bereich: Suche + Sprach-Filter + 2-spaltiges Grid (ab lg).
 * Titel-Klick → große Lese-Ansicht; Erstellen läuft zweistufig
 * (Details → Code im großen Editor).
 */
export default function SnippetsView({ snippets, onUpsert, onDelete }) {
  const [query, setQuery] = useState('');
  const [langFilter, setLangFilter] = useState('Alle');
  const [viewer, setViewer] = useState(null);          // Snippet in der Lese-Ansicht
  const [editor, setEditor] = useState(null);          // { snippet: object|null, startStep: 1|2 }

  const languages = useMemo(
    () => [...new Set(snippets.map((s) => s.language))].sort(),
    [snippets]
  );
  const subjects = useMemo(
    () => [...new Set(snippets.map((s) => s.subject))].sort(),
    [snippets]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return snippets
      .filter((s) => langFilter === 'Alle' || s.language === langFilter)
      .filter(
        (s) =>
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.subject.toLowerCase().includes(q) ||
          (s.description ?? '').toLowerCase().includes(q)
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [snippets, query, langFilter]);

  /** Mit Rückfrage löschen; gibt zurück, ob wirklich gelöscht wurde. */
  const remove = (id) => {
    if (window.confirm('Snippet wirklich löschen?')) {
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
          <h1 className="font-display text-2xl font-bold tracking-wide">Code-Snippets</h1>
          <p className="mt-1 text-sm text-ink-mid">
            {snippets.length} {snippets.length === 1 ? 'Snippet' : 'Snippets'} · copy &amp; lernen
          </p>
        </div>
        <NeonButton onClick={() => setEditor({ snippet: null, startStep: 1 })}>
          <Plus size={16} /> Neues Snippet
        </NeonButton>
      </div>

      {/* Suche */}
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-low" />
        <input
          className="field pl-10 font-mono"
          placeholder="suchen … (auch im Code)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Snippets durchsuchen"
        />
      </div>

      {/* Sprach-Filter */}
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {['Alle', ...languages].map((l) => {
            const active = langFilter === l;
            return (
              <button
                key={l}
                onClick={() => setLangFilter(l)}
                className={[
                  'rounded-lg border px-3 py-1 font-mono text-xs transition-all duration-300',
                  active
                    ? 'border-neon-cyan/50 bg-neon-cyan/15 text-neon-cyan shadow-glow-cyan'
                    : 'border-line bg-white/[0.03] text-ink-mid hover:border-neon-cyan/30 hover:text-ink-hi',
                ].join(' ')}
              >
                {l}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Code2}
          title={snippets.length === 0 ? 'Noch keine Snippets hier.' : 'Nichts gefunden.'}
          hint={
            snippets.length === 0
              ? 'Teil mit „Neues Snippet" den ersten Code mit der Crew.'
              : 'Anderen Suchbegriff probieren oder Filter zurücksetzen.'
          }
        />
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AnimatePresence>
            {filtered.map((snippet, i) => (
              <motion.div
                key={snippet.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.35 } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
              >
                <SnippetCard
                  snippet={snippet}
                  onOpen={setViewer}
                  onEdit={(s) => setEditor({ snippet: s, startStep: 2 })}
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
          <SnippetViewer
            key="viewer"
            snippet={viewer}
            onClose={() => setViewer(null)}
            onEdit={(s) => {
              setViewer(null);
              setEditor({ snippet: s, startStep: 2 });
            }}
            onDelete={(id) => {
              if (remove(id)) setViewer(null);
            }}
          />
        )}
        {editor && (
          <SnippetModal
            key="editor"
            snippet={editor.snippet}
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
