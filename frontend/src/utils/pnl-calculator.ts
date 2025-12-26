/**
 * Shared P&L calculation utility for frontend
 * This ensures consistent P&L calculation with the backend
 */

export type TradeDirection = 'BUY_LONG' | 'SELL_SHORT';

export interface PnLCalculationInput {
  tradeDirection: TradeDirection;
  avgBuyPrice: number;
  avgSellPrice: number;
  positionSize: number;
}

/**
 * Calculate P&L for a trade
 * 
 * For LONG positions: P&L = (sellPrice - buyPrice) × quantity
 * For SHORT positions: P&L = (sellPrice - buyPrice) × quantity
 * 
 * Note: Leverage is NOT multiplied into P&L - it's only used for capital calculation
 * 
 * @param input - Trade parameters for P&L calculation
 * @returns Calculated P&L value
 */
export function calculatePnL(input: PnLCalculationInput): number {
  const {
    tradeDirection,
    avgBuyPrice,
    avgSellPrice,
    positionSize,
  } = input;

  // Validate inputs
  if (avgBuyPrice < 0 || avgSellPrice < 0 || positionSize < 0) {
    throw new Error('Price and position size must be non-negative');
  }

  if (positionSize === 0) {
    return 0;
  }

  // Check for extreme values that could cause overflow
  if (avgBuyPrice > 1000000000 || avgSellPrice > 1000000000 || positionSize > 1000000000) {
    throw new Error('Input values are too large');
  }

  // Check for NaN or Infinity
  if (!isFinite(avgBuyPrice) || !isFinite(avgSellPrice) || !isFinite(positionSize)) {
    throw new Error('All input values must be finite numbers');
  }

  let pnl: number;

  if (tradeDirection === 'BUY_LONG') {
    // Long position: P&L = (sellPrice - buyPrice) * quantity
    pnl = (avgSellPrice - avgBuyPrice) * positionSize;
  } else if (tradeDirection === 'SELL_SHORT') {
    // Short position: P&L = (sellPrice - buyPrice) * quantity
    // For shorts, sellPrice is the initial sell price, buyPrice is the cover price
    pnl = (avgSellPrice - avgBuyPrice) * positionSize;
  } else {
    throw new Error(`Invalid trade direction: ${tradeDirection}`);
  }

  // Round to 2 decimal places for currency
  return Math.round(pnl * 100) / 100;
}