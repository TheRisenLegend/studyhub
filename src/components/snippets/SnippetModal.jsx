import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import NeonButton from '../ui/NeonButton.jsx';

const LANGUAGES = ['Java', 'Python', 'SQL', 'JavaScript', 'Bash', 'Sonstiges'];

/**
 * Snippet anlegen/bearbeiten in ZWEI Schritten:
 *   1) kompaktes Fenster für Titel, Sprache, Fach, Beschreibung
 *   2) großer Code-Editor (Mono, Tab rückt ein, Zeilenzähler)
 *
 * Bewusst KEIN Rich-Text bei Code — Formatierungs-HTML würde den
 * Code beim Kopieren kaputt machen. Dafür: Tab-Unterstützung.
 */
export default function SnippetModal({ snippet, subjects, onSave, onClose, startStep = 1 }) {
  const [step, setStep] = useState(startStep);
  const [title, setTitle] = useState(snippet?.title ?? '');
  const [language, setLanguage] = useState(snippet?.language ?? 'Java');
  const [subject, setSubject] = useState(snippet?.subject ?? '');
  const [description, setDescription] = useState(snippet?.description ?? '');
  const [code, setCode] = useState(snippet?.code ?? '');

  const canContinue = title.trim().length > 0;
  const canSave = canContinue && code.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    onSave({
      ...(snippet ?? {}),
      title: title.trim(),
      language,
      subject: subject.trim() || 'Allgemein',
      description: description.trim(),
      code: code.replace(/\s+$/, ''), // trailing whitespace am Ende kappen
    });
    onClose();
  };

  /** Tab-Taste rückt zwei Leerzeichen ein, statt den Fokus zu verlieren. */
  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end');
      setCode(ta.value);
    }
  };

  const lines = code === '' ? 0 : code.split('\n').length;

  const footer =
    step === 1 ? (
      <div className="flex justify-end gap-2">
        <NeonButton variant="ghost" onClick={onClose}>Abbrechen</NeonButton>
        <NeonButton disabled={!canContinue} onClick={() => setStep(2)}>
          Weiter zum Code <ArrowRight size={15} />
        </NeonButton>
      </div>
    ) : (
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <NeonButton variant="ghost" onClick={() => setStep(1)}>
            <ArrowLeft size={15} /> Details
          </NeonButton>
          <span className="hidden font-mono text-[11px] text-ink-low sm:inline">
            {lines} {lines === 1 ? 'Zeile' : 'Zeilen'}
          </span>
        </div>
        <NeonButton disabled={!canSave} onClick={save}>Snippet speichern</NeonButton>
      </div>
    );

  return (
    <Modal
      title={
        step === 1
          ? snippet ? 'Snippet — Details' : 'Neues Snippet · Schritt 1/2'
          : `${title.trim() || 'Snippet'} — Code`
      }
      onClose={onClose}
      size={step === 1 ? 'md' : 'full'}
      resizable={step === 2}
      footer={footer}
    >
      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.div
            key="meta"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="sn-title" className="field-label">Titel</label>
              <input
                id="sn-title"
                className="field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canContinue && setStep(2)}
                placeholder="z. B. Stream: Liste filtern & mappen"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="sn-lang" className="field-label">Sprache</label>
                <select
                  id="sn-lang"
                  className="field [color-scheme:dark]"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="sn-subject" className="field-label">Fach</label>
                <input
                  id="sn-subject"
                  className="field"
                  list="snippet-subject-options"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="z. B. Prog2"
                />
                <datalist id="snippet-subject-options">
                  {subjects.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label htmlFor="sn-desc" className="field-label">Beschreibung (optional)</label>
              <input
                id="sn-desc"
                className="field"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Wofür ist das gut?"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.18 }}
            className="h-full"
          >
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoFocus
              aria-label="Code"
              placeholder={'public static void main(String[] args) {\n    // ...\n}'}
              className="h-full min-h-[50vh] w-full resize-none rounded-xl border border-line bg-panel/80 p-4 font-mono text-[13px] leading-relaxed text-ink-hi outline-none transition-colors placeholder:text-ink-low focus:border-neon-cyan/50"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
