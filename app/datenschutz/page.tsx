import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung – Volksabstimmung 14. Juni 2026",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8 text-sm text-gray-700">
      <h1 className="text-2xl font-bold text-gray-900">Datenschutzerklärung</h1>
      <p className="text-gray-500">
        Gemäss Art. 19 des Schweizer Bundesgesetzes über den Datenschutz (DSG, in Kraft seit
        1. September 2023) informieren wir dich wie folgt über die Bearbeitung deiner
        Personendaten.
      </p>

      {/* 1 */}
      <section className="space-y-2">
        <h2 className="font-semibold text-gray-900 text-base">1. Verantwortliche Person</h2>
        <p>
          Ramis Schiegg<br />
          [Strasse und Hausnummer], [PLZ Ort], Schweiz<br />
          E-Mail:{" "}
          <a href="mailto:ramis.schiegg@hotmail.com" className="text-blue-600 hover:underline">
            ramis.schiegg@hotmail.com
          </a>
        </p>
      </section>

      {/* 2 */}
      <section className="space-y-2">
        <h2 className="font-semibold text-gray-900 text-base">2. Welche Daten wir bearbeiten</h2>
        <div className="space-y-3">
          <div>
            <p className="font-medium text-gray-800">a) IP-Adresse (anonymisiert)</p>
            <p>
              Beim Einreichen eines Arguments wird deine IP-Adresse einmalig mit dem
              kryptografischen Verfahren SHA-256 gehasht und anschliessend auf die ersten 16
              Zeichen gekürzt. Die vollständige IP-Adresse wird <strong>nicht gespeichert</strong>.
              Der Hash dient ausschliesslich der Missbrauchsprävention (Rate-Limiting: max. 3
              Argumente pro Tag und IP).
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-800">b) Eingereichte Argumente (Text)</p>
            <p>
              Der von dir eingegebene Text wird zusammen mit deiner gewählten Haltung
              (Dafür / Dagegen / Neutral) und einem Zeitstempel in einer Datenbank gespeichert.
              Die Argumente sind <strong>vollständig anonym</strong> — es gibt keine Verbindung
              zwischen Text und Person.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-800">c) Server-Logs</p>
            <p>
              Der Webserver protokolliert standardmässig IP-Adressen, aufgerufene URLs,
              Browsertyp und Zeitstempel. Diese Logs dienen der technischen Fehleranalyse und
              werden nach spätestens 7 Tagen automatisch gelöscht.
            </p>
          </div>
        </div>
      </section>

      {/* 3 */}
      <section className="space-y-2">
        <h2 className="font-semibold text-gray-900 text-base">3. Zweck der Bearbeitung</h2>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Betrieb und Darstellung der Plattform</li>
          <li>Missbrauchsprävention (Rate-Limiting via IP-Hash)</li>
          <li>Automatische Zusammenfassung der Argumente mittels KI (siehe Ziff. 5)</li>
          <li>Technische Sicherheit und Fehlerdiagnose (Server-Logs)</li>
        </ul>
        <p>
          Es findet <strong>kein Profiling, kein Tracking und keine kommerzielle Nutzung</strong>{" "}
          deiner Daten statt.
        </p>
      </section>

      {/* 4 */}
      <section className="space-y-2">
        <h2 className="font-semibold text-gray-900 text-base">4. Speicherdauer</h2>
        <p>
          Eingereichte Argumente werden bis spätestens <strong>31. August 2026</strong>{" "}
          (ca. 10 Wochen nach der Abstimmung) aus der Datenbank gelöscht und danach nicht mehr
          aufbewahrt. IP-Hashes werden zusammen mit den Argumenten gelöscht. Server-Logs werden
          nach 7 Tagen automatisch überschrieben.
        </p>
      </section>

      {/* 5 */}
      <section className="space-y-2">
        <h2 className="font-semibold text-gray-900 text-base">5. Weitergabe an Dritte – Anthropic (KI-Zusammenfassung)</h2>
        <p>
          Zur automatischen Zusammenfassung der gesammelten Argumente werden diese{" "}
          <strong>anonymisiert und aggregiert</strong> an die API von{" "}
          <strong>Anthropic, PBC</strong> (San Francisco, USA) übertragen. Es werden dabei
          ausschliesslich die Argument-Texte gesendet — keine IP-Hashes, keine personenbezogenen
          Daten.
        </p>
        <p>
          Anthropic verarbeitet diese Daten gemäss seiner eigenen Datenschutzrichtlinie:{" "}
          <a
            href="https://www.anthropic.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            anthropic.com/privacy
          </a>
          . Anthropic speichert API-Daten gemäss seiner aktuellen Aufbewahrungsrichtlinien
          (in der Regel 30 Tage für Sicherheitszwecke, danach gelöscht).
        </p>
        <p>
          Die Übertragung in die USA erfolgt auf Basis von Standardvertragsklauseln (Art. 16
          Abs. 2 lit. d DSG). Es werden keine weiteren Daten an Dritte weitergegeben.
        </p>
      </section>

      {/* 6 */}
      <section className="space-y-2">
        <h2 className="font-semibold text-gray-900 text-base">6. Cookies und Tracking</h2>
        <p>
          Diese Website setzt <strong>keine Tracking-Cookies</strong> und verwendet{" "}
          <strong>kein Analytics-Tool</strong> (kein Google Analytics, kein Matomo o. Ä.).
          Es werden ausschliesslich technisch notwendige, temporäre Session-Daten durch den
          Browser verwendet, die beim Schliessen des Browsers automatisch gelöscht werden.
        </p>
      </section>

      {/* 7 */}
      <section className="space-y-2">
        <h2 className="font-semibold text-gray-900 text-base">7. Deine Rechte (Art. 25 ff. DSG)</h2>
        <p>Du hast das Recht auf:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>
            <strong>Auskunft</strong> darüber, welche Daten wir über dich bearbeiten
          </li>
          <li>
            <strong>Berichtigung</strong> unrichtiger Daten
          </li>
          <li>
            <strong>Löschung</strong> deiner Daten (soweit technisch möglich — eingereichte
            Argumente sind anonym, eine nachträgliche Zuordnung ist nicht möglich)
          </li>
          <li>
            <strong>Datenherausgabe</strong> in einem gängigen Format
          </li>
        </ul>
        <p>
          Für Anfragen wende dich an:{" "}
          <a href="mailto:ramis.schiegg@hotmail.com" className="text-blue-600 hover:underline">
            ramis.schiegg@hotmail.com
          </a>
        </p>
        <p>
          Du hast ausserdem das Recht, dich beim{" "}
          <a
            href="https://www.edoeb.admin.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB)
          </a>{" "}
          zu beschweren.
        </p>
      </section>

      {/* 8 */}
      <section className="space-y-2">
        <h2 className="font-semibold text-gray-900 text-base">8. Datensicherheit</h2>
        <p>
          Die Datenbank wird auf einem gesicherten Server in der Schweiz betrieben. Die
          Übertragung zwischen Browser und Server erfolgt verschlüsselt via HTTPS. IP-Adressen
          werden vor der Speicherung gehasht und können nicht rückgängig gemacht werden.
        </p>
      </section>

      {/* 9 */}
      <section className="space-y-2">
        <h2 className="font-semibold text-gray-900 text-base">9. Änderungen dieser Erklärung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die jeweils
          aktuelle Fassung gilt ab Veröffentlichung auf dieser Seite.
        </p>
      </section>

      <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
        Letzte Aktualisierung: Mai 2026 · Rechtsgrundlage: Bundesgesetz über den Datenschutz
        (DSG), SR 235.1, in Kraft seit 1. September 2023
      </p>
    </div>
  );
}
