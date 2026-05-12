import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

// Official arguments extracted from the Abstimmungsbüchlein (Bundesrat, June 14 2026)
const officialArguments: {
  voteSlug: string;
  sentiment: "PRO" | "CON" | "NEUTRAL";
  source: string;
  text: string;
}[] = [
  // ─── Vorlage 1: Nachhaltigkeitsinitiative ────────────────────────────────

  // PRO = Initiativkomitee (Ja zur Initiative)
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "PRO",
    source: "Initiativkomitee",
    text: "Sehr hohe Zuwanderung: Die Schweizer Bevölkerung wuchs in 12 Jahren um 1 Million. Aktuell kommen über 100 000 Personen pro Jahr hinzu – aus der EU, Drittstaaten und dem Asylsystem. Diese Entwicklung ist nicht nachhaltig.",
  },
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "PRO",
    source: "Initiativkomitee",
    text: "Wohnungsnot: Die Mieten werden immer teurer. Die meisten Schweizerinnen und Schweizer können sich kein Wohneigentum mehr leisten – obwohl viel mehr gebaut wird. Für die Wohnungsnot ist die massive Zuwanderung hauptverantwortlich.",
  },
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "PRO",
    source: "Initiativkomitee",
    text: "Natur und Landschaft unter Druck: Die Schweiz wird jeden Tag mehr zubetoniert. Grünflächen und Wiesen verschwinden. Natur und Ökologie sind unter Druck. Die Lebensqualität nimmt ab.",
  },
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "PRO",
    source: "Initiativkomitee",
    text: "Schule am Anschlag: Je mehr fremdsprachige Kinder in einer Schulklasse sind, desto tiefer ist das durchschnittliche Bildungsniveau. Ein Viertel der Schweizer Schulabgänger kann nicht richtig lesen.",
  },
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "PRO",
    source: "Initiativkomitee",
    text: "Zuwanderung verschärft Fachkräftemangel: 100 000 Zuwanderer brauchen zusätzlich 45 000 Wohnungen und 2200 Ärztinnen, Ärzte und Pflegende pro Jahr. Diese Endlosspirale ist nicht nachhaltig.",
  },
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "PRO",
    source: "Initiativkomitee",
    text: "Vernünftige Zuwanderung möglich: Die Initiative lässt weiterhin rund 40 000 Personen und Fachkräfte pro Jahr einwandern – aber begrenzt das Wachstum auf ein nachhaltiges Mass zum Schutz von Umwelt, Infrastruktur und Sozialversicherungen.",
  },

  // CON = Bundesrat und Parlament (Nein zur Initiative)
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "CON",
    source: "Bundesrat und Parlament",
    text: "Weniger Wohlstand: Schweizer Unternehmen und Spitäler sind auf ausländische Arbeitskräfte angewiesen. Eine Bevölkerungsbegrenzung würde die Rekrutierung aus der EU einschränken. Wirtschaft und Wohlstand der Schweiz würden leiden.",
  },
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "CON",
    source: "Bundesrat und Parlament",
    text: "Gesellschaftliche Probleme: Spitäler und Pflegeheime könnten alte und kranke Menschen nicht mehr wie gewohnt behandeln und pflegen. Auch das Baugewerbe und andere Branchen stünden vor grossen Problemen.",
  },
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "CON",
    source: "Bundesrat und Parlament",
    text: "Gefährdung der Bilateralen: Die Initiative gefährdet den bilateralen Weg mit der EU – der wichtigsten politischen und wirtschaftlichen Partnerin der Schweiz. Die Kündigung der Personenfreizügigkeit würde alle Bilateralen I automatisch aufheben.",
  },
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "CON",
    source: "Bundesrat und Parlament",
    text: "Weniger Sicherheit: Bei einem Ende der Schengen-Zusammenarbeit hätte die Schweiz keinen Zugang mehr zu europäischen Sicherheits- und Fahndungsdatenbanken. Das erschwert den Kampf gegen Kriminalität und Terrorismus.",
  },
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "CON",
    source: "Bundesrat und Parlament",
    text: "Mehr Asylgesuche und höhere Kosten: Ohne Dublin-Abkommen müsste die Schweiz mehr Asylverfahren durchführen. Bund und Kantone hätten jährliche Mehrkosten von mehreren hundert Millionen Franken.",
  },
  {
    voteSlug: "keine-10-millionen-schweiz",
    sentiment: "CON",
    source: "Bundesrat und Parlament",
    text: "Humanitäre Tradition gefährdet: Die Initiative könnte die Schweiz zwingen, internationale Menschenrechtsabkommen neu zu verhandeln oder zu kündigen. Das würde sie aussenpolitisch isolieren und ihre Glaubwürdigkeit in Frage stellen.",
  },

  // ─── Vorlage 2: Zivildienstgesetz ────────────────────────────────────────

  // PRO = Bundesrat und Parlament (Ja zur Änderung)
  {
    voteSlug: "zivildienstgesetz",
    sentiment: "PRO",
    source: "Bundesrat und Parlament",
    text: "Militärdienstpflicht gilt: Die Verfassung lässt keine freie Wahl zwischen Militär- und Zivildienst. Der Zivildienst ist nur für Personen, die aus Gewissensgründen keinen Militärdienst leisten können. Die Vorlage stärkt diesen Grundsatz.",
  },
  {
    voteSlug: "zivildienstgesetz",
    sentiment: "PRO",
    source: "Bundesrat und Parlament",
    text: "Späte Wechsel verhindern: Wer schon viele Militärdiensttage geleistet hat, beweist damit keinen starken Gewissenskonflikt mehr. Neu soll der Zivildienst mindestens 150 Tage dauern – das macht späte Wechsel unattraktiver.",
  },
  {
    voteSlug: "zivildienstgesetz",
    sentiment: "PRO",
    source: "Bundesrat und Parlament",
    text: "Besserstellungen beseitigen: Zivildienstpflichtige planen ihre Einsätze heute flexibler als im Militär. Medizinstudenten nutzen den Zivildienst beruflich vorteilhafter. Die Vorlage beseitigt diese unerwünschten Vorteile.",
  },
  {
    voteSlug: "zivildienstgesetz",
    sentiment: "PRO",
    source: "Bundesrat und Parlament",
    text: "Armeebestand sichern: Die Armee wird künftig nicht genug Fachkräfte haben, wenn weiterhin so viele gut ausgebildete Soldaten in den Zivildienst wechseln. Die Vorlage stellt sicher, dass die Armee langfristig über genügend Kader verfügt.",
  },

  // CON = Referendumskomitee (Nein zur Änderung)
  {
    voteSlug: "zivildienstgesetz",
    sentiment: "CON",
    source: "Referendumskomitee",
    text: "Schädlich und nutzlos: Der Bundesrat rechnet mit 40% weniger Zivildienstleistenden. Zivis arbeiten in Heimen, Spitälern, Schulen, im Umweltschutz und der Landwirtschaft. Ihr Fehlen schadet der Gesellschaft – ohne die Armee zu stärken.",
  },
  {
    voteSlug: "zivildienstgesetz",
    sentiment: "CON",
    source: "Referendumskomitee",
    text: "Gefährlich für die Sicherheit: Zivildienstleistende spielten in der Coronapandemie und bei der Betreuung ukrainischer Flüchtlinge eine wichtige Rolle. Weniger junge Menschen im Dienst an der Gesellschaft schadet unserem Milizsystem.",
  },
  {
    voteSlug: "zivildienstgesetz",
    sentiment: "CON",
    source: "Referendumskomitee",
    text: "Verfassungswidrig: Die Armee hat seit Jahren mehr Soldatinnen als erlaubt. Die Armeebestände sind nicht gefährdet. Die Vorlage diskriminiert Zivildienstleistende, bestraft sie für ihre Gewissensentscheidung und verletzt die Gewissensfreiheit.",
  },
  {
    voteSlug: "zivildienstgesetz",
    sentiment: "CON",
    source: "Referendumskomitee",
    text: "Salamitaktik: Die Vorlage ist nur der erste Schritt. Befürworter wollen die Gewissensprüfung wieder einführen und den Zivildienst letztlich abschaffen. Diese Entwicklung muss jetzt gestoppt werden.",
  },
];

