-- CreateEnum
CREATE TYPE "TradeType" AS ENUM ('CRYPTO', 'STOCK', 'FUTURES', 'OPTIONS', 'FUNDED_ACCOUNT');

-- CreateEnum
CREATE TYPE "TradeDirection" AS ENUM ('BUY_LONG', 'SELL_SHORT');

-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('CALL', 'PUT');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('INR', 'USD');

-- CreateEnum
CREATE TYPE "EmotionalState" AS ENUM ('CONFIDENT', 'FEARFUL', 'GREEDY', 'ANXIOUS', 'NEUTRAL', 'EXCITED', 'FRUSTRATED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trades" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradeDate" TIMESTAMP(3) NOT NULL,
    "tradeTime" TEXT NOT NULL,
    "tradeType" "TradeType" NOT NULL,
    "instrument" TEXT NOT NULL,
    "tradeDirection" "TradeDirection" NOT NULL,
    "optionType" "OptionType",
    "avgBuyPrice" DECIMAL(18,8) NOT NULL,
    "avgSellPrice" DECIMAL(18,8) NOT NULL,
    "positionSize" DECIMAL(18,8) NOT NULL,
    "leverage" DECIMAL(5,2) NOT NULL DEFAULT 1,
    "originalCapital" DECIMAL(18,2),
    "baseCurrency" "Currency" NOT NULL DEFAULT 'INR',
    "pnl" DECIMAL(18,2) NOT NULL,
    "pnlPercentage" DECIMAL(8,4),
    "emotionalState" "EmotionalState" NOT NULL,
    "isImpulsive" BOOLEAN NOT NULL DEFAULT false,
    "aiInsights" TEXT,
    "sentimentScore" DECIMAL(5,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screenshots" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screenshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "trades_userId_tradeDate_idx" ON "trades"("userId", "tradeDate");

-- CreateIndex
CREATE INDEX "trades_userId_baseCurrency_idx" ON "trades"("userId", "baseCurrency");

-- CreateIndex
CREATE INDEX "trades_userId_tradeType_idx" ON "trades"("userId", "tradeType");

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screenshots" ADD CONSTRAINT "screenshots_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
