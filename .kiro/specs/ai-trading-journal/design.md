# AI Trading Journal - Design Document

## Overview

The AI Trading Journal is a full-stack web application that enables traders to record, analyze, and improve their trading performance. The system is designed in two phases: Phase 1 focuses on core trading journal functionality with robust data management, while Phase 2 adds AI-powered features for emotion analysis, insights, and conversational assistance.

The application follows a modern three-tier architecture with a React frontend, Node.js/Express backend, and PostgreSQL database, with future integration of AI services through OpenAI and HuggingFace APIs.

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast development and optimized builds)
- **Routing**: React Router v6
- **State Management**: React Context API + React Query (for server state)
- **UI Library**: Tailwind CSS + shadcn/ui components
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts or Chart.js
- **Date Handling**: date-fns
- **Image Upload**: react-dropzone

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Zod
- **File Upload**: Multer
- **API Documentation**: Swagger/OpenAPI (optional)

### Database
- **Primary Database**: PostgreSQL 15+
- **ORM**: Prisma (type-safe, excellent TypeScript support)
- **Migrations**: Prisma Migrate

### AI Services (Phase 2)
- **LLM**: OpenAI GPT-4 API (chat assistant, insights)
- **Emotion Analysis**: OpenAI API or HuggingFace Transformers
- **Voice Transcription**: OpenAI Whisper API
- **AI SDK**: Vercel AI SDK (optional, for streaming responses)

### Deployment & Infrastructure
- **Frontend Hosting**: Vercel or Netlify
- **Backend Hosting**: Railway, Render, or AWS EC2
- **Database Hosting**: Railway, Supabase, or AWS RDS
- **File Storage**: AWS S3 or Cloudinary (for screenshots)
- **Environment Management**: dotenv

### Development Tools
- **Package Manager**: npm or pnpm
- **Code Quality**: ESLint + Prettier
- **Testing**: Vitest (unit tests), Playwright (E2E)
- **Version Control**: Git

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │  Trades  │  │  Add     │  │  Trade   │   │
│  │  Page    │  │  List    │  │  Trade   │  │  Detail  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Query (API State Management)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express + Node.js)               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │    Trades    │  │    Upload    │     │
│  │  Middleware  │  │   Routes     │  │   Routes     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Business   │  │  Validation  │  │     File     │     │
│  │    Logic     │  │   Layer      │  │   Handler    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Prisma ORM (Data Access Layer)            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │  Trades  │  │  Notes   │  │  Images  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              AI Services (Phase 2 Integration)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   OpenAI     │  │  HuggingFace │  │   Whisper    │     │
│  │   GPT-4      │  │   Emotion    │  │     API      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

### Database Schema (Prisma)

```prisma
// User Model
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  trades        Trade[]
  
  @@map("users")
}

// Trade Model
model Trade {
  id                String        @id @default(uuid())
  userId            String
  user              User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Core Trade Information
  tradeDate         DateTime
  tradeTime         String        // Stored as HH:MM format
  tradeType         TradeType     // CRYPTO, STOCK, FUTURES, OPTIONS, FUNDED_ACCOUNT
  instrument        String        // e.g., "BTC/USDT", "AAPL", "NIFTY"
  
  // Trade Direction & Type
  tradeDirection    TradeDirection // BUY_LONG, SELL_SHORT
  optionType        OptionType?   // CALL, PUT (only for options)
  
  // Pricing & Position
  avgBuyPrice       Decimal       @db.Decimal(18, 8)
  avgSellPrice      Decimal       @db.Decimal(18, 8)
  positionSize      Decimal       @db.Decimal(18, 8)
  leverage          Decimal       @default(1) @db.Decimal(5, 2)
  originalCapital   Decimal?      @db.Decimal(18, 2)
  
  // P&L & Currency
  baseCurrency      Currency      @default(INR)
  pnl               Decimal       @db.Decimal(18, 2)
  pnlPercentage     Decimal?      @db.Decimal(8, 4)
  
  // Emotional & Behavioral Data
  emotionalState    EmotionalState
  isImpulsive       Boolean       @default(false)
  
  // Optional Fields
  notes             Note[]
  screenshots       Screenshot[]
  
  // AI Analysis (Phase 2)
  aiInsights        String?       @db.Text
  sentimentScore    Decimal?      @db.Decimal(5, 4)
  
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  
  @@index([userId, tradeDate])
  @@index([userId, baseCurrency])
  @@index([userId, tradeType])
  @@map("trades")
}

// Note Model
model Note {
  id          String    @id @default(uuid())
  tradeId     String
  trade       Trade     @relation(fields: [tradeId], references: [id], onDelete: Cascade)
  content     String    @db.Text
  createdAt   DateTime  @default(now())
  
  @@map("notes")
}

// Screenshot Model
model Screenshot {
  id          String    @id @default(uuid())
  tradeId     String
  trade       Trade     @relation(fields: [tradeId], references: [id], onDelete: Cascade)
  filename    String
  url         String
  fileSize    Int
  mimeType    String
  createdAt   DateTime  @default(now())
  
  @@map("screenshots")
}

// Enums
enum TradeType {
  CRYPTO
  STOCK
  FUTURES
  OPTIONS
  FUNDED_ACCOUNT
}

enum TradeDirection {
  BUY_LONG
  SELL_SHORT
}

enum OptionType {
  CALL
  PUT
}

enum Currency {
  INR
  USD
}

enum EmotionalState {
  CONFIDENT
  FEARFUL
  GREEDY
  ANXIOUS
  NEUTRAL
  EXCITED
  FRUSTRATED
}
```

