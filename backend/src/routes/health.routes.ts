import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../utils/prisma';

const router = Router();

/**
 * Basic health check endpoint
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected'
    };
    
    res.status(200).json({
      success: true,
      data: healthStatus
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    res.status(503).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Service unhealthy',
        details: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.env.npm_package_version || '1.0.0',
          environment: process.env.NODE_ENV || 'development',
          database: 'disconnected'
        }
      }
    });
  }
});

/**
 * Detailed health check with database stats
 */
router.get('/health/detailed', async (_req: Request, res: Response) => {
  try {
    // Check database connection and get stats
    const [_dbCheck, userCount, tradeCount] = await Promise.all([
      prisma.$queryRaw`SELECT 1`,
      prisma.user.count(),
      prisma.trade.count()
    ]);
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'connected',
        stats: {
          totalUsers: userCount,
          totalTrades: tradeCount
        }
      },
      performance: {
        uptimeHours: Math.floor(process.uptime() / 3600),
        memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        cpuUsage: process.cpuUsage()
      }
    };
    
    res.status(200).json({
      success: true,
      data: healthStatus
    });
  } catch (error) {
    console.error('Detailed health check failed:', error);
    
    res.status(503).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Service unhealthy',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

/**
 * Readiness probe for Kubernetes/Docker deployments
 */
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Check if all critical services are ready
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      success: true,
      data: {
        status: 'ready',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: {
        code: 'SERVICE_NOT_READY',
        message: 'Service not ready'
      }
    });
  }
});

/**
 * Liveness probe for Kubernetes/Docker deployments
 */
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

export default router;
