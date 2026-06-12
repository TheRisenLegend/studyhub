import { motion } from 'framer-motion';
import { Code2, FileText, ListChecks, Timer } from 'lucide-react';
import TerminalHero from './TerminalHero.jsx';
import StatCard from './StatCard.jsx';
import ExamCountdown from './ExamCountdown.jsx';
import TodoList from './TodoList.jsx';
import RecentFeed from './RecentFeed.jsx';
import { daysUntil } from '../../utils/dates.js';

/** Gestaffeltes Einblenden der Dashboard-Sektionen */
const stagger = {
  hidden: { opacity: 0, y: 14 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

/**
 * Startseite: Terminal-Hero (Signature), vier Kennzahlen, darunter
 * Klausur-Countdown + To-Do-Liste nebeneinander und der Feed.
 */
export default function Dashboard({
  notes,
  snippets,
  exams,
  todos,
  onNavigate,
  onAddExam,
  onDeleteExam,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}) {
  const nextExam = exams
    .map((e) => ({ ...e, days: daysUntil(e.date) }))
    .filter((e) => e.days >= 0)
    .sort((a, b) => a.days - b.days)[0];

  const openTodos = todos.filter((t) => !t.done).length;

  return (
    <div className="space-y-6">
      <TerminalHero exams={exams} notes={notes} snippets={snippets} todos={todos} />

      {/* Kennzahlen — klickbar, farblich nach Inhaltstyp codiert */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <motion.div variants={stagger} initial="hidden" animate="show" custom={0}>
          <StatCard
            icon={FileText}
            value={notes.length}
            label="Notizen"
            accent="violet"
            onClick={() => onNavigate('notes')}
          />
        </motion.div>
        <motion.div variants={stagger} initial="hidden" animate="show" custom={1}>
          <StatCard
            icon={Code2}
            value={snippets.length}
            label="Code-Snippets"
            accent="cyan"
            onClick={() => onNavigate('snippets')}
          />
        </motion.div>
        <motion.div variants={stagger} initial="hidden" animate="show" custom={2}>
          <StatCard
            icon={Timer}
            value={nextExam ? `${nextExam.days}d` : '—'}
            label={nextExam ? `bis ${nextExam.subject}` : 'keine Klausur geplant'}
            accent="green"
            onClick={() => onNavigate('dashboard')}
          />
        </motion.div>
        <motion.div variants={stagger} initial="hidden" animate="show" custom={3}>
          <StatCard
            icon={ListChecks}
            value={openTodos}
            label="offene To-Dos"
            accent="pink"
            onClick={() => onNavigate('dashboard')}
          />
        </motion.div>
      </div>

      {/* Zwei Spalten ab lg: Klausuren | To-Dos, darunter der Feed */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div variants={stagger} initial="hidden" animate="show" custom={4}>
          <ExamCountdown exams={exams} onAdd={onAddExam} onDelete={onDeleteExam} />
        </motion.div>
        <motion.div variants={stagger} initial="hidden" animate="show" custom={5}>
          <TodoList
            todos={todos}
            onAdd={onAddTodo}
            onToggle={onToggleTodo}
            onDelete={onDeleteTodo}
          />
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          custom={6}
          className="lg:col-span-2"
        >
          <RecentFeed notes={notes} snippets={snippets} onNavigate={onNavigate} />
        </motion.div>
      </div>
    </div>
  );
}
