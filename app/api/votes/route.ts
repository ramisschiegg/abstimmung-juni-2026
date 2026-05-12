import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const votes = await prisma.vote.findMany({
    include: {
      _count: { select: { arguments: true } },
      summaries: {
        orderBy: { generatedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const result = await Promise.all(
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

  return NextResponse.json(result);
}
