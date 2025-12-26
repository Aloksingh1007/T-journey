import { z } from 'zod';

/**
 * Enum schemas matching Prisma enums
 */
export const TradeTypeSchema = z.enum([
  'CRYPTO',
  'STOCK',
  'FUTURES',
  'OPTIONS',
  'FUNDED_ACCOUNT',
]);

export const TradeDirectionSchema = z.enum(['BUY_LONG', 'SELL_SHORT']);

export const OptionTypeSchema = z.enum(['CALL', 'PUT']);

export const CurrencySchema = z.enum(['INR', 'USD']);

export const EmotionalStateSchema = z.enum([
  'CONFIDENT',
  'FEARFUL',
  'GREEDY',
  'ANXIOUS',
  'NEUTRAL',
  'EXCITED',
  'FRUSTRATED',
]);

/**
 * Time format validation (HH:MM)
 */
const timeFormatRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Create Trade DTO validation schema
 */
export const CreateTradeSchema = z
  .object({
    tradeDate: z.string().datetime({
      message: 'Trade date must be a valid ISO datetime string',
    }),
    entryTime: z
      .string()
      .regex(timeFormatRegex, 'Entry time must be in HH:MM format'),
    exitTime: z
      .string()
      .regex(timeFormatRegex, 'Exit time must be in HH:MM format'),
    tradeType: TradeTypeSchema,
    instrument: z
      .string()
      .min(1, 'Instrument name is required')
      .max(100, 'Instrument name must be less than 100 characters')
      .regex(/^[a-zA-Z0-9\s\-_\/\.]+$/, 'Instrument name contains invalid characters'),
    tradeDirection: TradeDirectionSchema,
    optionType: OptionTypeSchema.optional(),
    avgBuyPrice: z
      .number()
      .positive('Average buy price must be positive')
      .finite('Average buy price must be a finite number')
      .max(1000000000, 'Average buy price cannot exceed 1 billion'),
    avgSellPrice: z
      .number()
      .positive('Average sell price must be positive')
      .finite('Average sell price must be a finite number')
      .max(1000000000, 'Average sell price cannot exceed 1 billion'),
    positionSize: z
      .number()
      .positive('Position size must be positive')
      .finite('Position size must be a finite number')
      .max(1000000000, 'Position size cannot exceed 1 billion'),
    leverage: z
      .number()
      .min(1, 'Leverage must be at least 1')
      .max(100, 'Leverage cannot exceed 100')
      .finite('Leverage must be a finite number')
      .optional()
      .default(1),
    baseCurrency: CurrencySchema.default('INR'),
    emotionalState: EmotionalStateSchema,
    isImpulsive: z.boolean().default(false),
    initialNotes: z.string().max(2000, 'Notes must be less than 2000 characters').optional(),
    
    // Pre-Trade Psychology & Planning
    setupConfidence: z
      .number()
      .int('Setup confidence must be an integer')
      .min(1, 'Setup confidence must be at least 1')
      .max(10, 'Setup confidence cannot exceed 10')
      .optional(),
    marketCondition: z
      .string()
      .max(100, 'Market condition must be less than 100 characters')
      .optional(),
    timeOfDay: z
      .string()
      .max(100, 'Time of day must be less than 100 characters')
      .optional(),
    newsImpact: z
      .string()
      .max(100, 'News impact must be less than 100 characters')
      .optional(),
    strategy: z
      .string()
      .max(100, 'Strategy must be less than 100 characters')
      .optional(),
    riskRewardRatio: z
      .number()
      .positive('Risk reward ratio must be positive')
      .finite('Risk reward ratio must be a finite number')
      .optional(),
    stopLossPrice: z
      .number()
      .positive('Stop loss price must be positive')
      .finite('Stop loss price must be a finite number')
      .optional(),
    takeProfitPrice: z
      .number()
      .positive('Take profit price must be positive')
      .finite('Take profit price must be a finite number')
      .optional(),
    positionSizingReason: z
      .string()
      .max(500, 'Position sizing reason must be less than 500 characters')
      .optional(),
    
    // Entry Decision
    entryTrigger: z
      .string()
      .max(200, 'Entry trigger must be less than 200 characters')
      .optional(),
    hadHesitation: z.boolean().optional(),
    deviatedFromPlan: z.boolean().optional(),
    deviationReason: z
      .string()
      .max(1000, 'Deviation reason must be less than 1000 characters')
      .optional(),
    
    // During Trade
    monitoringFrequency: z
      .string()
      .max(100, 'Monitoring frequency must be less than 100 characters')
      .optional(),
    stressLevel: z
      .number()
      .int('Stress level must be an integer')
      .min(1, 'Stress level must be at least 1')
      .max(10, 'Stress level cannot exceed 10')
      .optional(),
    consideredEarlyExit: z.boolean().optional(),
    earlyExitReason: z
      .string()
      .max(1000, 'Early exit reason must be less than 1000 characters')
      .optional(),
    
    // Exit Decision
    exitReason: z
      .string()
      .max(200, 'Exit reason must be less than 200 characters')
      .optional(),
    exitSatisfaction: z
      .number()
      .int('Exit satisfaction must be an integer')
      .min(1, 'Exit satisfaction must be at least 1')
      .max(10, 'Exit satisfaction cannot exceed 10')
      .optional(),
    wouldDoDifferently: z
      .string()
      .max(1000, 'Would do differently must be less than 1000 characters')
      .optional(),
    
    // Post-Trade Reflection
    keyLesson: z
      .string()
      .max(1000, 'Key lesson must be less than 1000 characters')
      .optional(),
    mistakesMade: z
      .array(z.string().max(200, 'Each mistake must be less than 200 characters'))
      .optional(),
    whatWentWell: z
      .string()
      .max(1000, 'What went well must be less than 1000 characters')
      .optional(),
    conditionsMatchExpectation: z.boolean().optional(),
    
    // Additional Context
    sessionQuality: z
      .number()
      .int('Session quality must be an integer')
      .min(1, 'Session quality must be at least 1')
      .max(10, 'Session quality cannot exceed 10')
      .optional(),
    physicalState: z
      .string()
      .max(100, 'Physical state must be less than 100 characters')
      .optional(),
    mentalState: z
      .string()
      .max(100, 'Mental state must be less than 100 characters')
      .optional(),
    externalFactors: z
      .array(z.string().max(200, 'Each external factor must be less than 200 characters'))
      .optional(),
  })
  .refine(
    (data) => {
      // If trade type is OPTIONS, optionType must be provided
      if (data.tradeType === 'OPTIONS' && !data.optionType) {
        return false;
      }
      return true;
    },
    {
      message: 'Option type is required for OPTIONS trades',
      path: ['optionType'],
    }
  );

