# Änderungen · Lernvokabeln

## v1.4 — 18.08.2026
**Konto & Cloud-Sync (Phase 1).** Optional, offline-first, standardmäßig aus, wenn nicht konfiguriert.
- **Anmeldung per Magic-Link** (E-Mail, kein Passwort) über Supabase. Gmail-freundlich.
- **Fortschritt wird pro Konto gespeichert** und geräteübergreifend synchronisiert. Beim ersten
  Login wird der lokale Fortschritt hochgeladen und zusammengeführt (Last-Write-Wins pro Karte,
  über einen `ua`-Zeitstempel je Karte). Nichts geht verloren.
- Lokaler Speicher bleibt die Arbeitskopie; die Cloud ist nur ein Merge-Ziel. Ohne Netz oder
  ohne Login funktioniert alles wie in v1.3.
- Neuer „Konto“-Bildschirm; Supabase-Client wird lokal mitgeliefert (`vendor/`), damit die PWA
  offline lädt. Zugangsdaten in `config.js` (der publishable Key ist bewusst öffentlich; RLS schützt
  die Daten).
- Nächste Schritte (nicht in v1.4): „Sign in with Google“-Button, Klassen-Gruppen mit Beitrittscode
  und Bestenliste.

## Rebrand — 18.08.2026
- Neuer Name **Lernvokabeln** mit Bienen-Logo 🐝, eigene Domain **learnvokabeln.com**,
  eigenes öffentliches GitHub-Repo.
- Untertitel: „Kompass B2 DaF · Lektion 1–5“.
- Hell/Dunkel-Umschalter (☀️/🌙) oben neben der Serie; Design-Knopf unten entfernt.
- Fußzeile „Gebaut von karthikjp.io“ mittig; Versionsnummer im Scroll unter „Weitere Lektionen“.

## v1.3 — 17.08.2026
**Learn und Practice sind jetzt eine einzige Session.** Die Übungsform richtet sich nach dem
Lernstand des Wortes, nicht nach einem Modus, den man auswählt.

- **Adaptive Übungen** je nach Box:
  - Box 0–1: Karteikarte (wischen)
  - Box 2–3: Artikel antippen (Nomen) bzw. Bedeutung → Wort (Multiple Choice)
  - Box 4+: Wort tippen (Produktion)
- **Aktive Achse (`abox`)**: jedes Wort hat jetzt zwei Werte, passiv (erkennen) und aktiv
  (selbst produzieren). Ein Wort gilt erst als aktiv beherrscht, wenn du es selbst geschrieben hast.
  Forschung: passiver Wortschatz wächst von allein, aktiver fast gar nicht.
- **Produktion (neu)**: Prüfungsaufgabe im echten Format (Stellungnahme, Kurzvortrag, Beschwerde,
  Erörterung) mit vier Stichpunkten und sechs Zielwörtern. Der Text wird automatisch nach den
  Zielwörtern durchsucht; benutzte Wörter zählen auf die aktive Achse. Kein Backend nötig.
- **Session-Länge begrenzt** auf 15 Karten mit Fortschrittspunkten, damit eine Runde schaffbar ist.
- **Tagesziel** (20 Karten) mit Ring auf der Startseite.
- Rückgängig als **Toast** direkt nach der Antwort statt versteckter Button.
- Beispielsatz ist auf der Rückseite jetzt das Hauptelement, Übersetzung tritt zurück.
- `prefers-reduced-motion` wird respektiert.
- Statistik zeigt **passiv und aktiv getrennt**, pro Lektion.

## v1.2 — 17.08.2026
- **Lektion 5** ergänzt (Wetter, Meteorologie, Klimawandel), 158 Wörter → 712 insgesamt.
- **Fortschritt-Seite**: Mastery-Ring, Serie und beste Serie, Trefferquote, Aktivitäts-Heatmap,
  Fortschritt pro Lektion, letzte Lerntage. Alles lokal, kein Konto.
- Stabile Karten-IDs (`L{n}:{Abschnitt}:{Wort}`) statt Position im Deck, mit Migration.
  Damit übersteht der Fortschritt künftige Deck-Änderungen.
- Review-Log plus dauerhafte Tagesstatistik; Rückgängig setzt beides zurück.

## v1.1 — 17.08.2026
- Neue Wisch-Sounds: heller Dreiklang für „Kann ich“, weicher Fall für „Nochmal“.
- **Emoji-Anker** auf der Kartenrückseite (Tier 0), ca. 90 % der Wörter.
- Startseite scrollt korrekt; Design/Fortschritt/Version bleiben immer sichtbar.
- Hinweis „Weitere Lektionen kommen bald“ nach Lektion 4.

## v1.0 — 17.08.2026
- Erste Version: Wischkarten für Lektion 1–4 (554 Wörter) aus Kompass DaF B2.1.
- Artikel-Farbcode (der = blau, die = pink, das = grün), Artikel raten vor dem Umdrehen.
- Rückseite: deutsche Bedeutung, Englisch auf Knopfdruck, Beispielsatz, Kollokation aus dem Buch.
- Sprachausgabe (TTS), Leitner-Wiederholung in 5 Boxen, Serie, Offline-PWA.