async function main() {
  // Reset all data
  await prisma.summary.deleteMany();
  await prisma.argument.deleteMany();
  await prisma.vote.deleteMany();

  // Create votes
  const vote1 = await prisma.vote.create({
    data: {
      slug: "keine-10-millionen-schweiz",
      titleDe: "Volksinitiative «Keine 10-Millionen-Schweiz! (Nachhaltigkeitsinitiative)»",
      descriptionDe:
        "Die Initiative verlangt, dass die ständige Wohnbevölkerung der Schweiz vor dem Jahr 2050 unter 10 Millionen Menschen bleibt. Überschreitet die Bevölkerung 9,5 Millionen vor 2050, müssen Bundesrat und Parlament Massnahmen ergreifen – insbesondere in den Bereichen Asyl und Familiennachzug.",
      officialUrl: "https://www.admin.ch/de/volksabstimmung-vom-14-juni-2026",
      infoUrl: "https://www.ch.ch/de/abstimmungen-und-wahlen/abstimmungen/volksabstimmmung-vom14-juni-2026/",
      voteDate: new Date("2026-06-14T00:00:00.000Z"),
    },
  });

  const vote2 = await prisma.vote.create({
    data: {
      slug: "zivildienstgesetz",
      titleDe: "Referendum gegen die Änderung des Zivildienstgesetzes",
      descriptionDe:
        "Das Parlament will die Hürden für den Wechsel von der Armee zum Zivildienst erhöhen, damit Armee und Zivilschutz mehr Personal zur Verfügung haben. Neu müssen alle Zivildienstleistenden mindestens 150 Diensttage absolvieren. Gegen diese Änderung wurde das Referendum ergriffen.",
      officialUrl: "https://www.admin.ch/de/volksabstimmung-vom-14-juni-2026",
      infoUrl: "https://www.ch.ch/de/abstimmungen-und-wahlen/abstimmungen/volksabstimmmung-vom14-juni-2026/",
      voteDate: new Date("2026-06-14T00:00:00.000Z"),
    },
  });

  const voteMap: Record<string, string> = {
    "keine-10-millionen-schweiz": vote1.id,
    zivildienstgesetz: vote2.id,
  };

  // Insert official arguments
  for (const arg of officialArguments) {
    await prisma.argument.create({
      data: {
        voteId: voteMap[arg.voteSlug],
        text: arg.text,
        sentiment: arg.sentiment,
        ipHash: "abstimmungsbuechlein-official",
        isOfficial: true,
        source: arg.source,
      },
    });
  }

  const counts = officialArguments.reduce(
    (acc, a) => {
      acc[a.voteSlug] = (acc[a.voteSlug] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log(`✓ 2 Vorlagen erstellt`);
  console.log(`✓ ${officialArguments.length} offizielle Argumente aus dem Abstimmungsbüchlein importiert`);
  Object.entries(counts).forEach(([slug, n]) => console.log(`  → ${slug}: ${n} Argumente`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
