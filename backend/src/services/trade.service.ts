import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import {
  CreateTradeDTO,
  UpdateTradeDTO,
  GetTradesQuery,
} from '../validators/trade.validator';
import { calculateTradeMetrics } from '../utils/pnl-calculator.util';
import { ProfileStatsService } from './profile-stats.service';

/**
 * Create a new trade with automatic P&L calculation
 */
export async function createTrade(userId: string, data: CreateTradeDTO) {
  // Calculate original capital from position size, price, and leverage
  const originalCapital = (data.positionSize * data.avgBuyPrice) / (data.leverage || 1);

  // Calculate P&L and P&L percentage
  const { pnl, pnlPercentage } = calculateTradeMetrics(
    {
      tradeDirection: data.tradeDirection,
      avgBuyPrice: data.avgBuyPrice,
      avgSellPrice: data.avgSellPrice,
      positionSize: data.positionSize,
      leverage: data.leverage || 1,
    },
    originalCapital
  );

  // Create trade in database
  const trade = await prisma.trade.create({
    data: {
      userId,
      tradeDate: new Date(data.tradeDate),
      entryTime: data.entryTime,
      exitTime: data.exitTime,
      tradeType: data.tradeType,
      instrument: data.instrument,
      tradeDirection: data.tradeDirection,
      optionType: data.optionType || null,
      avgBuyPrice: new Prisma.Decimal(data.avgBuyPrice),
      avgSellPrice: new Prisma.Decimal(data.avgSellPrice),
      positionSize: new Prisma.Decimal(data.positionSize),
      leverage: new Prisma.Decimal(data.leverage || 1),
      originalCapital: new Prisma.Decimal(originalCapital),
      baseCurrency: data.baseCurrency,
      pnl: new Prisma.Decimal(pnl),
      pnlPercentage: pnlPercentage ? new Prisma.Decimal(pnlPercentage) : null,
      emotionalState: data.emotionalState,
      isImpulsive: data.isImpulsive,
      initialNotes: data.initialNotes || null,
      
      // Pre-Trade Psychology & Planning
      setupConfidence: data.setupConfidence ?? null,
      marketCondition: data.marketCondition ?? null,
      timeOfDay: data.timeOfDay ?? null,
      newsImpact: data.newsImpact ?? null,
      strategy: data.strategy ?? null,
      riskRewardRatio: data.riskRewardRatio ? new Prisma.Decimal(data.riskRewardRatio) : null,
      stopLossPrice: data.stopLossPrice ? new Prisma.Decimal(data.stopLossPrice) : null,
      takeProfitPrice: data.takeProfitPrice ? new Prisma.Decimal(data.takeProfitPrice) : null,
      positionSizingReason: data.positionSizingReason ?? null,
      
      // Entry Decision
      entryTrigger: data.entryTrigger ?? null,
      hadHesitation: data.hadHesitation ?? null,
      deviatedFromPlan: data.deviatedFromPlan ?? null,
      deviationReason: data.deviationReason ?? null,
      
      // During Trade
      monitoringFrequency: data.monitoringFrequency ?? null,
      stressLevel: data.stressLevel ?? null,
      consideredEarlyExit: data.consideredEarlyExit ?? null,
      earlyExitReason: data.earlyExitReason ?? null,
      
      // Exit Decision
      exitReason: data.exitReason ?? null,
      exitSatisfaction: data.exitSatisfaction ?? null,
      wouldDoDifferently: data.wouldDoDifferently ?? null,
      
      // Post-Trade Reflection
      keyLesson: data.keyLesson ?? null,
      mistakesMade: data.mistakesMade ?? [],
      whatWentWell: data.whatWentWell ?? null,
      conditionsMatchExpectation: data.conditionsMatchExpectation ?? null,
      
      // Additional Context
      sessionQuality: data.sessionQuality ?? null,
      physicalState: data.physicalState ?? null,
      mentalState: data.mentalState ?? null,
      externalFactors: data.externalFactors ?? [],
    },
    include: {
      notes: true,
      screenshots: true,
    },
  });

  // Update user profile statistics
  await ProfileStatsService.updateUserStats(userId);

  return trade;
}

/**
 * Get trades with filtering and pagination
 */
