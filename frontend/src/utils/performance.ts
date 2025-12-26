/**
 * Performance monitoring utilities
 */

/**
 * Measure and log component render time
 */
export function measureRenderTime(componentName: string, callback: () => void) {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  
  if (renderTime > 16) { // More than one frame (60fps)
    console.warn(`[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render`);
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load component with retry logic
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retries: number = 3
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await componentImport();
      } catch (error) {
        lastError = error as Error;
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    
    throw lastError || new Error('Failed to load component');
  });
}

/**
 * Preload a route component
 */
export function preloadRoute(routeImport: () => Promise<any>) {
  // Start loading the component
  routeImport();
}

/**
 * Check if user is on a slow connection
 */
export function isSlowConnection(): boolean {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return connection?.effectiveType === 'slow-2g' || 
           connection?.effectiveType === '2g' ||
           connection?.saveData === true;
  }
  return false;
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics() {
  if (!window.performance) {
    return null;
  }
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) {
    return null;
  }
  
  return {
    // Time to first byte
    ttfb: navigation.responseStart - navigation.requestStart,
    // DOM content loaded
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    // Full page load
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    // Total load time
    totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
  };
}

/**
 * Log performance metrics to console (development only)
 */
export function logPerformanceMetrics() {
  if (import.meta.env.DEV) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const metrics = getPerformanceMetrics();
        if (metrics) {
          console.group('⚡ Performance Metrics');
          console.log(`TTFB: ${metrics.ttfb.toFixed(2)}ms`);
          console.log(`DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
          console.log(`Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
          console.log(`Total Load Time: ${metrics.totalLoadTime.toFixed(2)}ms`);
          console.groupEnd();
        }
      }, 0);
    });
  }
}

// Import React for lazy loading
import React from 'react';
