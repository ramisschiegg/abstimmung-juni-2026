"use client";

import { useState } from "react";

interface Props {
  voteSlug: string;
  onSubmitted: () => void;
}

const SENTIMENT_OPTIONS = [
  { value: "PRO", label: "Dafür", color: "emerald", emoji: "✅" },
  { value: "CON", label: "Dagegen", color: "red", emoji: "❌" },
  { value: "NEUTRAL", label: "Neutral / Unentschlossen", color: "amber", emoji: "🤔" },
];

export default function ArgumentForm({ voteSlug, onSubmitted }: Props) {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState<"PRO" | "CON" | "NEUTRAL">("PRO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/votes/${voteSlug}/arguments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sentiment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Fehler beim Einreichen");
      } else {
        setSuccess(true);
        setText("");
        onSubmitted();
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        {SENTIMENT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSentiment(opt.value as typeof sentiment)}
            className={`flex-1 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
              sentiment === opt.value
                ? opt.value === "PRO"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : opt.value === "CON"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-amber-400 bg-amber-50 text-amber-700"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            {opt.emoji} {opt.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Schreibe dein Argument hier... (min. 10 Zeichen, max. 500)"
          maxLength={500}
          rows={4}
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
        <span className="absolute bottom-2 right-3 text-xs text-gray-400">
          {text.length}/500
        </span>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700">
          Danke! Dein Argument wurde eingereicht.
        </p>
      )}

      <button
        type="submit"
        disabled={loading || text.trim().length < 10}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        {loading ? "Wird eingereicht..." : "Argument einreichen"}
      </button>

      <p className="text-center text-xs text-gray-400">
        Anonym · Max. 3 Argumente pro Tag · Deine IP-Adresse wird nur gehasht gespeichert
      </p>
    </form>
  );
}