export async function getTrades(userId: string, query: GetTradesQuery) {
  const {
    startDate,
    endDate,
    tradeType,
    baseCurrency,
    emotionalState,
    isImpulsive,
    sortBy,
    sortOrder,
    limit,
    offset,
  } = query;

  // Build where clause
  const where: Prisma.TradeWhereInput = {
    userId,
  };

  // Add date range filter
  if (startDate || endDate) {
    where.tradeDate = {};
    if (startDate) {
      where.tradeDate.gte = new Date(startDate);
    }
    if (endDate) {
      where.tradeDate.lte = new Date(endDate);
    }
  }

  // Add other filters
  if (tradeType) {
    where.tradeType = tradeType;
  }
  if (baseCurrency) {
    where.baseCurrency = baseCurrency;
  }
  if (emotionalState) {
    where.emotionalState = emotionalState;
  }
  if (isImpulsive !== undefined) {
    where.isImpulsive = isImpulsive;
  }

  // Build orderBy clause
  const orderBy: Prisma.TradeOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  // Execute query with pagination
  const [trades, total] = await Promise.all([
    prisma.trade.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      include: {
        notes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        screenshots: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    }),
    prisma.trade.count({ where }),
  ]);

  return {
    trades,
    total,
    limit,
    offset,
  };
}

/**
 * Get a single trade by ID with related statistics
 */
