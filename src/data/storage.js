/**
 * =====================================================================
 * STORAGE-SERVICE — die einzige Stelle, an der Daten gelesen/geschrieben
 * werden. Aktuell: localStorage.
 *
 * >>> BACKEND SPÄTER ANBINDEN <<<
 * Wenn ihr irgendwann ein echtes Backend wollt (z. B. Supabase, Firebase
 * oder eine eigene REST-API), müsst ihr NUR diese Datei anfassen:
 *   1. loadCollection / saveCollection auf `async` umstellen und intern
 *      fetch()/SDK-Calls machen.
 *   2. In App.jsx den Hook useStoredState um einen Lade-useEffect
 *      erweitern (Kommentar dort markiert die Stelle).
 * Der Rest der App bleibt unverändert — sie kennt nur diese Funktionen.
 * =====================================================================
 */

const PREFIX = 'study-code-hub:';

/** Eindeutige ID (reicht völlig für eine Freundesgruppen-App). */
export function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Collection laden; beim allerersten Start werden Seed-Daten geschrieben. */
export function loadCollection(key, seed) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw !== null) return JSON.parse(raw);
  } catch (err) {
    console.error(`[storage] Konnte "${key}" nicht lesen:`, err);
  }
  saveCollection(key, seed);
  return seed;
}

/** Collection speichern. */
export function saveCollection(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error(`[storage] Konnte "${key}" nicht speichern:`, err);
  }
}

/* =====================================================================
 * SEED-DATEN — damit die App beim ersten Start direkt "lebt".
 * Kann alles gelöscht/überschrieben werden.
 *
 * Zeitstempel sind RELATIV zum echten ersten Start (Date.now() − x),
 * damit nirgends ein erfundenes festes Datum auftaucht. Alles, was
 * danach angelegt wird, bekommt in App.jsx ebenfalls die echte
 * Gerätezeit (Date.now()).
 * ===================================================================== */

const h = 3_600_000; // eine Stunde in ms
const now = Date.now();

/** 'YYYY-MM-DD' relativ zu heute — für To-Do-Beispieltermine. */
const inDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const SEED_EXAMS = [
  { id: 'ex-gbi', subject: 'GBI', date: '2026-06-25' },
  { id: 'ex-dia', subject: 'DIA', date: '2026-06-29' },
  { id: 'ex-ana', subject: 'Analysis', date: '2026-07-01' },
  { id: 'ex-bub', subject: 'BuB', date: '2026-07-07' },
  { id: 'ex-prog2', subject: 'Prog2', date: '2026-07-09' },
];

/* Notiz-Inhalte sind seit dem Rich-Text-Editor HTML.
   (Alte Plain-Text-Notizen werden beim Öffnen automatisch konvertiert.) */
export const SEED_NOTES = [
  {
    id: 'n-1',
    title: 'Partielle Integration – Rezept',
    subject: 'Analysis',
    content:
      `<p><b>Formel:</b> ∫ u·v′ dx = u·v − ∫ u′·v dx</p>` +
      `<p>Wahl von u nach <b>LIATE</b>: Logarithmus → Inverse → Algebraisch → Trigonometrisch → Exponentiell.<br>` +
      `Faustregel: u so wählen, dass es beim Ableiten einfacher wird.</p>` +
      `<p><b>Beispiel:</b> ∫ x·e<sup>x</sup> dx&nbsp;&nbsp;| u = x, v′ = e<sup>x</sup><br>` +
      `= x·e<sup>x</sup> − ∫ 1·e<sup>x</sup> dx&nbsp;&nbsp;| ∫ e<sup>x</sup> dx = e<sup>x</sup><br>` +
      `= <span style="color:#4ade80">e<sup>x</sup>·(x − 1) + C</span></p>`,
    updatedAt: now - 5 * h,
  },
  {
    id: 'n-2',
    title: 'BPMN: Gateways im Überblick',
    subject: 'GBI',
    content:
      `<ul>` +
      `<li><b style="color:#2dd9f5">XOR (×)</b>: exklusiv — genau <u>ein</u> ausgehender Pfad, Bedingung entscheidet.</li>` +
      `<li><b style="color:#a78bfa">AND (+)</b>: parallel — alle Pfade gleichzeitig, Join wartet auf alle.</li>` +
      `<li><b style="color:#4ade80">OR (○)</b>: inklusiv — ein oder mehrere Pfade, Join wartet auf alle aktivierten.</li>` +
      `</ul>` +
      `<p><b>Klausur-Klassiker:</b> Jedes öffnende Gateway braucht ein passendes schließendes (gleicher Typ!).</p>`,
    updatedAt: now - 22 * h,
  },
  {
    id: 'n-3',
    title: 'Buchungssatz-Grundmuster',
    subject: 'BuB',
    content:
      `<p>Immer: <b>Soll an Haben.</b></p>` +
      `<ul>` +
      `<li>Aktivkonto: Mehrung im Soll, Minderung im Haben.</li>` +
      `<li>Passivkonto: Mehrung im Haben, Minderung im Soll.</li>` +
      `</ul>` +
      `<p><b>Beispiel</b> Wareneinkauf auf Ziel:<br>` +
      `Wareneingang (Aufwand, Soll) an Verbindlichkeiten a. LL. (Passiv, Haben)</p>`,
    updatedAt: now - 49 * h,
  },
];

