/*
  Warnings:

  - You are about to drop the column `priority` on the `Game` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "descripton" TEXT,
    "releaseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "GenreId" INTEGER,
    "PublisherId" INTEGER,
    "editor" TEXT NOT NULL DEFAULT 'None',
    "Priority" BOOLEAN DEFAULT false,
    CONSTRAINT "Game_PublisherId_fkey" FOREIGN KEY ("PublisherId") REFERENCES "Publisher" ("Pid") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Game_GenreId_fkey" FOREIGN KEY ("GenreId") REFERENCES "Genre" ("Gid") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("GenreId", "PublisherId", "descripton", "editor", "id", "releaseDate", "title") SELECT "GenreId", "PublisherId", "descripton", "editor", "id", "releaseDate", "title" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
