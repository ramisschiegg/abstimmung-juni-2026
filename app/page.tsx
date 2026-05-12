import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function getVotesWithStats() {
  const votes = await prisma.vote.findMany({ orderBy: { createdAt: "asc" } });
  return Promise.all(
    votes.map(async (vote) => {
      const stats = await prisma.argument.groupBy({
        by: ["sentiment"],
        where: { voteId: vote.id },
        _count: true,
      });
      const counts = { PRO: 0, CON: 0, NEUTRAL: 0 };
      stats.forEach((s) => {
        if (s.sentiment in counts) counts[s.sentiment as keyof typeof counts] = s._count;
      });
      return { ...vote, counts };
    })
  );
}

function MiniBarometer({ pro, con, neutral }: { pro: number; con: number; neutral: number }) {
  const total = pro + con + neutral;
  if (total === 0) return <div className="h-2 rounded-full bg-gray-100" />;
  const pctPro = (pro / total) * 100;
  const pctNeutral = (neutral / total) * 100;
  const pctCon = (con / total) * 100;
  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full">
      <div className="bg-emerald-400 transition-all" style={{ width: `${pctPro}%` }} />
      <div className="bg-amber-300 transition-all" style={{ width: `${pctNeutral}%` }} />
      <div className="bg-red-400 transition-all" style={{ width: `${pctCon}%` }} />
    </div>
  );
}

export default async function HomePage() {
  const votes = await getVotesWithStats();
  const voteDate = new Date("2026-06-14");
  const daysLeft = Math.ceil((voteDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-sm font-medium text-red-700">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          Noch {daysLeft} Tage bis zur Abstimmung
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Volksabstimmung vom 14. Juni 2026
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Teile deine Argumente anonym. Eine KI fasst alle Bürgerstimmen zu einer öffentlichen
          Zusammenfassung zusammen — damit alle sehen, was die Bevölkerung denkt.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <a
            href="https://www.admin.ch/de/volksabstimmung-vom-14-juni-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
          >
            🏛️ Bundesrat – Offizielle Vorlagen
          </a>
          <a
            href="https://www.ch.ch/de/abstimmungen-und-wahlen/abstimmungen/volksabstimmmung-vom14-juni-2026/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
          >
            📋 ch.ch – Erklärungen für alle
          </a>
          <a
            href="https://www.srf.ch/news/abstimmungen-vom-14-6-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
          >
            📺 SRF – Abstimmungsdossier
          </a>
        </div>
      </div>

      {/* Vote cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {votes.map((vote) => {
          const total = vote.counts.PRO + vote.counts.CON + vote.counts.NEUTRAL;
          return (
            <Link
              key={vote.id}
              href={`/votes/${vote.slug}`}
              className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="space-y-3">
                <h2 className="font-semibold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-3">
                  {vote.titleDe}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2">{vote.descriptionDe}</p>

                <MiniBarometer
                  pro={vote.counts.PRO}
                  con={vote.counts.CON}
                  neutral={vote.counts.NEUTRAL}
                />

                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-3 text-gray-500">
                    <span className="text-emerald-600 font-medium">{vote.counts.PRO} Dafür</span>
                    <span className="text-amber-600 font-medium">{vote.counts.NEUTRAL} Neutral</span>
                    <span className="text-red-600 font-medium">{vote.counts.CON} Dagegen</span>
                  </div>
                  <span className="text-blue-600 font-medium group-hover:underline">
                    Mitmachen →
                  </span>
                </div>

                {total === 0 && (
                  <p className="text-xs text-gray-400">Sei der Erste, der ein Argument einreicht!</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* How it works */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">So funktioniert es</h2>
        <ol className="space-y-3 text-sm text-gray-600">
          {[
            ["📝", "Wähle eine Vorlage und reiche dein Argument ein (dafür, dagegen oder neutral)"],
            ["🤖", "Eine KI (Claude Haiku) fasst alle eingereichten Argumente regelmässig zusammen"],
            ["📊", "Das Barometer zeigt in Echtzeit, wie die Stimmung verteilt ist"],
            ["🔒", "Alles ist anonym — deine IP-Adresse wird nur als Hash gespeichert"],
          ].map(([icon, text], i) => (
            <li key={i} className="flex gap-3">
              <span className="text-lg shrink-0">{icon}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
