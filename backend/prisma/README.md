# Prisma Database Setup

## Prerequisites

- PostgreSQL 15+ installed and running
- Database created (default name: `trading_journal`)

## Setup Instructions

1. **Configure Database Connection**
   
   Update the `DATABASE_URL` in `.env` file with your PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

2. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

3. **Run Initial Migration**
   ```bash
   npm run prisma:migrate
   ```
   
   When prompted, enter a migration name (e.g., "init")

4. **Open Prisma Studio (Optional)**
   ```bash
   npm run prisma:studio
   ```

## Database Schema

The schema includes the following models:

- **User**: User accounts with authentication
- **Trade**: Trading records with comprehensive details
- **Note**: Text notes associated with trades
- **Screenshot**: Image attachments for trades

### Enums

- **TradeType**: CRYPTO, STOCK, FUTURES, OPTIONS, FUNDED_ACCOUNT
- **TradeDirection**: BUY_LONG, SELL_SHORT
- **OptionType**: CALL, PUT
- **Currency**: INR, USD
- **EmotionalState**: CONFIDENT, FEARFUL, GREEDY, ANXIOUS, NEUTRAL, EXCITED, FRUSTRATED

## Common Commands

- Generate Prisma Client: `npm run prisma:generate`
- Create migration: `npm run prisma:migrate`
- Open Prisma Studio: `npm run prisma:studio`
- Reset database: `npx prisma migrate reset`
- View migration status: `npx prisma migrate status`

## Notes

- Always run `prisma generate` after modifying the schema
- Migrations are stored in `prisma/migrations/`
- The Prisma Client is generated in `node_modules/@prisma/client`
