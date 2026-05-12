# Handover: Volksabstimmung 14. Juni 2026

Dieses Dokument beschreibt alles, was ein neuer Agent (oder Entwickler) wissen muss, um
sofort weiterarbeiten zu können.

---

## Projekt-Übersicht

**Was ist das?**
Eine öffentliche Bürgerplattform für die zwei Schweizer Volksabstimmungen vom **14. Juni 2026**.
Nutzer reichen anonym Argumente ein (Pro / Dagegen / Neutral). Eine KI (Claude Haiku) fasst
alle Eingaben regelmässig zusammen. Ein Barometer zeigt die Stimmungsverteilung in Echtzeit.

**GitHub:** https://github.com/ramisschiegg/abstimmung-juni-2026

**Betreiber:** Ramis Schiegg, Bahnhofstrasse 99J, 8620 Wetzikon — ramis.schiegg@hotmail.com

---

## Tech-Stack

| Schicht | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Datenbank | SQLite via Prisma 5 (`prisma/abstimmung.db`) |
| ORM | Prisma 5.22.0 (NICHT v7 — wichtig, siehe unten) |
| KI | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) |
| Icons | SVG (app/icon.svg), ImageResponse für Apple/OG |
| Hosting | Noch nicht deployed — lokaler Server |

---

## Lokale Entwicklung

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. .env erstellen
cp .env.example .env
# ANTHROPIC_API_KEY eintragen

# 3. Datenbank migrieren + seeden
npx prisma migrate deploy
npx tsx prisma/seed.ts

# 4. Dev-Server starten (generiert Prisma-Client automatisch)
npm run dev
```

**Wichtig:** `npm run dev` führt automatisch `prisma generate` aus.
Das verhindert den häufigsten Fehler (veralteter generierter Client, siehe Stolpersteine).

---

## Dateistruktur

```
/app
  /api/votes/route.ts              – GET alle Vorlagen mit Statistiken
  /api/votes/[id]/route.ts         – GET einzelne Vorlage
  /api/votes/[id]/arguments/route.ts – GET/POST Argumente
  /api/votes/[id]/summary/route.ts  – GET KI-Zusammenfassung (mit Cache-Logik)
  /votes/[slug]/page.tsx           – Vote-Detailseite (Client Component)
  /impressum/page.tsx              – Impressum (rechtlich erforderlich)
  /datenschutz/page.tsx            – Datenschutzerklärung (DSG-konform)
  /icon.svg                        – Favicon (Schweizer Kreuz, SVG)
  /apple-icon.tsx                  – Apple Touch Icon 180×180
  /opengraph-image.tsx             – OG-Bild für Social Media 1200×630
  page.tsx                         – Startseite mit Vote-Cards
  layout.tsx                       – Root Layout mit Header + Footer

/components
  Barometer.tsx     – Pro/Neutral/Con Balkendiagramm
  ArgumentForm.tsx  – Einreichungsformular mit Validierung
  ArgumentList.tsx  – Listet Argumente (offizielle oben, Bürgerstimmen darunter)
  SummaryPanel.tsx  – KI-Zusammenfassung mit 3 Sektionen

/lib
  prisma.ts    – Prisma-Client Singleton
  hash.ts      – IP-Adresse → SHA-256 Hash (erste 16 Zeichen)
  summarize.ts – Anthropic API Call für Zusammenfassung

/prisma
  schema.prisma          – Datenbank-Schema (3 Models: Vote, Argument, Summary)
  seed.ts                – Seed: 2 Vorlagen + 20 offizielle Argumente
  abstimmung.db          – SQLite-Datei (NICHT im Git)
  /migrations/           – Migrationsverlauf
```

---

## Datenbank-Schema

```prisma
model Vote {
  id            String     @id @default(cuid())
  slug          String     @unique   // URL-Identifier
  titleDe       String
  descriptionDe String
  officialUrl   String               // Bundesrat admin.ch Link
  infoUrl       String               // ch.ch Link
  voteDate      DateTime
  arguments     Argument[]
  summaries     Summary[]
  createdAt     DateTime   @default(now())
}

model Argument {
  id         String   @id @default(cuid())
  voteId     String
  text       String                  // Max. 500 Zeichen
  sentiment  String                  // "PRO" | "CON" | "NEUTRAL"
  ipHash     String                  // SHA-256 Hash, 16 Zeichen
  isOfficial Boolean  @default(false) // true = aus Abstimmungsbüchlein
  source     String?                 // z.B. "Initiativkomitee", "Bundesrat"
  createdAt  DateTime @default(now())
}

