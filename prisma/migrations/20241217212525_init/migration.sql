-- AlterTable
ALTER TABLE "Game" ADD COLUMN "priority" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);
