-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Argument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "voteId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Argument_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "Vote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Argument" ("createdAt", "id", "ipHash", "sentiment", "text", "voteId") SELECT "createdAt", "id", "ipHash", "sentiment", "text", "voteId" FROM "Argument";
DROP TABLE "Argument";
ALTER TABLE "new_Argument" RENAME TO "Argument";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