model Summary {
  id             String   @id @default(cuid())
  voteId         String
  contentDe      String               // Gesamt-Zusammenfassung
  proSummary     String               // Pro-Argumente Summary
  conSummary     String               // Contra-Argumente Summary
  neutralSummary String               // Neutrale Stimmen Summary
  argumentCount  Int                  // Anzahl Argumente zum Zeitpunkt der Generierung
  generatedAt    DateTime @default(now())
}
```

---

## Die zwei Vorlagen (14. Juni 2026)

### Vorlage 1: Volksinitiative «Keine 10-Millionen-Schweiz!»
- **Slug:** `keine-10-millionen-schweiz`
- **Bundesrat-Empfehlung:** NEIN
- **Initiativkomitee-Empfehlung:** JA
- **Nationalrat:** 123 Nein / 67 Ja
- **Ständerat:** 30 Nein / 9 Ja
- Offizielle Argumente: 6× PRO (Initiativkomitee) + 6× CON (Bundesrat)

### Vorlage 2: Änderung des Zivildienstgesetzes
- **Slug:** `zivildienstgesetz`
- **Bundesrat-Empfehlung:** JA
- **Referendumskomitee-Empfehlung:** NEIN
- **Nationalrat:** 120 Ja / 76 Nein
- **Ständerat:** 33 Ja / 10 Nein
- Offizielle Argumente: 4× PRO (Bundesrat) + 4× CON (Referendumskomitee)
- Quelle: Erläuterungen des Bundesrates, Bundeskanzlei, Redaktionsschluss 13. März 2026

---

## Kern-Logik: Token-sparende KI-Zusammenfassung

Die Summary-Logik ist bewusst sparsam mit API-Calls:

**Wann wird NICHT neu generiert (Cached):**
- Es gibt noch keine 3 Argumente → `{ summary: null, totalArgs: X, minRequired: 3 }`
- Weniger als 5 neue Argumente seit letzter Generierung
- Letzte Generierung war vor weniger als 30 Minuten

**Wann wird neu generiert:**
- Noch gar keine Summary vorhanden UND mind. 3 Argumente
- ≥ 5 neue Argumente seit letzter Summary UND > 30 Minuten vergangen

**Was wird an die KI gesendet:**
- Max. 40 Argumente pro Sentiment-Bucket
- Max. 280 Zeichen pro Argument
- Modell: `claude-haiku-4-5-20251001` (günstigstes Modell)
- Max. 600 Output-Tokens
- Antwort: JSON mit 4 Feldern (`contentDe`, `proSummary`, `conSummary`, `neutralSummary`)

Relevant: `lib/summarize.ts`

---

## Rate-Limiting & Sicherheit

- **3 Argumente pro IP pro Tag** (24h-Fenster)
- IP-Adresse wird nie gespeichert — nur SHA-256 Hash, erste 16 Zeichen
- Hash-Salt via `process.env.IP_SALT` (fällt auf Default zurück falls nicht gesetzt)
- Argument-Text: min. 10 Zeichen, max. 500 Zeichen
- Offizielle Argumente (ipHash = `"abstimmungsbuechlein-official"`) werden beim Rate-Limit nicht mitgezählt (da schon vorhanden)

---

## Rechtliches (Schweizer DSG)

Die Website ist nach Schweizer DSG (Art. 19) rechtskonform:

| Seite | URL | Inhalt |
|---|---|---|
| Impressum | `/impressum` | Betreiber, Adresse, Haftungsausschluss |
| Datenschutz | `/datenschutz` | Datenbearbeitung, Anthropic-Transfer, Nutzerrechte |

**Datenschutz-relevante Punkte:**
- IP-Hashes → nur für Rate-Limiting, kein Tracking
- Text-Argumente → aggregiert an Anthropic für Summarization (USA-Transfer, SCCs)
- Keine Cookies, kein Analytics
- Datenlöschung geplant: 31. August 2026
- EDÖB-Beschwerderecht erwähnt: https://www.edoeb.admin.ch

---

## Bekannte Stolpersteine (wichtig!)

### 1. Prisma-Version: IMMER bei v5 bleiben
Prisma wurde während Entwicklung von v7 auf **v5.22.0** downgegradet.
**Grund:** Prisma 7 hat das `prisma-client-js` Generator-Format entfernt und erfordert
Adapter-Pattern (`@prisma/adapter-*`). Das würde die gesamte Datenbankschicht brechen.
- `package.json` zeigt: `"prisma": "^5.22.0"`, `"@prisma/client": "^5.22.0"`
- Bei `npm install` oder Upgrades aufpassen, nicht auf v7 upgraden

### 2. Prisma Generate nach Schema-Änderungen
Der generierte Client liegt in `app/generated/prisma/`.
Nach **jeder** Schema-Änderung muss `npx prisma generate` laufen, bevor der Dev-Server
gestartet wird. Andernfalls: `PrismaClientValidationError: Unknown field 'X'`.
→ Bereits in `package.json` integriert: `"dev": "prisma generate && next dev"`

### 3. Prisma 7 config (prisma.config.ts) entfernt
`prisma.config.ts` wurde gelöscht (war für Prisma 7 generiert worden).
Prisma 5 liest `DATABASE_URL` direkt aus `.env`. Diese Datei darf nicht neu erstellt werden.

### 4. Datenbankpfad
Die Datenbank heisst **`prisma/abstimmung.db`** (nicht `dev.db`).
Steht in `.env`: `DATABASE_URL="file:./prisma/abstimmung.db"`
Die `.db`-Dateien sind in `.gitignore` — nach jedem `git clone` muss neu migriert und
geseeded werden.

### 5. Prisma Import-Pfad im Seed
Der Seed importiert von `"../app/generated/prisma"` (nicht `/client`).
Das `/client`-File ist das neue Prisma-7-Format und funktioniert mit dem alten Runtime nicht.

### 6. Next.js App Router Params sind Promises
In Next.js 16 ist `params` in Route Handlers ein **Promise**:
```typescript
// Richtig:
export async function GET(_req, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
// Falsch (alte Syntax, gibt TypeScript-Fehler):
export async function GET(_req, { params: { id } }) { ... }
```

---

## Umgebungsvariablen

```bash
# .env (nicht im Git)
DATABASE_URL="file:./prisma/abstimmung.db"
ANTHROPIC_API_KEY="sk-ant-..."       # Pflicht für KI-Zusammenfassung
IP_SALT="change-me-in-production"    # Optional, empfohlen für Produktion
```

---

## Deployment-Checkliste (noch ausstehend)

- [ ] Server/Hosting wählen (SQLite → braucht persistentes Dateisystem, kein Serverless!)
      Empfehlung: VPS (Hetzner, Exoscale CH) oder Railway
      NICHT geeignet: Vercel (ephemeres Filesystem), Netlify
- [ ] `npm run build && npm start` auf Server
- [ ] `npx prisma migrate deploy` auf Server
- [ ] `npx tsx prisma/seed.ts` einmalig auf Server
- [ ] `IP_SALT` in Produktion auf sicheren Wert setzen
- [ ] HTTPS-Zertifikat (z.B. via Caddy oder nginx + Let's Encrypt)
- [ ] Regelmässiges Backup von `prisma/abstimmung.db`

---

## Mögliche nächste Schritte

- **Moderation:** Admin-Interface zum Löschen unangemessener Argumente
- **Mehrsprachigkeit:** FR/IT-Versionen (Felder `titleFr` etc. sind im Schema bereits vorbereitet)
- **E-Mail-Benachrichtigung:** Tägliche Summary per E-Mail versenden
- **Deployment:** Auf VPS deployen mit Caddy als Reverse Proxy
- **Backup-Cron:** Tägliches `cp prisma/abstimmung.db prisma/backup-$(date +%F).db`
- **Abstimmungsresultat:** Nach 14. Juni die Ergebnisse einblenden

---

## Offizielle Quellen

| Ressource | URL |
|---|---|
| Bundesrat Abstimmungsseite | https://www.admin.ch/de/volksabstimmung-vom-14-juni-2026 |
| ch.ch Erklärungen | https://www.ch.ch/de/abstimmungen-und-wahlen/abstimmungen/volksabstimmmung-vom14-juni-2026/ |
| SRF Dossier | https://www.srf.ch/news/abstimmungen-vom-14-6-2026 |
| EDÖB (Datenschutz) | https://www.edoeb.admin.ch |
| Abstimmungsbüchlein | `BAR_Erlaeuterungen_Juni_2026_de_v2.pdf` (im Projektordner) |