### API Data Transfer Objects (DTOs)

```typescript
// Create Trade DTO
interface CreateTradeDTO {
  tradeDate: string; // ISO date string
  tradeTime: string; // HH:MM format
  tradeType: 'CRYPTO' | 'STOCK' | 'FUTURES' | 'OPTIONS' | 'FUNDED_ACCOUNT';
  instrument: string;
  tradeDirection: 'BUY_LONG' | 'SELL_SHORT';
  optionType?: 'CALL' | 'PUT';
  avgBuyPrice: number;
  avgSellPrice: number;
  positionSize: number;
  leverage?: number;
  originalCapital?: number;
  baseCurrency: 'INR' | 'USD';
  emotionalState: 'CONFIDENT' | 'FEARFUL' | 'GREEDY' | 'ANXIOUS' | 'NEUTRAL' | 'EXCITED' | 'FRUSTRATED';
  isImpulsive: boolean;
  notes?: string;
}

// Trade Response DTO
interface TradeResponseDTO {
  id: string;
  tradeDate: string;
  tradeTime: string;
  tradeType: string;
  instrument: string;
  tradeDirection: string;
  optionType?: string;
  avgBuyPrice: number;
  avgSellPrice: number;
  positionSize: number;
  leverage: number;
  originalCapital?: number;
  baseCurrency: string;
  pnl: number;
  pnlPercentage?: number;
  emotionalState: string;
  isImpulsive: boolean;
  notes: NoteDTO[];
  screenshots: ScreenshotDTO[];
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats DTO
interface DashboardStatsDTO {
  totalTrades: number;
  winRate: number;
  totalPnlINR: number;
  totalPnlUSD: number;
  avgProfitPerTrade: number;
  tradesByType: Record<string, number>;
  emotionalStateDistribution: Record<string, number>;
  pnlOverTime: Array<{ date: string; pnl: number }>;
}
```

## Components and Interfaces

### Frontend Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── trades/
│   │   ├── TradeForm.tsx
│   │   ├── TradeCard.tsx
│   │   ├── TradeList.tsx
│   │   ├── TradeDetail.tsx
│   │   └── TradeFilters.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── PnLChart.tsx
│   │   ├── EmotionChart.tsx
│   │   └── TradeTypeChart.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── DatePicker.tsx
│   │   ├── ImageUpload.tsx
│   │   └── LoadingSpinner.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── TradesList.tsx
│   ├── AddTrade.tsx
│   ├── EditTrade.tsx
│   ├── TradeDetail.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useTrades.ts
│   ├── useDashboardStats.ts
│   └── useImageUpload.ts
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── trade.service.ts
│   └── upload.service.ts
├── utils/
│   ├── calculations.ts
│   ├── formatters.ts
│   └── validators.ts
├── types/
│   └── index.ts
└── App.tsx
```

### Backend API Structure

```
src/
├── routes/
│   ├── auth.routes.ts
│   ├── trade.routes.ts
│   ├── dashboard.routes.ts
│   └── upload.routes.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── trade.controller.ts
│   ├── dashboard.controller.ts
│   └── upload.controller.ts
├── services/
│   ├── auth.service.ts
│   ├── trade.service.ts
│   ├── dashboard.service.ts
│   ├── pnl-calculator.service.ts
│   └── upload.service.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── error.middleware.ts
│   └── upload.middleware.ts
├── utils/
│   ├── jwt.util.ts
│   ├── password.util.ts
│   └── calculations.util.ts
├── validators/
│   ├── auth.validator.ts
│   └── trade.validator.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── types/
│   └── index.ts
└── server.ts
```

### Key API Endpoints

```
Authentication:
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
GET    /api/auth/me                - Get current user

