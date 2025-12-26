-- CreateEnum
CREATE TYPE "TradingStyle" AS ENUM ('DAY_TRADER', 'SWING_TRADER', 'SCALPER', 'POSITION_TRADER', 'ALGORITHMIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "experienceLevel" "ExperienceLevel",
ADD COLUMN     "tradingStyle" "TradingStyle";
