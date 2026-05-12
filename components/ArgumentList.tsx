"use client";

interface Argument {
  id: string;
  text: string;
  sentiment: "PRO" | "CON" | "NEUTRAL";
  isOfficial?: boolean;
  source?: string | null;
  createdAt: string;
}

interface Props {
  args: Argument[];
}

const COLORS = {
  PRO: "border-emerald-200 bg-emerald-50",
  CON: "border-red-200 bg-red-50",
  NEUTRAL: "border-amber-200 bg-amber-50",
};

const OFFICIAL_COLORS = {
  PRO: "border-emerald-400 bg-emerald-50",
  CON: "border-red-400 bg-red-50",
  NEUTRAL: "border-amber-400 bg-amber-50",
};

const LABELS = {
  PRO: { text: "Dafür", dot: "bg-emerald-400" },
  CON: { text: "Dagegen", dot: "bg-red-400" },
  NEUTRAL: { text: "Neutral", dot: "bg-amber-400" },
};

export default function ArgumentList({ args }: Props) {
  if (args.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-6">
        Noch keine Argumente — sei der Erste!
      </p>
    );
  }

  // Official arguments first, then user arguments newest-first
  const sorted = [...args].sort((a, b) => {
    if (a.isOfficial && !b.isOfficial) return -1;
    if (!a.isOfficial && b.isOfficial) return 1;
    return 0;
  });

  return (
    <ul className="space-y-2 max-h-[32rem] overflow-y-auto pr-1">
      {sorted.map((arg) => (
        <li
          key={arg.id}
          className={`rounded-lg border px-3 py-2.5 text-sm ${
            arg.isOfficial ? OFFICIAL_COLORS[arg.sentiment] + " border-2" : COLORS[arg.sentiment]
          }`}
        >
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`h-2 w-2 rounded-full shrink-0 ${LABELS[arg.sentiment].dot}`} />
            <span className="text-xs font-medium text-gray-600">{LABELS[arg.sentiment].text}</span>

            {arg.isOfficial && arg.source && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-700">
                📋 {arg.source}
              </span>
            )}

            <span className="ml-auto text-xs text-gray-400">
              {arg.isOfficial
                ? "Abstimmungsbüchlein"
                : new Date(arg.createdAt).toLocaleDateString("de-CH")}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">{arg.text}</p>
        </li>
      ))}
    </ul>
  );
}
