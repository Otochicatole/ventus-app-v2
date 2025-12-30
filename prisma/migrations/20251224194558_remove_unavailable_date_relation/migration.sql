-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UnavailableDate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "locationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_UnavailableDate" ("createdAt", "date", "id", "locationId", "updatedAt") SELECT "createdAt", "date", "id", "locationId", "updatedAt" FROM "UnavailableDate";
DROP TABLE "UnavailableDate";
ALTER TABLE "new_UnavailableDate" RENAME TO "UnavailableDate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
