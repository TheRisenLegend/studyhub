import { useEffect, useRef } from 'react';
import {
  Bold, Italic, List, ListOrdered, Redo2,
  RemoveFormatting, Strikethrough, Underline, Undo2,
} from 'lucide-react';

/**
 * Schlanker Rich-Text-Editor für Notizen — bewusst "Word light":
 * Schriftgröße & -art, Fett/Kursiv/Unterstrichen/Durchgestrichen,
 * Listen, Textfarben, Undo/Redo, Formatierung entfernen.
 *
 * Technik: contentEditable + document.execCommand. execCommand ist
 * offiziell "deprecated", läuft aber in allen Browsern stabil und ist
 * für diesen Umfang die mit Abstand leichteste Lösung (keine Library,
 * kein Bundle-Gewicht). Gespeichert wird das innerHTML der Notiz.
 */
const SIZES = [
  ['2', 'Klein'],
  ['3', 'Normal'],
  ['5', 'Groß'],
  ['6', 'Riesig'],
];

const FONTS = [
  ['Manrope, sans-serif', 'Standard'],
  ["Georgia, 'Times New Roman', serif", 'Serif'],
  ["'JetBrains Mono', monospace", 'Mono'],
];

// Ink-Weiß + die vier Neon-Akzente + Amber als Marker-Ersatz
const COLORS = ['#e8eaf2', '#2dd9f5', '#a78bfa', '#4ade80', '#f472b6', '#fbbf24'];

export default function RichTextEditor({ value, onChange, placeholder = 'Inhalt …' }) {
  const ref = useRef(null);

  // Initialen Inhalt genau EINMAL setzen (danach führt der Browser),
  // sonst springt der Cursor bei jedem Tastendruck an den Anfang.
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => onChange(ref.current?.innerHTML ?? '');

  const exec = (cmd, val = null) => {
    ref.current?.focus();
    document.execCommand('styleWithCSS', false, true); // span+style statt <font>
    document.execCommand(cmd, false, val);
    emit();
  };

  // onMouseDown preventDefault → Textauswahl im Editor bleibt beim Klick erhalten
  const Btn = ({ icon: Icon, cmd, label }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => exec(cmd)}
      aria-label={label}
      title={label}
      className="rt-btn"
    >
      <Icon size={15} />
    </button>
  );

  return (
    <div className="flex h-full min-h-[50vh] flex-col">
      {/* Werkzeugleiste */}
      <div className="mb-3 flex flex-wrap items-center gap-1 rounded-xl border border-line bg-white/[0.03] px-2 py-1.5">
        <select
          className="rt-select"
          defaultValue="3"
          onChange={(e) => exec('fontSize', e.target.value)}
          aria-label="Schriftgröße"
        >
          {SIZES.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          className="rt-select"
          defaultValue={FONTS[0][0]}
          onChange={(e) => exec('fontName', e.target.value)}
          aria-label="Schriftart"
        >
          {FONTS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        <span className="rt-divider" aria-hidden="true" />
        <Btn icon={Bold} cmd="bold" label="Fett (Strg+B)" />
        <Btn icon={Italic} cmd="italic" label="Kursiv (Strg+I)" />
        <Btn icon={Underline} cmd="underline" label="Unterstrichen (Strg+U)" />
        <Btn icon={Strikethrough} cmd="strikeThrough" label="Durchgestrichen" />

        <span className="rt-divider" aria-hidden="true" />
        <Btn icon={List} cmd="insertUnorderedList" label="Stichpunkte" />
        <Btn icon={ListOrdered} cmd="insertOrderedList" label="Nummerierte Liste" />

        <span className="rt-divider" aria-hidden="true" />
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('foreColor', c)}
            aria-label={`Textfarbe ${c}`}
            title="Textfarbe"
            className="rt-swatch"
            style={{ background: c }}
          />
        ))}

        <span className="rt-divider" aria-hidden="true" />
        <Btn icon={Undo2} cmd="undo" label="Rückgängig (Strg+Z)" />
        <Btn icon={Redo2} cmd="redo" label="Wiederholen" />
        <Btn icon={RemoveFormatting} cmd="removeFormat" label="Formatierung entfernen" />
      </div>

      {/* Schreibfläche */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Notiz-Inhalt"
        data-placeholder={placeholder}
        onInput={emit}
        spellCheck
        className="rich-content rt-editor grow overflow-y-auto rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[15px] leading-relaxed text-ink-hi outline-none transition-colors focus:border-neon-violet/50"
      />
    </div>
  );
}
