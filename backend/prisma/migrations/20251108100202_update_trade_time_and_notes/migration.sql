/*
  Warnings:

  - You are about to drop the column `tradeTime` on the `trades` table. All the data in the column will be lost.
  - Added the required column `entryTime` to the `trades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exitTime` to the `trades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trades" DROP COLUMN "tradeTime",
ADD COLUMN     "entryTime" TEXT NOT NULL,
ADD COLUMN     "exitTime" TEXT NOT NULL,
ADD COLUMN     "initialNotes" TEXT;
