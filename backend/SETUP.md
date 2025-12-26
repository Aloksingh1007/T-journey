# Backend Setup Guide

## Task 2: Database and Prisma ORM Setup - COMPLETED ✓

This document describes the Prisma ORM setup for the AI Trading Journal backend.

## What Was Implemented

### 1. Prisma Installation
- Installed `@prisma/client` and `prisma` packages
- Initialized Prisma with PostgreSQL configuration

### 2. Database Schema
Created complete schema with the following models:

#### User Model
- Authentication and user management
- Fields: id, email, passwordHash, name, timestamps
- Relation: One-to-many with Trade

#### Trade Model
- Core trading journal entries
- Fields include:
  - Trade information: date, time, type, instrument
  - Direction and pricing: buy/sell prices, position size, leverage
  - P&L tracking: calculated P&L, percentage, currency
  - Emotional data: emotional state, impulsive indicator
  - AI fields (Phase 2): insights, sentiment score
- Relations: Many-to-one with User, One-to-many with Note and Screenshot
- Indexes: userId+tradeDate, userId+baseCurrency, userId+tradeType

#### Note Model
- Text notes associated with trades
- Fields: id, tradeId, content, timestamp
- Relation: Many-to-one with Trade

#### Screenshot Model
- Image attachments for trades
- Fields: id, tradeId, filename, url, fileSize, mimeType, timestamp
- Relation: Many-to-one with Trade

### 3. Enums Defined
- **TradeType**: CRYPTO, STOCK, FUTURES, OPTIONS, FUNDED_ACCOUNT
- **TradeDirection**: BUY_LONG, SELL_SHORT
- **OptionType**: CALL, PUT (for options trades)
- **Currency**: INR, USD
- **EmotionalState**: CONFIDENT, FEARFUL, GREEDY, ANXIOUS, NEUTRAL, EXCITED, FRUSTRATED

### 4. Prisma Client Setup
- Created singleton Prisma client instance at `src/utils/prisma.ts`
- Configured logging for development environment
- Prevents multiple instances in development

### 5. Configuration Files
- Updated `package.json` with Prisma scripts
- Configured `prisma.config.ts` with dotenv support
- Updated `.env` with standard PostgreSQL connection string

## Files Created/Modified

### Created:
- `backend/prisma/schema.prisma` - Complete database schema
- `backend/src/utils/prisma.ts` - Prisma client singleton
- `backend/src/utils/db-test.ts` - Database connection test utility
- `backend/prisma/README.md` - Prisma documentation
- `backend/SETUP.md` - This file

### Modified:
- `backend/package.json` - Added Prisma scripts
- `backend/prisma.config.ts` - Added dotenv import
- `backend/.env` - Updated with standard PostgreSQL URL

## Next Steps for User

### 1. Setup PostgreSQL Database

You need to have PostgreSQL installed and create a database:

```bash
# Using psql
createdb trading_journal

# Or using PostgreSQL client
CREATE DATABASE trading_journal;
```

### 2. Update Database Connection

Edit `backend/.env` and update the DATABASE_URL with your credentials:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/trading_journal"
```

### 3. Run Database Migration

Once your database is ready, run the migration to create all tables:

```bash
cd backend
npm run prisma:migrate
```

When prompted, enter a migration name like "init" or "initial_setup".

### 4. Verify Setup (Optional)

Test the database connection:

```bash
npx ts-node src/utils/db-test.ts
```

Or open Prisma Studio to view your database:

```bash
npm run prisma:studio
```

## Available Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Validate schema
npx prisma validate

# View migration status
npx prisma migrate status

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Requirements Satisfied

This implementation satisfies the following requirements from the specification:

- ✓ 1.1-1.10: Trade recording with comprehensive details
- ✓ 2.1-2.3: Emotional state and impulsive indicator tracking
- ✓ 3.1-3.5: Notes and screenshots support
- ✓ Database structure for all Phase 1 features
- ✓ Prepared for Phase 2 AI integration (aiInsights, sentimentScore fields)

## Schema Highlights

### Data Types
- UUIDs for all primary keys
- Decimal types for precise financial calculations
- Proper indexing for query performance
- Cascade deletes for data integrity

### Relationships
- User → Trades (one-to-many)
- Trade → Notes (one-to-many)
- Trade → Screenshots (one-to-many)

### Constraints
- Unique email for users
- Required emotional state for trades
- Optional fields for flexibility (originalCapital, optionType, etc.)

## Troubleshooting

### "Can't reach database server"
- Ensure PostgreSQL is running
- Verify DATABASE_URL credentials
- Check if the database exists

### "Environment variable not found"
- Ensure `.env` file exists in backend directory
- Verify `dotenv/config` is imported in prisma.config.ts

### Migration fails
- Check database permissions
- Ensure database is empty for initial migration
- Use `npx prisma migrate reset` to start fresh (WARNING: deletes data)

## Notes

- The Prisma Client is automatically generated in `node_modules/@prisma/client`
- Always run `prisma generate` after modifying the schema
- Migrations are version-controlled in `prisma/migrations/`
- Use Prisma Studio for easy database inspection and editing