Trades:
GET    /api/trades                 - Get all trades (with filters)
GET    /api/trades/:id             - Get single trade
POST   /api/trades                 - Create new trade
PUT    /api/trades/:id             - Update trade
DELETE /api/trades/:id             - Delete trade

Notes:
POST   /api/trades/:id/notes       - Add note to trade
DELETE /api/notes/:id              - Delete note

Screenshots:
POST   /api/trades/:id/screenshots - Upload screenshot
DELETE /api/screenshots/:id        - Delete screenshot

Dashboard:
GET    /api/dashboard/stats        - Get dashboard statistics
GET    /api/dashboard/pnl-chart    - Get P&L over time data

AI Services (Phase 2):
POST   /api/ai/analyze-emotion     - Analyze emotion from text
POST   /api/ai/generate-insights   - Generate trade insights
POST   /api/ai/chat                - Chat with AI assistant
POST   /api/ai/transcribe          - Transcribe audio to text
```

## Business Logic

### P&L Calculation

The P&L calculation varies based on trade direction and leverage:

```typescript
function calculatePnL(trade: TradeInput): number {
  const { 
    tradeDirection, 
    avgBuyPrice, 
    avgSellPrice, 
    positionSize, 
    leverage 
  } = trade;
  
  let pnl: number;
  
  if (tradeDirection === 'BUY_LONG') {
    // Long position: profit when sell price > buy price
    pnl = (avgSellPrice - avgBuyPrice) * positionSize;
  } else {
    // Short position: profit when buy price > sell price
    pnl = (avgBuyPrice - avgSellPrice) * positionSize;
  }
  
  // Apply leverage multiplier
  pnl = pnl * leverage;
  
  return pnl;
}

function calculatePnLPercentage(pnl: number, originalCapital: number): number {
  if (!originalCapital || originalCapital === 0) return 0;
  return (pnl / originalCapital) * 100;
}
```

### Dashboard Statistics Calculation

```typescript
interface DashboardStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnlINR: number;
  totalPnlUSD: number;
  avgProfitPerTrade: number;
  largestWin: number;
  largestLoss: number;
  tradesByType: Record<string, number>;
  emotionalStateDistribution: Record<string, number>;
}

function calculateDashboardStats(trades: Trade[]): DashboardStats {
  const stats: DashboardStats = {
    totalTrades: trades.length,
    winningTrades: trades.filter(t => t.pnl > 0).length,
    losingTrades: trades.filter(t => t.pnl < 0).length,
    winRate: 0,
    totalPnlINR: 0,
    totalPnlUSD: 0,
    avgProfitPerTrade: 0,
    largestWin: 0,
    largestLoss: 0,
    tradesByType: {},
    emotionalStateDistribution: {}
  };
  
  // Calculate win rate
  stats.winRate = stats.totalTrades > 0 
    ? (stats.winningTrades / stats.totalTrades) * 100 
    : 0;
  
  // Calculate P&L by currency
  trades.forEach(trade => {
    if (trade.baseCurrency === 'INR') {
      stats.totalPnlINR += trade.pnl;
    } else {
      stats.totalPnlUSD += trade.pnl;
    }
    
    // Track largest win/loss
    if (trade.pnl > stats.largestWin) stats.largestWin = trade.pnl;
    if (trade.pnl < stats.largestLoss) stats.largestLoss = trade.pnl;
    
    // Count by trade type
    stats.tradesByType[trade.tradeType] = 
      (stats.tradesByType[trade.tradeType] || 0) + 1;
    
    // Count by emotional state
    stats.emotionalStateDistribution[trade.emotionalState] = 
      (stats.emotionalStateDistribution[trade.emotionalState] || 0) + 1;
  });
  
  // Calculate average profit per trade
  const totalPnl = stats.totalPnlINR + stats.totalPnlUSD;
  stats.avgProfitPerTrade = stats.totalTrades > 0 
    ? totalPnl / stats.totalTrades 
    : 0;
  
  return stats;
}
```

## Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Example error codes
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  DATABASE_ERROR = 'DATABASE_ERROR',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}
```

### Error Handling Middleware

```typescript
// Global error handler
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);
  
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.errors
      }
    });
  }
  
  if (err instanceof AuthenticationError) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Authentication required'
      }
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}
```

### Frontend Error Handling

```typescript
// React Query error handling
const { data, error, isError } = useQuery({
  queryKey: ['trades'],
  queryFn: fetchTrades,
  onError: (error) => {
    toast.error(error.message || 'Failed to fetch trades');
  }
});

// Form validation errors
const onSubmit = async (data: TradeFormData) => {
  try {
    await createTrade(data);
    toast.success('Trade created successfully');
    navigate('/trades');
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      // Display field-specific errors
      error.details.forEach(err => {
        setError(err.field, { message: err.message });
      });
    } else {
      toast.error('Failed to create trade');
    }
  }
};
```

