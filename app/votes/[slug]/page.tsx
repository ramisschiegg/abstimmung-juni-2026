"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Barometer from "@/components/Barometer";
import ArgumentForm from "@/components/ArgumentForm";
import SummaryPanel from "@/components/SummaryPanel";
import ArgumentList from "@/components/ArgumentList";

interface Vote {
  id: string;
  slug: string;
  titleDe: string;
  descriptionDe: string;
  officialUrl: string;
  infoUrl: string;
  voteDate: string;
  counts: { PRO: number; CON: number; NEUTRAL: number };
}

interface Argument {
  id: string;
  text: string;
  sentiment: "PRO" | "CON" | "NEUTRAL";
  createdAt: string;
}

interface SummaryData {
  contentDe: string;
  proSummary: string;
  conSummary: string;
  neutralSummary: string;
  generatedAt: string;
  argumentCount: number;
}

interface SummaryResponse {
  summary: SummaryData | null;
  totalArgs: number;
  minRequired: number;
}

export default function VotePage() {
  const { slug } = useParams<{ slug: string }>();
  const [vote, setVote] = useState<Vote | null>(null);
  const [args, setArgs] = useState<Argument[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [voteRes, argsRes, summaryRes] = await Promise.all([
      fetch(`/api/votes/${slug}`),
      fetch(`/api/votes/${slug}/arguments`),
      fetch(`/api/votes/${slug}/summary`),
    ]);
    if (!voteRes.ok) return;
    setVote(await voteRes.json());
    setArgs(await argsRes.json());
    setSummaryData(await summaryRes.json());
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-gray-400">
        <div className="text-4xl mb-3">⏳</div>
        <p>Lade Vorlage...</p>
      </div>
    );
  }

  if (!vote) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-gray-500">
        <p>Vorlage nicht gefunden.</p>
        <a href="/" className="mt-2 inline-block text-blue-600 hover:underline">
          ← Zurück zur Übersicht
        </a>
      </div>
    );
  }

  const total = vote.counts.PRO + vote.counts.CON + vote.counts.NEUTRAL;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <a href="/" className="text-sm text-blue-600 hover:underline">
        ← Alle Vorlagen
      </a>

      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-900 leading-snug">{vote.titleDe}</h1>
        <p className="text-sm text-gray-600 leading-relaxed">{vote.descriptionDe}</p>

        <div className="flex flex-wrap gap-2">
          <a
            href={vote.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-100 transition-colors"
          >
            🏛️ Offizieller Bundesrat-Link
          </a>
          <a
            href={vote.infoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
          >
            📋 ch.ch – Erklärung
          </a>
          <a
            href="https://www.srf.ch/news/abstimmungen-vom-14-6-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
          >
            📺 SRF Dossier
          </a>
        </div>
      </div>

      {/* Barometer */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Stimmungsbarometer</h2>
          <span className="text-xs text-gray-400">{total} Argumente</span>
        </div>
        <Barometer pro={vote.counts.PRO} con={vote.counts.CON} neutral={vote.counts.NEUTRAL} />
      </div>

      {/* AI Summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900">KI-Zusammenfassung</h2>
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700 font-medium">
            Claude Haiku
          </span>
        </div>
        {summaryData && (
          <SummaryPanel
            summary={summaryData.summary}
            totalArgs={summaryData.totalArgs}
            minRequired={summaryData.minRequired ?? 3}
          />
        )}
      </div>

      {/* Submit form */}
      <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3">
        <h2 className="font-semibold text-gray-900">Dein Argument einreichen</h2>
        <ArgumentForm
          voteSlug={vote.slug}
          onSubmitted={fetchAll}
        />
      </div>

      {/* Recent arguments */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Neueste Argumente</h2>
          <span className="text-xs text-gray-400">Letzte 50</span>
        </div>
        <ArgumentList args={args} />
      </div>
    </div>
  );
}
