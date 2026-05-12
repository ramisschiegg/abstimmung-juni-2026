import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Volksabstimmung 14. Juni 2026 – Bürgerstimmen",
  description:
    "Teile deine Argumente zu den Volksabstimmungen vom 14. Juni 2026. Eine KI fasst alle Stimmen zusammen.",
  openGraph: {
    title: "Volksabstimmung 14. Juni 2026",
    description: "Deine Meinung zählt – teile deine Argumente zu den Schweizer Volksabstimmungen",
    locale: "de_CH",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🇨🇭</span>
              <div>
                <div className="font-bold text-gray-900 leading-tight">Volksabstimmung</div>
                <div className="text-xs text-gray-500">14. Juni 2026</div>
              </div>
            </a>
            <div className="ml-auto">
              <a
                href="https://www.admin.ch/de/volksabstimmung-vom-14-juni-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                admin.ch → Offizielle Infos
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="mx-auto max-w-4xl px-4 py-6 text-center text-xs text-gray-400 space-y-1">
            <p>
              Offizielle Informationen:{" "}
              <a
                href="https://www.admin.ch/de/volksabstimmung-vom-14-juni-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                admin.ch
              </a>{" "}
              ·{" "}
              <a
                href="https://www.ch.ch/de/abstimmungen-und-wahlen/abstimmungen/volksabstimmmung-vom14-juni-2026/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                ch.ch
              </a>{" "}
              ·{" "}
              <a
                href="https://www.srf.ch/news/abstimmungen-vom-14-6-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                SRF Abstimmungen
              </a>
            </p>
            <p>Diese Website ist ein unabhängiges Bürger-Projekt. Kein offizieller Bundesauftrag.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
