import { ArrowLeft } from 'lucide-react';
import GlassCard from '../ui/GlassCard.jsx';
import NeonButton from '../ui/NeonButton.jsx';

/**
 * Impressum + Datenschutzerklärung.
 *
 * !!! WICHTIG: Alle Platzhalter in [ECKIGEN KLAMMERN] müssen VOR dem
 * Veröffentlichen durch echte Angaben ersetzt werden. Diese Vorlage
 * ist eine Hilfestellung und ersetzt keine Rechtsberatung.
 */
const H2 = ({ children }) => (
  <h2 className="font-display text-lg font-semibold tracking-wide text-ink-hi">
    {children}
  </h2>
);

const H3 = ({ children }) => (
  <h3 className="mt-5 font-display text-sm font-semibold uppercase tracking-widest text-ink-mid">
    {children}
  </h3>
);

export default function LegalView({ onBack }) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <NeonButton variant="ghost" onClick={onBack}>
          <ArrowLeft size={15} /> Zurück
        </NeonButton>
      </div>



      {/* ----- Impressum ------------------------------------------------ */}
      <GlassCard className="space-y-3 p-6">
        <H2>Impressum</H2>
        <p className="text-sm leading-relaxed text-ink-mid">
          Angaben gemäß § 5 DDG:
        </p>
        <p className="text-sm leading-relaxed text-ink-hi">
          Sansal Ilgaz
          <br />
          Lechallee 34J
          <br />
          86399 Bobingen
          <br />
          Deutschland
        </p>
        <p className="text-sm leading-relaxed text-ink-mid">
          Kontakt: <span className="text-ink-hi">sansal.ilgaz@gmail.com</span>
        </p>
        <p className="text-sm leading-relaxed text-ink-mid">
          Verantwortlich im Sinne des § 18 Abs. 2 MStV: Sansal Ilgaz,
          Anschrift wie oben.
        </p>
      </GlassCard>

      {/* ----- Datenschutz ---------------------------------------------- */}
      <GlassCard className="p-6">
        <H2>Datenschutzerklärung</H2>

        <H3>1. Allgemeines</H3>
        <p className="mt-2 text-sm leading-relaxed text-ink-mid">
          Diese Website ist ein privates, nicht-kommerzielles Studienprojekt.
          Der Betreiber erhebt, speichert oder verarbeitet selbst keine
          personenbezogenen Daten der Besucher. Es gibt kein Tracking, keine
          Analyse-Tools, keine Werbung und keine Cookies.
        </p>

        <H3>2. Hosting über GitHub Pages</H3>
        <p className="mt-2 text-sm leading-relaxed text-ink-mid">
          Diese Website wird über GitHub Pages gehostet, einen Dienst der
          GitHub Inc., 88 Colin P. Kelly Jr St, San Francisco, CA 94107, USA.
          Beim Aufruf der Seite verarbeitet GitHub technisch notwendige Daten
          (insbesondere IP-Adressen in Server-Logfiles), um die Website
          bereitzustellen und die Sicherheit des Dienstes zu gewährleisten
          (Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO — berechtigtes
          Interesse am sicheren Betrieb). GitHub gibt an, nach dem EU-US Data
          Privacy Framework zertifiziert zu sein. Details:{' '}
          <a
            href="https://docs.github.com/de/site-policy/privacy-policies/github-privacy-statement"
            target="_blank"
            rel="noreferrer"
            className="text-neon-cyan underline underline-offset-4"
          >
            GitHub Privacy Statement
          </a>
          .
        </p>

        <H3>3. Lokale Speicherung (localStorage)</H3>
        <p className="mt-2 text-sm leading-relaxed text-ink-mid">
          Notizen, Snippets, Klausurtermine und To-Dos werden ausschließlich
          lokal im Browser des Nutzers gespeichert (localStorage). Diese Daten
          verlassen das Gerät nicht und werden weder an den Betreiber noch an
          Dritte übertragen. Sie können jederzeit über die Browserdaten
          gelöscht werden.
        </p>

        <H3>4. Rechte der betroffenen Personen</H3>
        <p className="mt-2 text-sm leading-relaxed text-ink-mid">
          Nach der DSGVO bestehen Rechte auf Auskunft, Berichtigung, Löschung,
          Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch
          sowie ein Beschwerderecht bei einer Aufsichtsbehörde. Da der
          Betreiber selbst keine personenbezogenen Daten verarbeitet, richten
          sich Anfragen zum Hosting an GitHub (siehe oben).
        </p>

        <H3>5. Haftung für Links</H3>
        <p className="mt-2 text-sm leading-relaxed text-ink-mid">
          Für Inhalte externer Links wird keine Haftung übernommen; dafür ist
          stets der jeweilige Anbieter verantwortlich.
        </p>

        <p className="mt-6 font-mono text-[11px] text-ink-low">
          Stand: Juni 2026
        </p>
      </GlassCard>
    </div>
  );
}