export async function getTradeById(userId: string, tradeId: string) {
  const trade = await prisma.trade.findFirst({
    where: {
      id: tradeId,
      userId,
    },
    include: {
      notes: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      screenshots: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!trade) {
    return null;
  }

  // Calculate related statistics
  const stats = await calculateTradeStatistics(userId, trade);

  return {
    ...trade,
    statistics: stats,
  };
}

/**
 * Calculate statistics related to a specific trade
 */
async function calculateTradeStatistics(userId: string, trade: any) {
  // Get all trades for the same instrument
  const instrumentTrades = await prisma.trade.findMany({
    where: {
      userId,
      instrument: trade.instrument,
    },
    select: {
      pnl: true,
    },
  });

  // Get all trades with the same emotional state
  const emotionalStateTrades = await prisma.trade.findMany({
    where: {
      userId,
      emotionalState: trade.emotionalState,
    },
    select: {
      pnl: true,
    },
  });

  // Get all trades of the same type
  const tradeTypeTrades = await prisma.trade.findMany({
    where: {
      userId,
      tradeType: trade.tradeType,
    },
    select: {
      pnl: true,
    },
  });

  // Calculate statistics for instrument
  const instrumentStats = {
    totalTrades: instrumentTrades.length,
    winningTrades: instrumentTrades.filter((t) => t.pnl.toNumber() > 0).length,
    winRate:
      instrumentTrades.length > 0
        ? (instrumentTrades.filter((t) => t.pnl.toNumber() > 0).length /
            instrumentTrades.length) *
          100
        : 0,
    avgPnL:
      instrumentTrades.length > 0
        ? instrumentTrades.reduce((sum, t) => sum + t.pnl.toNumber(), 0) /
          instrumentTrades.length
        : 0,
  };

  // Calculate statistics for emotional state
  const emotionalStateStats = {
    totalTrades: emotionalStateTrades.length,
    winningTrades: emotionalStateTrades.filter((t) => t.pnl.toNumber() > 0)
      .length,
    winRate:
      emotionalStateTrades.length > 0
        ? (emotionalStateTrades.filter((t) => t.pnl.toNumber() > 0).length /
            emotionalStateTrades.length) *
          100
        : 0,
    avgPnL:
      emotionalStateTrades.length > 0
        ? emotionalStateTrades.reduce((sum, t) => sum + t.pnl.toNumber(), 0) /
          emotionalStateTrades.length
        : 0,
  };

  // Calculate statistics for trade type
  const tradeTypeStats = {
    totalTrades: tradeTypeTrades.length,
    winningTrades: tradeTypeTrades.filter((t) => t.pnl.toNumber() > 0).length,
    winRate:
      tradeTypeTrades.length > 0
        ? (tradeTypeTrades.filter((t) => t.pnl.toNumber() > 0).length /
            tradeTypeTrades.length) *
          100
        : 0,
    avgPnL:
      tradeTypeTrades.length > 0
        ? tradeTypeTrades.reduce((sum, t) => sum + t.pnl.toNumber(), 0) /
          tradeTypeTrades.length
        : 0,
  };

  return {
    instrument: instrumentStats,
    emotionalState: emotionalStateStats,
    tradeType: tradeTypeStats,
  };
}

/**
 * Update a trade with P&L recalculation
 */
export async function updateTrade(
  userId: string,
  tradeId: string,
  data: UpdateTradeDTO
) {
  // First, get the existing trade
  const existingTrade = await prisma.trade.findFirst({
    where: {
      id: tradeId,
      userId,
    },
  });

  if (!existingTrade) {
    return null;
  }

  // Prepare update data
  const updateData: Prisma.TradeUpdateInput = {};

  // Update basic fields
  if (data.tradeDate !== undefined) {
    updateData.tradeDate = new Date(data.tradeDate);
  }
  if (data.entryTime !== undefined) {
    updateData.entryTime = data.entryTime;
  }
  if (data.exitTime !== undefined) {
    updateData.exitTime = data.exitTime;
  }
  if (data.tradeType !== undefined) {
    updateData.tradeType = data.tradeType;
  }
  if (data.instrument !== undefined) {
    updateData.instrument = data.instrument;
  }
  if (data.tradeDirection !== undefined) {
    updateData.tradeDirection = data.tradeDirection;
  }
  if (data.optionType !== undefined) {
    updateData.optionType = data.optionType;
  }
  if (data.emotionalState !== undefined) {
    updateData.emotionalState = data.emotionalState;
  }
  if (data.isImpulsive !== undefined) {
    updateData.isImpulsive = data.isImpulsive;
  }
  if (data.baseCurrency !== undefined) {
    updateData.baseCurrency = data.baseCurrency;
  }
  if (data.initialNotes !== undefined) {
    updateData.initialNotes = data.initialNotes;
  }
  
  // Update Pre-Trade Psychology & Planning fields
  if (data.setupConfidence !== undefined) {
    updateData.setupConfidence = data.setupConfidence;
  }
  if (data.marketCondition !== undefined) {
    updateData.marketCondition = data.marketCondition;
  }
  if (data.timeOfDay !== undefined) {
    updateData.timeOfDay = data.timeOfDay;
  }
  if (data.newsImpact !== undefined) {
    updateData.newsImpact = data.newsImpact;
  }
  if (data.strategy !== undefined) {
    updateData.strategy = data.strategy;
  }
  if (data.riskRewardRatio !== undefined) {
    updateData.riskRewardRatio = data.riskRewardRatio ? new Prisma.Decimal(data.riskRewardRatio) : null;
  }
  if (data.stopLossPrice !== undefined) {
    updateData.stopLossPrice = data.stopLossPrice ? new Prisma.Decimal(data.stopLossPrice) : null;
  }
  if (data.takeProfitPrice !== undefined) {
    updateData.takeProfitPrice = data.takeProfitPrice ? new Prisma.Decimal(data.takeProfitPrice) : null;
  }
  if (data.positionSizingReason !== undefined) {
    updateData.positionSizingReason = data.positionSizingReason;
  }
  
  // Update Entry Decision fields
  if (data.entryTrigger !== undefined) {
    updateData.entryTrigger = data.entryTrigger;
  }
  if (data.hadHesitation !== undefined) {
    updateData.hadHesitation = data.hadHesitation;
  }
  if (data.deviatedFromPlan !== undefined) {
    updateData.deviatedFromPlan = data.deviatedFromPlan;
  }
  if (data.deviationReason !== undefined) {
    updateData.deviationReason = data.deviationReason;
  }
  
  // Update During Trade fields
  if (data.monitoringFrequency !== undefined) {
    updateData.monitoringFrequency = data.monitoringFrequency;
  }
  if (data.stressLevel !== undefined) {
    updateData.stressLevel = data.stressLevel;
  }
  if (data.consideredEarlyExit !== undefined) {
    updateData.consideredEarlyExit = data.consideredEarlyExit;
  }
  if (data.earlyExitReason !== undefined) {
    updateData.earlyExitReason = data.earlyExitReason;
  }
  
  // Update Exit Decision fields
  if (data.exitReason !== undefined) {
    updateData.exitReason = data.exitReason;
  }
  if (data.exitSatisfaction !== undefined) {
    updateData.exitSatisfaction = data.exitSatisfaction;
  }
  if (data.wouldDoDifferently !== undefined) {
    updateData.wouldDoDifferently = data.wouldDoDifferently;
  }
  
  // Update Post-Trade Reflection fields
  if (data.keyLesson !== undefined) {
    updateData.keyLesson = data.keyLesson;
  }
  if (data.mistakesMade !== undefined) {
    updateData.mistakesMade = data.mistakesMade;
  }
  if (data.whatWentWell !== undefined) {
    updateData.whatWentWell = data.whatWentWell;
  }
  if (data.conditionsMatchExpectation !== undefined) {
    updateData.conditionsMatchExpectation = data.conditionsMatchExpectation;
  }
  
  // Update Additional Context fields
  if (data.sessionQuality !== undefined) {
    updateData.sessionQuality = data.sessionQuality;
  }
  if (data.physicalState !== undefined) {
    updateData.physicalState = data.physicalState;
  }
  if (data.mentalState !== undefined) {
    updateData.mentalState = data.mentalState;
  }
  if (data.externalFactors !== undefined) {
    updateData.externalFactors = data.externalFactors;
  }

  // Handle price and position updates (requires P&L recalculation)
  const needsPnLRecalculation =
    data.avgBuyPrice !== undefined ||
    data.avgSellPrice !== undefined ||
    data.positionSize !== undefined ||
    data.leverage !== undefined ||
    data.tradeDirection !== undefined;

  if (needsPnLRecalculation) {
    // Use updated values or fall back to existing values
    const avgBuyPrice = data.avgBuyPrice ?? existingTrade.avgBuyPrice.toNumber();
    const avgSellPrice =
      data.avgSellPrice ?? existingTrade.avgSellPrice.toNumber();
    const positionSize =
      data.positionSize ?? existingTrade.positionSize.toNumber();
    const leverage = data.leverage ?? existingTrade.leverage.toNumber();
    const tradeDirection = data.tradeDirection ?? existingTrade.tradeDirection;
    
    // Calculate original capital from position size, price, and leverage
    const originalCapital = (positionSize * avgBuyPrice) / leverage;

    // Recalculate P&L
    const { pnl, pnlPercentage } = calculateTradeMetrics(
      {
        tradeDirection,
        avgBuyPrice,
        avgSellPrice,
        positionSize,
        leverage,
      },
      originalCapital
    );

    // Update price and position fields
    if (data.avgBuyPrice !== undefined) {
      updateData.avgBuyPrice = new Prisma.Decimal(data.avgBuyPrice);
    }
    if (data.avgSellPrice !== undefined) {
      updateData.avgSellPrice = new Prisma.Decimal(data.avgSellPrice);
    }
    if (data.positionSize !== undefined) {
      updateData.positionSize = new Prisma.Decimal(data.positionSize);
    }
    if (data.leverage !== undefined) {
      updateData.leverage = new Prisma.Decimal(data.leverage);
    }

    // Update calculated fields
    updateData.originalCapital = new Prisma.Decimal(originalCapital);
    updateData.pnl = new Prisma.Decimal(pnl);
    updateData.pnlPercentage = pnlPercentage
      ? new Prisma.Decimal(pnlPercentage)
      : null;
  }

  // Update the trade
  const updatedTrade = await prisma.trade.update({
    where: {
      id: tradeId,
    },
    data: updateData,
    include: {
      notes: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      screenshots: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  // Update user profile statistics
  await ProfileStatsService.updateUserStats(userId);

  return updatedTrade;
}

/**
 * Delete a trade
 */
export async function deleteTrade(userId: string, tradeId: string) {
  // Verify ownership before deletion
  const trade = await prisma.trade.findFirst({
    where: {
      id: tradeId,
      userId,
    },
  });

  if (!trade) {
    return null;
  }

  // Delete the trade (cascade will handle notes and screenshots)
  await prisma.trade.delete({
    where: {
      id: tradeId,
    },
  });

  // Update user profile statistics
  await ProfileStatsService.updateUserStats(userId);

  return trade;
}

/**
 * Update AI insights for a trade
 */
export async function updateTradeAIInsights(
  tradeId: string,
  aiInsights: string,
  sentimentScore: number
) {
  const updatedTrade = await prisma.trade.update({
    where: {
      id: tradeId,
    },
    data: {
      aiInsights,
      sentimentScore: new Prisma.Decimal(sentimentScore),
    },
  });

  return updatedTrade;
}
