import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const vote = await prisma.vote.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      summaries: { orderBy: { generatedAt: "desc" }, take: 1 },
    },
  });

  if (!vote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const stats = await prisma.argument.groupBy({
    by: ["sentiment"],
    where: { voteId: vote.id },
    _count: true,
  });

  const counts = { PRO: 0, CON: 0, NEUTRAL: 0 };
  stats.forEach((s) => {
    if (s.sentiment in counts) counts[s.sentiment as keyof typeof counts] = s._count;
  });

  return NextResponse.json({ ...vote, counts });
}
