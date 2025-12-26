import { Request, Response, NextFunction } from 'express';

interface PerformanceMetrics {
  requestCount: number;
  totalResponseTime: number;
  averageResponseTime: number;
  slowRequests: number;
  errorCount: number;
  lastReset: Date;
}

// In-memory metrics (in production, use Redis or external monitoring)
const metrics: PerformanceMetrics = {
  requestCount: 0,
  totalResponseTime: 0,
  averageResponseTime: 0,
  slowRequests: 0,
  errorCount: 0,
  lastReset: new Date()
};

/**
 * Performance monitoring middleware
 * Tracks request timing and basic metrics
 */
export function performanceMonitoring(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  // Increment request count
  metrics.requestCount++;
  
  // Override res.end to capture response time
  const originalEnd = res.end.bind(res);
  res.end = function(chunk?: any, encoding?: any): Response {
    const responseTime = Date.now() - startTime;
    
    // Update metrics
    metrics.totalResponseTime += responseTime;
    metrics.averageResponseTime = metrics.totalResponseTime / metrics.requestCount;
    
    // Track slow requests (>1000ms)
    if (responseTime > 1000) {
      metrics.slowRequests++;
      console.warn(`Slow request detected: ${req.method} ${req.path} - ${responseTime}ms`);
    }
    
    // Track errors
    if (res.statusCode >= 400) {
      metrics.errorCount++;
    }
    
    // Log request details
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${responseTime}ms`);
    
    // Add performance headers
    res.setHeader('X-Response-Time', `${responseTime}ms`);
    res.setHeader('X-Request-ID', req.headers['x-request-id'] || 'unknown');
    
    // Call original end method
    return originalEnd(chunk, encoding);
  } as any;
  
  next();
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics & { 
  errorRate: number;
  slowRequestRate: number;
  requestsPerMinute: number;
} {
  const uptimeMinutes = (Date.now() - metrics.lastReset.getTime()) / (1000 * 60);
  
  return {
    ...metrics,
    errorRate: metrics.requestCount > 0 ? (metrics.errorCount / metrics.requestCount) * 100 : 0,
    slowRequestRate: metrics.requestCount > 0 ? (metrics.slowRequests / metrics.requestCount) * 100 : 0,
    requestsPerMinute: uptimeMinutes > 0 ? metrics.requestCount / uptimeMinutes : 0
  };
}

/**
 * Reset performance metrics
 */
export function resetPerformanceMetrics() {
  metrics.requestCount = 0;
  metrics.totalResponseTime = 0;
  metrics.averageResponseTime = 0;
  metrics.slowRequests = 0;
  metrics.errorCount = 0;
  metrics.lastReset = new Date();
}

/**
 * Performance metrics endpoint middleware
 */
export function performanceMetricsEndpoint(_req: Request, res: Response) {
  const currentMetrics = getPerformanceMetrics();
  
  res.json({
    success: true,
    data: {
      ...currentMetrics,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }
  });
}