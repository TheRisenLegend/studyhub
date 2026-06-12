# Study Hub

Ein persönliches Studiums-Dashboard für Wirtschaftsinformatik — eine einzige HTML-Datei, ohne Frameworks.

## Features

- **Dashboard** — Metriken, animierte Prüfungs-Countdown-Ringe, Quick-Add für To-Dos
- **Prüfungen** — Countdown-Ringe (SVG), Dringlichkeits-Badges, vergangene Prüfungen eingeklappt
- **To-Dos** — Kanban-Board (Offen / In Arbeit / Erledigt) mit Drag & Drop
- **Notizen** — Markdown-Rendering, Fach-Tags, Suche
- **Code-Snippets** — Sprachfilter, Copy-to-Clipboard
- **Fokus-Timer** — Pomodoro (25/5), mit Signalton und Browser-Benachrichtigung bei Ablauf

Alle Daten werden in `localStorage` gespeichert — kein Server nötig.

## Nutzung

Die aktuelle Version ist `Study Hub v3.html` — einfach im Browser öffnen. Fertig.

Für GitHub Pages: Datei in `index.html` umbenennen, dann ist die Seite unter `https://<username>.github.io/<repo>/` erreichbar.

Hinweis: Die Browser-Benachrichtigung fragt beim ersten Start des Timers nach Erlaubnis. Sie funktioniert nur, wenn die Seite über `http(s)` oder als lokale Datei im Browser läuft und Benachrichtigungen erlaubt sind.

## Technik

- Vanilla HTML / CSS / JavaScript, eine Datei
- Dark Theme (#0e0e12), Akzent Electric Indigo (#6B6EF9)
- Responsiv: Sidebar wird auf Mobilgeräten (< 768 px) zur Bottom-Tab-Bar
- localStorage-Keys: `exams`, `todos`, `notes`, `snippets`, `pomo`