export const SEED_SNIPPETS = [
  {
    id: 's-1',
    title: 'Comparator mit Lambda & thenComparing',
    language: 'Java',
    subject: 'Prog2',
    description: 'Liste nach Alter sortieren, bei Gleichstand nach Name.',
    code:
      'List<Student> studis = new ArrayList<>(List.of(\n' +
      '    new Student("Lena", 23),\n' +
      '    new Student("Aziz", 21)));\n' +
      '\n' +
      '// Primär nach Alter, sekundär nach Name\n' +
      'studis.sort(Comparator.comparingInt(Student::getAlter)\n' +
      '                      .thenComparing(Student::getName));',
    updatedAt: now - 2 * h,
  },
  {
    id: 's-2',
    title: 'HashMap: merge & sauber iterieren',
    language: 'Java',
    subject: 'Prog2',
    description: 'merge() legt den Key bei Bedarf an und addiert sonst — spart das if.',
    code:
      'Map<String, Integer> punkte = new HashMap<>();\n' +
      'punkte.merge("GBI", 5, Integer::sum);\n' +
      'punkte.merge("GBI", 3, Integer::sum); // GBI -> 8\n' +
      '\n' +
      'for (Map.Entry<String, Integer> e : punkte.entrySet()) {\n' +
      '    System.out.println(e.getKey() + " -> " + e.getValue());\n' +
      '}',
    updatedAt: now - 26 * h,
  },
  {
    id: 's-3',
    title: 'equals & hashCode — Standard-Muster',
    language: 'Java',
    subject: 'Prog2',
    description: 'Der Klassiker fürs Live-Coding: beide IMMER zusammen überschreiben.',
    code:
      '@Override\n' +
      'public boolean equals(Object o) {\n' +
      '    if (this == o) return true;\n' +
      '    if (!(o instanceof Student)) return false;\n' +
      '    Student s = (Student) o;\n' +
      '    return alter == s.alter && Objects.equals(name, s.name);\n' +
      '}\n' +
      '\n' +
      '@Override\n' +
      'public int hashCode() {\n' +
      '    return Objects.hash(name, alter);\n' +
      '}',
    updatedAt: now - 70 * h,
  },
];

export const SEED_TODOS = [
  {
    id: 't-1',
    text: 'GBI: Altklausur 2024 komplett durchrechnen',
    due: inDays(3),
    done: false,
    createdAt: now - 3 * h,
  },
  {
    id: 't-2',
    text: 'DIA: Normalformen-Übersicht in Notiz packen',
    due: inDays(7),
    done: false,
    createdAt: now - 20 * h,
  },
  {
    id: 't-3',
    text: 'Karteikarten Prog2 anlegen',
    due: null,
    done: true,
    createdAt: now - 60 * h,
  },
];
