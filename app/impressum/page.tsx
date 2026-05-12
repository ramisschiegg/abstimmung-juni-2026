import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum – Volksabstimmung 14. Juni 2026",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Impressum</h1>

      <section className="space-y-2 text-sm text-gray-700">
        <h2 className="font-semibold text-gray-900 text-base">Betreiber dieser Website</h2>
        {/* ⚠️  Fülle hier deine Kontaktdaten ein */}
        <p>
          Ramis Schiegg<br />
          Bahnhofstrasse 99J<br />
          8620 Wetzikon, Schweiz<br />
        </p>
        <p>
          E-Mail:{" "}
          <a href="mailto:ramis.schiegg@hotmail.com" className="text-blue-600 hover:underline">
            ramis.schiegg@hotmail.com
          </a>
        </p>
      </section>

      <section className="space-y-2 text-sm text-gray-700">
        <h2 className="font-semibold text-gray-900 text-base">Charakter dieser Website</h2>
        <p>
          Diese Website ist ein <strong>privates, nichtkommerzielles Bürgerprojekt</strong> ohne
          Verbindung zum Bund, zu Kantonen oder politischen Parteien. Sie steht in keinem
          Zusammenhang mit offiziellen Abstimmungskampagnen.
        </p>
        <p>
          Ziel ist es, eine neutrale Plattform für den Meinungsaustausch zu den eidgenössischen
          Volksabstimmungen vom 14. Juni 2026 bereitzustellen.
        </p>
      </section>

      <section className="space-y-2 text-sm text-gray-700">
        <h2 className="font-semibold text-gray-900 text-base">Haftungsausschluss</h2>
        <p>
          Der Betreiber übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit oder
          Aktualität der Inhalte. Die KI-generierten Zusammenfassungen sind automatisiert erstellt
          und können Fehler enthalten. Sie ersetzen nicht die Lektüre der offiziellen
          Abstimmungsunterlagen des Bundesrates.
        </p>
        <p>
          Nutzer sind selbst verantwortlich für die von ihnen eingereichten Argumente. Der
          Betreiber behält sich vor, rechtswidrige, beleidigende oder sachfremde Inhalte ohne
          Ankündigung zu entfernen.
        </p>
      </section>

      <section className="space-y-2 text-sm text-gray-700">
        <h2 className="font-semibold text-gray-900 text-base">Urheberrecht</h2>
        <p>
          Die offiziellen Argumente stammen aus den{" "}
          <em>Erläuterungen des Bundesrates zur Volksabstimmung vom 14. Juni 2026</em>,
          herausgegeben von der Bundeskanzlei (Redaktionsschluss: 13. März 2026). Diese sind
          gemeinfrei und dürfen mit Quellenangabe verwendet werden.
        </p>
        <p>
          Nutzer, die Argumente einreichen, räumen dem Betreiber das Recht ein, diese anonym
          und aggregiert auf der Website darzustellen und zur KI-Zusammenfassung zu verwenden.
        </p>
      </section>

      <section className="space-y-2 text-sm text-gray-700">
        <h2 className="font-semibold text-gray-900 text-base">Anwendbares Recht</h2>
        <p>
          Es gilt Schweizer Recht. Gerichtsstand ist der Wohnsitz des Betreibers.
        </p>
      </section>

      <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
        Letzte Aktualisierung: Mai 2026
      </p>
    </div>
  );
}
