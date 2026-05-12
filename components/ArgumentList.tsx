"use client";

interface Argument {
  id: string;
  text: string;
  sentiment: "PRO" | "CON" | "NEUTRAL";
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

  return (
    <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
      {args.map((arg) => (
        <li
          key={arg.id}
          className={`rounded-lg border p-3 text-sm ${COLORS[arg.sentiment]}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`h-2 w-2 rounded-full ${LABELS[arg.sentiment].dot}`} />
            <span className="text-xs font-medium text-gray-600">{LABELS[arg.sentiment].text}</span>
            <span className="ml-auto text-xs text-gray-400">
              {new Date(arg.createdAt).toLocaleDateString("de-CH")}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">{arg.text}</p>
        </li>
      ))}
    </ul>
  );
}