## Testing Strategy

### Unit Tests

**Backend:**
- Test P&L calculation logic with various scenarios
- Test authentication utilities (JWT, password hashing)
- Test validation schemas
- Test service layer business logic

**Frontend:**
- Test utility functions (formatters, calculators)
- Test custom hooks
- Test form validation logic

### Integration Tests

**Backend:**
- Test API endpoints with database
- Test authentication flow
- Test file upload functionality
- Test trade CRUD operations

**Frontend:**
- Test component interactions
- Test form submissions
- Test API integration with React Query

### End-to-End Tests

- User registration and login flow
- Complete trade creation workflow
- Dashboard data display
- Trade filtering and sorting
- Image upload functionality

### Test Coverage Goals

- Backend: 80%+ coverage for business logic
- Frontend: 70%+ coverage for critical paths
- E2E: Cover all major user workflows

## Phase 2: AI Integration Design

### AI Services Architecture

```typescript
// AI Service Interface
interface AIService {
  analyzeEmotion(text: string): Promise<EmotionAnalysis>;
  generateInsights(trades: Trade[]): Promise<TradeInsights>;
  chatWithAssistant(message: string, context: Trade[]): Promise<string>;
  transcribeAudio(audioFile: Buffer): Promise<string>;
}

// Emotion Analysis
interface EmotionAnalysis {
  primaryEmotion: EmotionalState;
  sentimentScore: number; // -1 to 1
  confidence: number;
  emotions: {
    fear: number;
    greed: number;
    confidence: number;
    anxiety: number;
  };
}

// Trade Insights
interface TradeInsights {
  overallAssessment: string;
  patterns: string[];
  recommendations: string[];
  warnings: string[];
  emotionalCorrelations: {
    emotion: string;
    winRate: number;
    avgPnL: number;
  }[];
}
```

### AI Integration Points

1. **Emotion Analysis**: Triggered when user adds notes to trades
2. **Trade Insights**: Generated on-demand or weekly for users with 20+ trades
3. **Chat Assistant**: Real-time conversational interface on dashboard
4. **Voice Transcription**: Triggered on audio file upload

### AI Service Implementation Strategy

- Use OpenAI API for GPT-4 (chat, insights) and Whisper (transcription)
- Implement retry logic with exponential backoff
- Queue failed requests for later processing
- Cache AI responses to reduce API costs
- Implement rate limiting to prevent abuse

## Security Considerations

1. **Authentication**: JWT tokens with secure httpOnly cookies
2. **Password Security**: bcrypt hashing with salt rounds = 12
3. **Input Validation**: Zod schemas on both frontend and backend
4. **SQL Injection**: Prevented by Prisma ORM parameterized queries
5. **File Upload**: Validate file types, sizes, and sanitize filenames
6. **CORS**: Configure allowed origins for production
7. **Rate Limiting**: Implement rate limiting on API endpoints
8. **Environment Variables**: Never commit secrets, use .env files
9. **HTTPS**: Enforce HTTPS in production
10. **Data Privacy**: Users can only access their own data

## Performance Optimization

1. **Database Indexing**: Index on userId, tradeDate, baseCurrency, tradeType
2. **Pagination**: Implement cursor-based pagination for trade lists
3. **Caching**: Use React Query for client-side caching
4. **Image Optimization**: Compress images before upload, use CDN
5. **Lazy Loading**: Code-split routes and components
6. **Database Connection Pooling**: Configure Prisma connection pool
7. **API Response Compression**: Use gzip compression middleware

## Deployment Strategy

### Development Environment
- Local PostgreSQL database
- Environment variables in .env.local
- Hot reload for both frontend and backend

### Production Environment
- Frontend: Deploy to Vercel with automatic deployments from main branch
- Backend: Deploy to Railway with PostgreSQL database
- File Storage: AWS S3 or Cloudinary for screenshots
- Environment variables configured in hosting platform
- Database migrations run automatically on deployment
- Health check endpoints for monitoring

## Future Enhancements (Post Phase 2)

1. **Mobile App**: React Native version
2. **Advanced Analytics**: Machine learning models for pattern recognition
3. **Social Features**: Share trades with community (anonymized)
4. **Broker Integration**: Auto-import trades from broker APIs
5. **Real-time Market Data**: Display current prices and market conditions
6. **Goal Setting**: Set and track trading goals
7. **Backtesting**: Test strategies against historical data
8. **Multi-language Support**: Internationalization
9. **Dark Mode**: Theme customization
10. **Export/Import**: CSV export and import functionality
