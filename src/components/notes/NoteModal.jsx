import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import NeonButton from '../ui/NeonButton.jsx';
import RichTextEditor from '../ui/RichTextEditor.jsx';
import { toEditableHtml } from '../../utils/html.js';

/**
 * Notiz anlegen/bearbeiten in ZWEI Schritten:
 *   1) kompaktes Fenster für Titel + Fach
 *   2) großes Fenster mit Rich-Text-Editor für den Inhalt
 *
 * `note` = null → neue Notiz; `startStep` = 2 springt beim Bearbeiten
 * direkt in den Inhalt (Details bleiben über den Zurück-Button erreichbar).
 */
export default function NoteModal({ note, subjects, onSave, onClose, startStep = 1 }) {
  const [step, setStep] = useState(startStep);
  const [title, setTitle] = useState(note?.title ?? '');
  const [subject, setSubject] = useState(note?.subject ?? '');
  // Alt-Notizen (reiner Text) werden beim Öffnen in HTML konvertiert
  const [content, setContent] = useState(toEditableHtml(note?.content ?? ''));

  const canContinue = title.trim().length > 0;

  const save = () => {
    if (!canContinue) return;
    onSave({
      ...(note ?? {}),
      title: title.trim(),
      subject: subject.trim() || 'Allgemein',
      content,
    });
    onClose();
  };

  const footer =
    step === 1 ? (
      <div className="flex justify-end gap-2">
        <NeonButton variant="ghost" onClick={onClose}>Abbrechen</NeonButton>
        <NeonButton disabled={!canContinue} onClick={() => setStep(2)}>
          Weiter zum Inhalt <ArrowRight size={15} />
        </NeonButton>
      </div>
    ) : (
      <div className="flex items-center justify-between gap-2">
        <NeonButton variant="ghost" onClick={() => setStep(1)}>
          <ArrowLeft size={15} /> Details
        </NeonButton>
        <NeonButton onClick={save}>Notiz speichern</NeonButton>
      </div>
    );

  return (
    <Modal
      title={
        step === 1
          ? note ? 'Notiz — Details' : 'Neue Notiz · Schritt 1/2'
          : `${title.trim() || 'Notiz'} — Inhalt`
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
              <label htmlFor="note-title" className="field-label">Titel</label>
              <input
                id="note-title"
                className="field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canContinue && setStep(2)}
                placeholder="z. B. Kurvendiskussion – Ablauf"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="note-subject" className="field-label">Fach</label>
              <input
                id="note-subject"
                className="field"
                list="subject-options"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="z. B. Analysis"
              />
              <datalist id="subject-options">
                {subjects.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.18 }}
            className="h-full"
          >
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Zusammenfassung, Formeln, Merksätze …"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
