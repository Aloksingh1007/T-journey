import { TradeDirection } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Input interface for P&L calculation
 */
export interface PnLCalculationInput {
  tradeDirection: TradeDirection;
  avgBuyPrice: number | Decimal;
  avgSellPrice: number | Decimal;
  positionSize: number | Decimal;
  leverage?: number | Decimal;
}

/**
 * Input interface for P&L percentage calculation
 */
export interface PnLPercentageInput {
  pnl: number | Decimal;
  originalCapital: number | Decimal;
}

/**
 * Converts Decimal or number to number for calculations
 */
function toNumber(value: number | Decimal): number {
  if (value instanceof Decimal) {
    return value.toNumber();
  }
  return value;
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

  // Convert all values to numbers for calculation
  const buyPrice = toNumber(avgBuyPrice);
  const sellPrice = toNumber(avgSellPrice);
  const size = toNumber(positionSize);

  // Validate inputs
  if (buyPrice < 0 || sellPrice < 0 || size < 0) {
    throw new Error('Price and position size must be non-negative');
  }

  if (size === 0) {
    return 0;
  }

  // Check for extreme values that could cause overflow
  if (buyPrice > 1000000000 || sellPrice > 1000000000 || size > 1000000000) {
    throw new Error('Input values are too large');
  }

  // Check for NaN or Infinity
  if (!isFinite(buyPrice) || !isFinite(sellPrice) || !isFinite(size)) {
    throw new Error('All input values must be finite numbers');
  }

  let pnl: number;

  // P&L calculation based on trade direction
  if (tradeDirection === TradeDirection.BUY_LONG) {
    // Long position: P&L = (sellPrice - buyPrice) * quantity
    pnl = (sellPrice - buyPrice) * size;
  } else if (tradeDirection === TradeDirection.SELL_SHORT) {
    // Short position: P&L = (sellPrice - buyPrice) * quantity
    // Note: For shorts, sellPrice is the initial sell, buyPrice is the cover price
    pnl = (sellPrice - buyPrice) * size;
  } else {
    throw new Error(`Invalid trade direction: ${tradeDirection}`);
  }

  // Leverage is NOT multiplied into P&L - it's only for capital calculation

  // Round to 2 decimal places for currency
  return Math.round(pnl * 100) / 100;
}

/**
 * Calculate P&L percentage based on original capital
 * 
 * Formula: (P&L / originalCapital) * 100
 * 
 * @param input - P&L and original capital
 * @returns P&L percentage, or 0 if original capital is zero or undefined
 */
export function calculatePnLPercentage(input: PnLPercentageInput): number {
  const { pnl, originalCapital } = input;

  // Convert to numbers
  const pnlValue = toNumber(pnl);
  const capital = toNumber(originalCapital);

  // Handle edge cases
  if (capital === 0 || capital === null || capital === undefined) {
    return 0;
  }

  if (capital < 0) {
    throw new Error('Original capital cannot be negative');
  }

  // Calculate percentage
  const percentage = (pnlValue / capital) * 100;

  // Round to 4 decimal places for percentage
  return Math.round(percentage * 10000) / 10000;
}

/**
 * Calculate both P&L and P&L percentage in one call
 * 
 * @param tradeInput - Trade parameters
 * @param originalCapital - Optional original capital for percentage calculation
 * @returns Object containing both pnl and pnlPercentage
 */
export function calculateTradeMetrics(
  tradeInput: PnLCalculationInput,
  originalCapital?: number | Decimal
): { pnl: number; pnlPercentage: number | null } {
  const pnl = calculatePnL(tradeInput);

  let pnlPercentage: number | null = null;
  if (originalCapital !== undefined && originalCapital !== null) {
    pnlPercentage = calculatePnLPercentage({ pnl, originalCapital });
  }

  return { pnl, pnlPercentage };
}
