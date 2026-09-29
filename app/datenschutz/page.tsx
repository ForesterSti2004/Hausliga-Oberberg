import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutz · Hausliga Oberberg" };

export default function Datenschutz() {
  return <main className="privacy-page container">
    <a className="next-link" href="/">← Zur Hausliga</a>
    <h1>Datenschutz</h1>
    <p>Hier erfährst du, welche Daten für die Ergebnisse der Hausliga Oberberg auf dieser Website verwendet werden und an wen du dich bei Fragen wenden kannst.</p>

    <h2>Verantwortlicher und Kontakt</h2>
    <p>Für die Veröffentlichung der Ligaergebnisse verantwortlich: Rene Schulze, <a href="mailto:forestersti2004@t-online.de">forestersti2004@t-online.de</a>.</p>

    <h2>Spielergebnisse</h2>
    <p>Für Spielplan, Ergebnistabellen, Bestenlisten, Finale und Saisonarchiv werden Namen, Mannschaften, Spieltage, Pinzahlen, Punkte und Platzierungen verarbeitet. In der Ergebniserfassung kann außerdem die Kategorie M/W für die Bestenlisten gespeichert werden. Die Seiten sind öffentlich zugänglich und können von Suchmaschinen gefunden werden.</p>
    <p>Die öffentliche Zuordnung von Namen zu Ergebnissen stützt sich auf die freiwillige Einwilligung der betroffenen Spieler (Art. 6 Abs. 1 Buchst. a DSGVO). Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft per E-Mail an die oben genannte Adresse widerrufen. Die Teilnahme an der Liga hängt nicht von deiner Zustimmung zur öffentlichen Namensnennung ab. Nach einem Widerruf entfernen oder anonymisieren wir die betreffenden Angaben auf dieser Website. Kopien bei Dritten oder in Suchmaschinen können wir nicht unmittelbar löschen.</p>
    <p>Die Ergebnisse bleiben während der laufenden Saison und im Saisonarchiv abrufbar, solange die Veröffentlichung gewünscht und für die Ligadokumentation erforderlich ist. Du kannst jederzeit um Auskunft, Berichtigung oder Entfernung deiner Angaben bitten.</p>

    <h2>Technischer Betrieb</h2>
    <p>Beim Aufruf der Website werden technisch notwendige Verbindungsdaten wie IP-Adresse, Zeitpunkt und aufgerufene Seite verarbeitet, damit die Website ausgeliefert und geschützt werden kann (Art. 6 Abs. 1 Buchst. f DSGVO). Die Website wird über Vercel bereitgestellt; Ergebnisse werden in einer Datenbank bei Supabase gespeichert. Beide Dienstleister verarbeiten dabei Daten, soweit dies für Hosting und Datenbankbetrieb erforderlich ist.</p>
    <p>Für die passwortgeschützte Ergebniseingabe wird nach erfolgreicher Anmeldung ein technisch notwendiges Sitzungscookie gesetzt. Es dient der Anmeldung und läuft spätestens nach zwölf Stunden ab.</p>

    <h2>Deine Rechte</h2>
    <p>Du kannst Auskunft über deine personenbezogenen Daten sowie gegebenenfalls Berichtigung, Löschung oder Einschränkung der Verarbeitung verlangen. Außerdem kannst du dich bei einer Datenschutzaufsichtsbehörde beschweren, beispielsweise bei der Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen. Schreib für Fragen oder einen Widerruf an <a href="mailto:forestersti2004@t-online.de">forestersti2004@t-online.de</a>.</p>
  </main>;
}
