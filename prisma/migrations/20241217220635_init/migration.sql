/*
  Warnings:

  - You are about to drop the column `name` on the `Game` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "descripton" TEXT,
    "releaseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genre" TEXT,
    "editor" TEXT NOT NULL DEFAULT 'None',
    "priority" BOOLEAN DEFAULT false
);
INSERT INTO "new_Game" ("descripton", "editor", "genre", "id", "priority", "releaseDate") SELECT "descripton", "editor", "genre", "id", "priority", "releaseDate" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
