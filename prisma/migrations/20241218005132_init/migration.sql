/*
  Warnings:

  - You are about to drop the column `genre` on the `Game` table. All the data in the column will be lost.
  - The primary key for the `Genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Genre` table. All the data in the column will be lost.
  - Added the required column `Gid` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Publisher" (
    "Pid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

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
    "priority" BOOLEAN DEFAULT false,
    CONSTRAINT "Game_PublisherId_fkey" FOREIGN KEY ("PublisherId") REFERENCES "Publisher" ("Pid") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Game_GenreId_fkey" FOREIGN KEY ("GenreId") REFERENCES "Genre" ("Gid") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("descripton", "editor", "id", "priority", "releaseDate", "title") SELECT "descripton", "editor", "id", "priority", "releaseDate", "title" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_Genre" (
    "Gid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);
INSERT INTO "new_Genre" ("name") SELECT "name" FROM "Genre";
DROP TABLE "Genre";
ALTER TABLE "new_Genre" RENAME TO "Genre";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