/**
 * Update Trade DTO validation schema
 * All fields are optional for partial updates
 */
export const UpdateTradeSchema = z
  .object({
    tradeDate: z
      .string()
      .datetime({
        message: 'Trade date must be a valid ISO datetime string',
      })
      .optional(),
    entryTime: z
      .string()
      .regex(timeFormatRegex, 'Entry time must be in HH:MM format')
      .optional(),
    exitTime: z
      .string()
      .regex(timeFormatRegex, 'Exit time must be in HH:MM format')
      .optional(),
    tradeType: TradeTypeSchema.optional(),
    instrument: z
      .string()
      .min(1, 'Instrument name is required')
      .max(100, 'Instrument name must be less than 100 characters')
      .regex(/^[a-zA-Z0-9\s\-_\/\.]+$/, 'Instrument name contains invalid characters')
      .optional(),
    tradeDirection: TradeDirectionSchema.optional(),
    optionType: OptionTypeSchema.optional().nullable(),
    avgBuyPrice: z
      .number()
      .positive('Average buy price must be positive')
      .finite('Average buy price must be a finite number')
      .max(1000000000, 'Average buy price cannot exceed 1 billion')
      .optional(),
    avgSellPrice: z
      .number()
      .positive('Average sell price must be positive')
      .finite('Average sell price must be a finite number')
      .max(1000000000, 'Average sell price cannot exceed 1 billion')
      .optional(),
    positionSize: z
      .number()
      .positive('Position size must be positive')
      .finite('Position size must be a finite number')
      .max(1000000000, 'Position size cannot exceed 1 billion')
      .optional(),
    leverage: z
      .number()
      .min(1, 'Leverage must be at least 1')
      .max(100, 'Leverage cannot exceed 100')
      .finite('Leverage must be a finite number')
      .optional(),
    baseCurrency: CurrencySchema.optional(),
    emotionalState: EmotionalStateSchema.optional(),
    isImpulsive: z.boolean().optional(),
    initialNotes: z.string().max(2000, 'Notes must be less than 2000 characters').optional(),
    
    // Pre-Trade Psychology & Planning
    setupConfidence: z
      .number()
      .int('Setup confidence must be an integer')
      .min(1, 'Setup confidence must be at least 1')
      .max(10, 'Setup confidence cannot exceed 10')
      .optional(),
    marketCondition: z
      .string()
      .max(100, 'Market condition must be less than 100 characters')
      .optional(),
    timeOfDay: z
      .string()
      .max(100, 'Time of day must be less than 100 characters')
      .optional(),
    newsImpact: z
      .string()
      .max(100, 'News impact must be less than 100 characters')
      .optional(),
    strategy: z
      .string()
      .max(100, 'Strategy must be less than 100 characters')
      .optional(),
    riskRewardRatio: z
      .number()
      .positive('Risk reward ratio must be positive')
      .finite('Risk reward ratio must be a finite number')
      .optional(),
    stopLossPrice: z
      .number()
      .positive('Stop loss price must be positive')
      .finite('Stop loss price must be a finite number')
      .optional(),
    takeProfitPrice: z
      .number()
      .positive('Take profit price must be positive')
      .finite('Take profit price must be a finite number')
      .optional(),
    positionSizingReason: z
      .string()
      .max(500, 'Position sizing reason must be less than 500 characters')
      .optional(),
    
    // Entry Decision
    entryTrigger: z
      .string()
      .max(200, 'Entry trigger must be less than 200 characters')
      .optional(),
    hadHesitation: z.boolean().optional(),
    deviatedFromPlan: z.boolean().optional(),
    deviationReason: z
      .string()
      .max(1000, 'Deviation reason must be less than 1000 characters')
      .optional(),
    
    // During Trade
    monitoringFrequency: z
      .string()
      .max(100, 'Monitoring frequency must be less than 100 characters')
      .optional(),
    stressLevel: z
      .number()
      .int('Stress level must be an integer')
      .min(1, 'Stress level must be at least 1')
      .max(10, 'Stress level cannot exceed 10')
      .optional(),
    consideredEarlyExit: z.boolean().optional(),
    earlyExitReason: z
      .string()
      .max(1000, 'Early exit reason must be less than 1000 characters')
      .optional(),
    
    // Exit Decision
    exitReason: z
      .string()
      .max(200, 'Exit reason must be less than 200 characters')
      .optional(),
    exitSatisfaction: z
      .number()
      .int('Exit satisfaction must be an integer')
      .min(1, 'Exit satisfaction must be at least 1')
      .max(10, 'Exit satisfaction cannot exceed 10')
      .optional(),
    wouldDoDifferently: z
      .string()
      .max(1000, 'Would do differently must be less than 1000 characters')
      .optional(),
    
    // Post-Trade Reflection
    keyLesson: z
      .string()
      .max(1000, 'Key lesson must be less than 1000 characters')
      .optional(),
    mistakesMade: z
      .array(z.string().max(200, 'Each mistake must be less than 200 characters'))
      .optional(),
    whatWentWell: z
      .string()
      .max(1000, 'What went well must be less than 1000 characters')
      .optional(),
    conditionsMatchExpectation: z.boolean().optional(),
    
    // Additional Context
    sessionQuality: z
      .number()
      .int('Session quality must be an integer')
      .min(1, 'Session quality must be at least 1')
      .max(10, 'Session quality cannot exceed 10')
      .optional(),
    physicalState: z
      .string()
      .max(100, 'Physical state must be less than 100 characters')
      .optional(),
    mentalState: z
      .string()
      .max(100, 'Mental state must be less than 100 characters')
      .optional(),
    externalFactors: z
      .array(z.string().max(200, 'Each external factor must be less than 200 characters'))
      .optional(),
  })
  .refine(
    (data) => {
      // If trade type is OPTIONS, optionType must be provided
      if (data.tradeType === 'OPTIONS' && !data.optionType) {
        return false;
      }
      return true;
    },
    {
      message: 'Option type is required for OPTIONS trades',
      path: ['optionType'],
    }
  );

/**
 * Query filters for getting trades
 */
export const GetTradesQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  tradeType: TradeTypeSchema.optional(),
  baseCurrency: CurrencySchema.optional(),
  emotionalState: EmotionalStateSchema.optional(),
  isImpulsive: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  sortBy: z.enum(['tradeDate', 'pnl', 'createdAt']).default('tradeDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(100))
    .optional()
    .default(50),
  offset: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(0))
    .optional()
    .default(0),
});

/**
 * Type exports for use in controllers and services
 */
export type CreateTradeDTO = z.infer<typeof CreateTradeSchema>;
export type UpdateTradeDTO = z.infer<typeof UpdateTradeSchema>;
export type GetTradesQuery = z.infer<typeof GetTradesQuerySchema>;
