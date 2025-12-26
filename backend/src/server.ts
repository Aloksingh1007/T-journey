import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes';
import tradeRoutes from './routes/trade.routes';
import noteRoutes from './routes/note.routes';
import screenshotRoutes from './routes/screenshot.routes';
import dashboardRoutes from './routes/dashboard.routes';
import emotionAnalysisRoutes from './routes/emotion-analysis.routes';
import analyticsRoutes from './routes/analytics.routes';
import traderScoreRoutes from './routes/trader-score.routes';
import profileRoutes from './routes/profile.routes';
import communityRoutes from './routes/community.routes';
import notificationRoutes from './routes/notification.routes';
import passwordResetRoutes from './routes/password-reset.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { performanceMonitoring, performanceMetricsEndpoint } from './middleware/performance.middleware';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://t-journey.vercel.app/', // Your Vercel URL
     ],
     credentials: true,
   }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Performance monitoring
app.use(performanceMonitoring);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health and monitoring routes
app.use('/api', healthRoutes);
app.get('/api/metrics', performanceMetricsEndpoint);

// API routes placeholder
app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to AI Trading Journal API',
    version: '1.0.0',
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/password-reset', passwordResetRoutes);

// Trade routes
app.use('/api/trades', tradeRoutes);

// Note routes
app.use('/api/notes', noteRoutes);

// Screenshot routes
app.use('/api/screenshots', screenshotRoutes);

// Dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// AI Emotion Analysis routes
app.use('/api/ai', emotionAnalysisRoutes);

// Analytics routes
app.use('/api/analytics', analyticsRoutes);

// Trader Score routes
app.use('/api/scores', traderScoreRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Community routes
app.use('/api/community', communityRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
