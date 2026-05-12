"use client";

interface SummaryData {
  contentDe: string;
  proSummary: string;
  conSummary: string;
  neutralSummary: string;
  generatedAt: string;
  argumentCount: number;
}

interface Props {
  summary: SummaryData | null;
  totalArgs: number;
  minRequired: number;
}

export default function SummaryPanel({ summary, totalArgs, minRequired }: Props) {
  if (!summary) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-gray-500 text-sm">
          Die KI-Zusammenfassung wird angezeigt, sobald mindestens{" "}
          <strong>{minRequired}</strong> Argumente eingereicht wurden.
        </p>
        <p className="mt-1 text-gray-400 text-xs">{totalArgs} von {minRequired} eingegangen</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-blue-900 leading-relaxed">{summary.contentDe}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs font-semibold text-emerald-700 mb-1">✅ Dafür-Argumente</p>
          <p className="text-xs text-emerald-800 leading-relaxed">{summary.proSummary}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-xs font-semibold text-red-700 mb-1">❌ Dagegen-Argumente</p>
          <p className="text-xs text-red-800 leading-relaxed">{summary.conSummary}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">🤔 Neutrale Stimmen</p>
          <p className="text-xs text-amber-800 leading-relaxed">{summary.neutralSummary}</p>
        </div>
      </div>

      <p className="text-right text-xs text-gray-400">
        Basierend auf {summary.argumentCount} Argumenten ·{" "}
        Zuletzt aktualisiert: {new Date(summary.generatedAt).toLocaleString("de-CH")}
      </p>
    </div>
  );
}
