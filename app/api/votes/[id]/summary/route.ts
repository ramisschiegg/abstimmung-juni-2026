import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSummary } from "@/lib/summarize";

const MIN_ARGS_FOR_SUMMARY = 3;
const REGENERATE_AFTER_NEW_ARGS = 5;
const THROTTLE_MS = 30 * 60 * 1000; // 30 minutes

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const vote = await prisma.vote.findFirst({ where: { OR: [{ id }, { slug: id }] } });
  if (!vote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const totalArgs = await prisma.argument.count({ where: { voteId: vote.id } });

  if (totalArgs < MIN_ARGS_FOR_SUMMARY) {
    return NextResponse.json({ summary: null, totalArgs, minRequired: MIN_ARGS_FOR_SUMMARY });
  }

  const latest = await prisma.summary.findFirst({
    where: { voteId: vote.id },
    orderBy: { generatedAt: "desc" },
  });

  const newArgsSinceLastSummary = latest ? totalArgs - latest.argumentCount : totalArgs;
  const timeSinceLastSummary = latest ? Date.now() - latest.generatedAt.getTime() : Infinity;
  const needsRegeneration =
    !latest ||
    (newArgsSinceLastSummary >= REGENERATE_AFTER_NEW_ARGS && timeSinceLastSummary > THROTTLE_MS);

  if (needsRegeneration) {
    try {
      const allArgs = await prisma.argument.findMany({
        where: { voteId: vote.id },
        select: { text: true, sentiment: true },
      });

      const pro = allArgs.filter((a) => a.sentiment === "PRO").map((a) => a.text);
      const con = allArgs.filter((a) => a.sentiment === "CON").map((a) => a.text);
      const neutral = allArgs.filter((a) => a.sentiment === "NEUTRAL").map((a) => a.text);

      const result = await generateSummary(vote.titleDe, pro, con, neutral);

      const summary = await prisma.summary.create({
        data: { voteId: vote.id, ...result, argumentCount: totalArgs },
      });

      return NextResponse.json({ summary, totalArgs });
    } catch (err) {
      console.error("Summary generation failed:", err);
      if (latest) return NextResponse.json({ summary: latest, totalArgs });
      return NextResponse.json({ error: "Summary generation failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ summary: latest, totalArgs });
}
