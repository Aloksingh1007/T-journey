-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB NOT NULL,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_insights" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradeId" TEXT,
    "insightType" TEXT NOT NULL,
    "insightData" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION,
    "wasShown" BOOLEAN NOT NULL DEFAULT true,
    "wasHelpful" BOOLEAN,
    "userFeedback" TEXT,
    "actionTaken" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pattern_occurrences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "patternType" TEXT NOT NULL,
    "severity" DOUBLE PRECISION NOT NULL,
    "wasWarned" BOOLEAN NOT NULL DEFAULT false,
    "warningHeeded" BOOLEAN,
    "outcome" TEXT NOT NULL,
    "pnl" DECIMAL(18,2) NOT NULL,
    "emotionalState" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pattern_occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionEnd" TIMESTAMP(3),
    "duration" INTEGER,
    "pagesVisited" INTEGER NOT NULL DEFAULT 0,
    "tradesLogged" INTEGER NOT NULL DEFAULT 0,
    "insightsViewed" INTEGER NOT NULL DEFAULT 0,
    "deviceType" TEXT,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_aggregate_stats" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "totalTrades" INTEGER NOT NULL DEFAULT 0,
    "totalAIInsights" INTEGER NOT NULL DEFAULT 0,
    "totalPatterns" INTEGER NOT NULL DEFAULT 0,
    "avgWinRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgPnL" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "emotionDistribution" JSONB NOT NULL,
    "patternFrequency" JSONB NOT NULL,
    "topPatterns" JSONB NOT NULL,
    "insightEffectiveness" JSONB NOT NULL,

    CONSTRAINT "daily_aggregate_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feedbackType" TEXT NOT NULL,
    "rating" INTEGER,
    "message" TEXT NOT NULL,
    "context" JSONB,
    "status" TEXT NOT NULL DEFAULT 'new',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_events_userId_timestamp_idx" ON "analytics_events"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "analytics_events_eventType_timestamp_idx" ON "analytics_events"("eventType", "timestamp");

-- CreateIndex
CREATE INDEX "analytics_events_sessionId_idx" ON "analytics_events"("sessionId");

-- CreateIndex
CREATE INDEX "ai_insights_userId_insightType_idx" ON "ai_insights"("userId", "insightType");

-- CreateIndex
CREATE INDEX "ai_insights_insightType_timestamp_idx" ON "ai_insights"("insightType", "timestamp");

-- CreateIndex
CREATE INDEX "ai_insights_tradeId_idx" ON "ai_insights"("tradeId");

-- CreateIndex
CREATE INDEX "pattern_occurrences_userId_patternType_idx" ON "pattern_occurrences"("userId", "patternType");

-- CreateIndex
CREATE INDEX "pattern_occurrences_patternType_timestamp_idx" ON "pattern_occurrences"("patternType", "timestamp");

-- CreateIndex
CREATE INDEX "pattern_occurrences_tradeId_idx" ON "pattern_occurrences"("tradeId");

-- CreateIndex
CREATE INDEX "user_sessions_userId_sessionStart_idx" ON "user_sessions"("userId", "sessionStart");

-- CreateIndex
CREATE UNIQUE INDEX "daily_aggregate_stats_date_key" ON "daily_aggregate_stats"("date");

-- CreateIndex
CREATE INDEX "daily_aggregate_stats_date_idx" ON "daily_aggregate_stats"("date");

-- CreateIndex
CREATE INDEX "user_feedback_userId_timestamp_idx" ON "user_feedback"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "user_feedback_feedbackType_status_idx" ON "user_feedback"("feedbackType", "status");
