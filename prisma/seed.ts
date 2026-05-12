import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.vote.deleteMany();

  await prisma.vote.createMany({
    data: [
      {
        slug: "keine-10-millionen-schweiz",
        titleDe: "Volksinitiative «Keine 10-Millionen-Schweiz! (Nachhaltigkeitsinitiative)»",
        descriptionDe:
          "Die Initiative verlangt, dass die ständige Wohnbevölkerung der Schweiz vor dem Jahr 2050 unter 10 Millionen Menschen bleibt. Überschreitet die Bevölkerung 9,5 Millionen vor 2050, müssen Bundesrat und Parlament Massnahmen ergreifen – insbesondere in den Bereichen Asyl und Familiennachzug.",
        officialUrl: "https://www.admin.ch/de/volksabstimmung-vom-14-juni-2026",
        infoUrl:
          "https://www.ch.ch/de/abstimmungen-und-wahlen/abstimmungen/volksabstimmmung-vom14-juni-2026/",
        voteDate: new Date("2026-06-14T00:00:00.000Z"),
      },
      {
        slug: "zivildienstgesetz",
        titleDe: "Referendum gegen die Änderung des Zivildienstgesetzes",
        descriptionDe:
          "Das Parlament will die Hürden für den Wechsel von der Armee zum Zivildienst erhöhen, damit Armee und Zivilschutz mehr Personal zur Verfügung haben. Neu müssen alle Zivildienstleistenden mindestens 150 Diensttage absolvieren. Gegen diese Änderung wurde das Referendum ergriffen.",
        officialUrl: "https://www.admin.ch/de/volksabstimmung-vom-14-juni-2026",
        infoUrl:
          "https://www.ch.ch/de/abstimmungen-und-wahlen/abstimmungen/volksabstimmmung-vom14-juni-2026/",
        voteDate: new Date("2026-06-14T00:00:00.000Z"),
      },
    ],
  });

  console.log("Seeded 2 votes for 14. Juni 2026");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
