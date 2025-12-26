# AI Trading Journal

A comprehensive trading analysis and journaling platform that enables traders to record, analyze, and improve their trading performance through AI-powered insights.

## Project Structure

```
.
├── frontend/          # React + TypeScript + Vite frontend
├── backend/           # Node.js + Express + TypeScript backend
└── .kiro/            # Kiro specs and configuration
```

## Frontend

Built with:
- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Backend

Built with:
- Node.js
- Express
- TypeScript
- PostgreSQL (with Prisma ORM)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npm run dev
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Backend Development
```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Run production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/trading_journal
JWT_SECRET=your-secret-key-change-this-in-production
```

## Features

### Phase 1: Core Trading Journal
- Trade recording with comprehensive details
- Emotional state tracking
- Notes and screenshots
- Dashboard with statistics
- Trade filtering and analysis
- P&L calculations

### Phase 2: AI Integration (Future)
- Emotion analysis from notes
- AI-powered trade insights
- Chat assistant
- Voice-to-text transcription

## License

ISC
