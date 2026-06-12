import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';

/**
 * Fußzeile unter dem Inhalt: JSON-Backup (Export/Import) + Link auf
 * Impressum & Datenschutz.
 *
 * Warum Export/Import? localStorage ist GERÄTEGEBUNDEN — jeder im
 * Browser gespeicherte Stand existiert nur lokal. Mit dem Backup kann
 * man seine Daten sichern, aufs Handy mitnehmen oder der Lerngruppe
 * schicken (Datei exportieren → Freund importiert sie).
 */
export default function AppFooter({ data, onImport, onOpenLegal }) {
  const fileRef = useRef(null);

  const exportBackup = () => {
    const payload = {
      app: 'study-code-hub',
      version: 1,
      exportedAt: new Date().toISOString(),
      ...data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-code-hub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // gleiche Datei darf erneut gewählt werden
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (typeof parsed !== 'object' || parsed === null) throw new Error('kein Objekt');
      if (
        window.confirm(
          'Import ersetzt alle aktuellen Daten auf diesem Gerät. Fortfahren?'
        )
      ) {
        onImport(parsed);
      }
    } catch {
      window.alert('Datei konnte nicht gelesen werden — ist das ein Hub-Backup (.json)?');
    }
  };

  return (
    <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pb-2 pt-5 font-mono text-[11px] text-ink-low">
      <div className="flex items-center gap-1">
        <button
          onClick={exportBackup}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-white/5 hover:text-neon-cyan"
          title="Alle Daten als JSON-Datei sichern"
        >
          <Download size={13} /> Backup exportieren
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-white/5 hover:text-neon-cyan"
          title="Backup-Datei einspielen (ersetzt aktuelle Daten)"
        >
          <Upload size={13} /> importieren
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={importBackup}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      <button
        onClick={onOpenLegal}
        className="rounded-lg px-2 py-1 underline-offset-4 transition-colors hover:bg-white/5 hover:text-ink-hi hover:underline"
      >
        Impressum &amp; Datenschutz
      </button>
    </footer>
  );
}
