import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashIp } from "@/lib/hash";

const MAX_LENGTH = 500;
const DAILY_LIMIT = 3;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const vote = await prisma.vote.findFirst({ where: { OR: [{ id }, { slug: id }] } });
  if (!vote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const args = await prisma.argument.findMany({
    where: { voteId: vote.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, text: true, sentiment: true, createdAt: true },
  });

  return NextResponse.json(args);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const vote = await prisma.vote.findFirst({ where: { OR: [{ id }, { slug: id }] } });
  if (!vote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { text, sentiment } = body as { text: string; sentiment: string };

  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return NextResponse.json({ error: "Text zu kurz (min. 10 Zeichen)" }, { status: 400 });
  }
  if (!["PRO", "CON", "NEUTRAL"].includes(sentiment)) {
    return NextResponse.json({ error: "Ungültige Haltung" }, { status: 400 });
  }

  const cleanText = text.trim().slice(0, MAX_LENGTH);

  const rawIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const ipHash = hashIp(rawIp);

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const todayCount = await prisma.argument.count({
    where: { voteId: vote.id, ipHash, createdAt: { gte: since } },
  });
  if (todayCount >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: "Du hast heute schon genug Argumente eingereicht (Max. 3 pro Tag)" },
      { status: 429 }
    );
  }

  const arg = await prisma.argument.create({
    data: { voteId: vote.id, text: cleanText, sentiment, ipHash },
  });

  return NextResponse.json(arg, { status: 201 });
}
