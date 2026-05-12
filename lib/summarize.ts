import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_ARGS_PER_BUCKET = 40;
const MAX_CHARS_PER_ARG = 280;

export interface SummaryResult {
  contentDe: string;
  proSummary: string;
  conSummary: string;
  neutralSummary: string;
}

export async function generateSummary(
  voteTitle: string,
  proArgs: string[],
  conArgs: string[],
  neutralArgs: string[]
): Promise<SummaryResult> {
  const trim = (args: string[], max: number) =>
    args
      .slice(-max)
      .map((a) => a.slice(0, MAX_CHARS_PER_ARG).replace(/\n/g, " "))
      .join("\n- ");

  const proText = proArgs.length ? `- ${trim(proArgs, MAX_ARGS_PER_BUCKET)}` : "(keine Argumente)";
  const conText = conArgs.length ? `- ${trim(conArgs, MAX_ARGS_PER_BUCKET)}` : "(keine Argumente)";
  const neutralText = neutralArgs.length ? `- ${trim(neutralArgs, MAX_ARGS_PER_BUCKET)}` : "(keine Argumente)";

  const prompt = `Du fasst Bürgerargumente zur Schweizer Volksabstimmung zusammen.

Vorlage: ${voteTitle}

DAFÜR (${proArgs.length} Argumente):
${proText}

DAGEGEN (${conArgs.length} Argumente):
${conText}

NEUTRAL (${neutralArgs.length} Argumente):
${neutralText}

Antworte ausschliesslich als JSON (kein Markdown, kein Text davor/danach):
{
  "contentDe": "<2-3 Sätze Gesamtüberblick>",
  "proSummary": "<1-2 Sätze zu den wichtigsten Pro-Argumenten>",
  "conSummary": "<1-2 Sätze zu den wichtigsten Contra-Argumenten>",
  "neutralSummary": "<1 Satz zu neutralen/ambivalenten Stimmen>"
}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    system:
      "Du bist ein neutraler Schweizer Demokratie-Assistent. Du fasst Bürgermeinungen sachlich und ausgewogen zusammen. Antworte nur auf Deutsch.",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI response");
  return JSON.parse(jsonMatch[0]) as SummaryResult;
}
