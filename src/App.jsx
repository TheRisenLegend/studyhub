import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Code2, FileText, LayoutDashboard } from 'lucide-react';

import Sidebar from './components/layout/Sidebar.jsx';
import MobileNav from './components/layout/MobileNav.jsx';
import AppFooter from './components/layout/AppFooter.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import NotesView from './components/notes/NotesView.jsx';
import SnippetsView from './components/snippets/SnippetsView.jsx';
import LegalView from './components/legal/LegalView.jsx';

import { useStoredState } from './hooks/useStoredState.js';
import {
  createId,
  SEED_EXAMS,
  SEED_NOTES,
  SEED_SNIPPETS,
  SEED_TODOS,
} from './data/storage.js';

/**
 * Zentrale Navigationsdefinition — Sidebar (Desktop) und Bottom-Tabs
 * (Mobile) speisen sich aus derselben Liste. `accent` steuert die
 * semantische Farbcodierung der Bereiche.
 */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, accent: 'green' },
  { id: 'notes', label: 'Notizen', icon: FileText, accent: 'violet' },
  { id: 'snippets', label: 'Snippets', icon: Code2, accent: 'cyan' },
];

export default function App() {
  /* Aktive Ansicht. Bewusst State statt Router: kein Routing-Overhead,
     keine 404-Probleme auf GitHub Pages. 'legal' (Impressum) ist nur über
     den Footer erreichbar und taucht deshalb nicht in NAV_ITEMS auf. */
  const [view, setView] = useState('dashboard');

  /* Daten leben hier oben und werden über den Storage-Hook automatisch
     in localStorage persistiert (Backend-Andockstelle: src/data/storage.js). */
  const [notes, setNotes] = useStoredState('notes', SEED_NOTES);
  const [snippets, setSnippets] = useStoredState('snippets', SEED_SNIPPETS);
  const [exams, setExams] = useStoredState('exams', SEED_EXAMS);
  const [todos, setTodos] = useStoredState('todos', SEED_TODOS);

  /* ----- CRUD-Handler -------------------------------------------------
     upsert = anlegen ODER aktualisieren (je nachdem, ob die id schon
     existiert). Neue Einträge bekommen id + ECHTEN Zeitstempel des Geräts
     (Date.now()) hier zentral — kein erfundenes Datum. */
  const makeUpsert = (setter) => (data) =>
    setter((prev) => {
      const item = { ...data, id: data.id ?? createId(), updatedAt: Date.now() };
      return prev.some((x) => x.id === item.id)
        ? prev.map((x) => (x.id === item.id ? item : x))
        : [item, ...prev];
    });

  const upsertNote = makeUpsert(setNotes);
  const upsertSnippet = makeUpsert(setSnippets);
  const deleteNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));
  const deleteSnippet = (id) => setSnippets((prev) => prev.filter((s) => s.id !== id));

  const addExam = (data) =>
    setExams((prev) =>
      [...prev, { ...data, id: createId() }].sort((a, b) => a.date.localeCompare(b.date))
    );
  const deleteExam = (id) => setExams((prev) => prev.filter((e) => e.id !== id));

  const addTodo = (data) =>
    setTodos((prev) => [
      { ...data, id: createId(), done: false, createdAt: Date.now() },
      ...prev,
    ]);
  const toggleTodo = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const deleteTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  /* Backup-Import: ersetzt alle Collections (Bestätigung passiert im Footer). */
  const handleImport = useCallback((parsed) => {
    const arr = (x) => (Array.isArray(x) ? x : []);
    setNotes(arr(parsed.notes));
    setSnippets(arr(parsed.snippets));
    setExams(arr(parsed.exams));
    setTodos(arr(parsed.todos));
  }, [setNotes, setSnippets, setExams, setTodos]);

  /* ----- View-Rendering ----------------------------------------------- */
  const VIEWS = {
    dashboard: (
      <Dashboard
        notes={notes}
        snippets={snippets}
        exams={exams}
        todos={todos}
        onNavigate={setView}
        onAddExam={addExam}
        onDeleteExam={deleteExam}
        onAddTodo={addTodo}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
      />
    ),
    notes: <NotesView notes={notes} onUpsert={upsertNote} onDelete={deleteNote} />,
    snippets: (
      <SnippetsView snippets={snippets} onUpsert={upsertSnippet} onDelete={deleteSnippet} />
    ),
    legal: <LegalView onBack={() => setView('dashboard')} />,
  };

  return (
    <div className="relative z-10 min-h-dvh">
      <Sidebar items={NAV_ITEMS} view={view} onNavigate={setView} />
      <MobileNav items={NAV_ITEMS} view={view} onNavigate={setView} />

      {/* Content: Platz für Sidebar (Desktop) bzw. Bottom-Nav (Mobile) */}
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:pb-12 md:pl-[17rem] md:pt-10 lg:px-10">
        {/* Weicher Übergang zwischen den Hauptansichten */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {VIEWS[view]}
          </motion.div>
        </AnimatePresence>

        {/* Fußzeile mit Backup + Impressum-Link (auf der Impressum-Seite selbst ausgeblendet) */}
        {view !== 'legal' && (
          <AppFooter
            data={{ notes, snippets, exams, todos }}
            onImport={handleImport}
            onOpenLegal={() => setView('legal')}
          />
        )}
      </main>
    </div>
  );
}
