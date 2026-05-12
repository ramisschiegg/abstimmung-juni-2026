"use client";

interface BarometerProps {
  pro: number;
  con: number;
  neutral: number;
}

export default function Barometer({ pro, con, neutral }: BarometerProps) {
  const total = pro + con + neutral;

  if (total === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
        Noch keine Argumente eingereicht
      </div>
    );
  }

  const pctPro = Math.round((pro / total) * 100);
  const pctCon = Math.round((con / total) * 100);
  const pctNeutral = 100 - pctPro - pctCon;

  return (
    <div className="space-y-3">
      <div className="flex h-8 w-full overflow-hidden rounded-full shadow-inner bg-gray-100">
        {pctPro > 0 && (
          <div
            className="flex items-center justify-center bg-emerald-500 text-white text-xs font-bold transition-all duration-700"
            style={{ width: `${pctPro}%` }}
          >
            {pctPro >= 8 ? `${pctPro}%` : ""}
          </div>
        )}
        {pctNeutral > 0 && (
          <div
            className="flex items-center justify-center bg-amber-400 text-white text-xs font-bold transition-all duration-700"
            style={{ width: `${pctNeutral}%` }}
          >
            {pctNeutral >= 8 ? `${pctNeutral}%` : ""}
          </div>
        )}
        {pctCon > 0 && (
          <div
            className="flex items-center justify-center bg-red-500 text-white text-xs font-bold transition-all duration-700"
            style={{ width: `${pctCon}%` }}
          >
            {pctCon >= 8 ? `${pctCon}%` : ""}
          </div>
        )}
      </div>

      <div className="flex gap-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="font-semibold text-emerald-700">{pro}</span>
          <span className="text-gray-500">Dafür</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="font-semibold text-amber-700">{neutral}</span>
          <span className="text-gray-500">Neutral</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="font-semibold text-red-700">{con}</span>
          <span className="text-gray-500">Dagegen</span>
        </span>
        <span className="ml-auto text-gray-400">{total} Stimmen total</span>
      </div>
    </div>
  );
}
