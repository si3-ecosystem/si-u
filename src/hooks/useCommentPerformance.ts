"use client";

import React, { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  interactionTime: number;
  renderCount: number;
  memoryUsage?: number;
}

interface UseCommentPerformanceOptions {
  enabled?: boolean;
  logToConsole?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

/**
 * Hook to monitor comment system performance
 * Tracks load times, interaction responsiveness, and render counts
 */
export function useCommentPerformance(
  componentName: string,
  options: UseCommentPerformanceOptions = {}
) {
  const {
    enabled = process.env.NODE_ENV === 'development',
    logToConsole = true,
    onMetricsUpdate,
  } = options;

  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    interactionTime: 0,
    renderCount: 0,
  });

  const startTimeRef = useRef<number>(0);
  const interactionStartRef = useRef<number>(0);

  // Track component mount time
  useEffect(() => {
    if (!enabled) return;

    startTimeRef.current = performance.now();
    
    return () => {
      const loadTime = performance.now() - startTimeRef.current;
      metricsRef.current.loadTime = loadTime;
      
      if (logToConsole) {
        console.log(`[Performance] ${componentName} load time: ${loadTime.toFixed(2)}ms`);
      }
    };
  }, [enabled, componentName, logToConsole]);

  // Track render count
  useEffect(() => {
    if (!enabled) return;
    
    metricsRef.current.renderCount += 1;
    
    if (logToConsole && metricsRef.current.renderCount > 1) {
      console.log(`[Performance] ${componentName} render count: ${metricsRef.current.renderCount}`);
    }
  });

  // Track memory usage (if available)
  useEffect(() => {
    if (!enabled || !('memory' in performance)) return;

    const updateMemoryUsage = () => {
      const memory = (performance as any).memory;
      if (memory) {
        metricsRef.current.memoryUsage = memory.usedJSHeapSize;
      }
    };

    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [enabled]);

  // Start interaction timing
  const startInteraction = useCallback((interactionType: string) => {
    if (!enabled) return;
    
    interactionStartRef.current = performance.now();
    
    if (logToConsole) {
      console.log(`[Performance] ${componentName} starting ${interactionType} interaction`);
    }
  }, [enabled, componentName, logToConsole]);

  // End interaction timing
  const endInteraction = useCallback((interactionType: string) => {
    if (!enabled || interactionStartRef.current === 0) return;
    
    const interactionTime = performance.now() - interactionStartRef.current;
    metricsRef.current.interactionTime = interactionTime;
    
    if (logToConsole) {
      console.log(`[Performance] ${componentName} ${interactionType} interaction time: ${interactionTime.toFixed(2)}ms`);
    }

    // Call metrics update callback
    onMetricsUpdate?.(metricsRef.current);
    
    interactionStartRef.current = 0;
  }, [enabled, componentName, logToConsole, onMetricsUpdate]);

  // Get current metrics
  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metricsRef.current };
  }, []);

  // Log performance summary
  const logSummary = useCallback(() => {
    if (!enabled || !logToConsole) return;
    
    const metrics = metricsRef.current;
    console.group(`[Performance Summary] ${componentName}`);
    console.log(`Load Time: ${metrics.loadTime.toFixed(2)}ms`);
    console.log(`Last Interaction Time: ${metrics.interactionTime.toFixed(2)}ms`);
    console.log(`Render Count: ${metrics.renderCount}`);
    
    if (metrics.memoryUsage) {
      console.log(`Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }
    
    // Performance recommendations
    if (metrics.loadTime > 1000) {
      console.warn('⚠️ Slow load time detected. Consider optimizing component initialization.');
    }
    
    if (metrics.interactionTime > 100) {
      console.warn('⚠️ Slow interaction detected. Consider optimizing event handlers.');
    }
    
    if (metrics.renderCount > 10) {
      console.warn('⚠️ High render count detected. Consider memoization or state optimization.');
    }
    
    console.groupEnd();
  }, [enabled, logToConsole, componentName]);

  // Measure async operations
  const measureAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    if (!enabled) {
      return operation();
    }

    const start = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - start;
      
      if (logToConsole) {
        console.log(`[Performance] ${componentName} ${operationName}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      if (logToConsole) {
        console.log(`[Performance] ${componentName} ${operationName} (failed): ${duration.toFixed(2)}ms`);
      }
      
      throw error;
    }
  }, [enabled, componentName, logToConsole]);

  // Mark performance milestones
  const mark = useCallback((milestone: string) => {
    if (!enabled) return;
    
    const timestamp = performance.now();
    
    if (logToConsole) {
      console.log(`[Performance] ${componentName} milestone "${milestone}": ${timestamp.toFixed(2)}ms`);
    }
    
    // Use Performance API marks if available
    if ('mark' in performance) {
      performance.mark(`${componentName}-${milestone}`);
    }
  }, [enabled, componentName, logToConsole]);

  // Measure between two marks
  const measure = useCallback((startMark: string, endMark: string, measureName?: string) => {
    if (!enabled || !('measure' in performance)) return;
    
    try {
      const name = measureName || `${componentName}-${startMark}-to-${endMark}`;
      performance.measure(name, `${componentName}-${startMark}`, `${componentName}-${endMark}`);
      
      const measures = performance.getEntriesByName(name, 'measure');
      const lastMeasure = measures[measures.length - 1];
      
      if (lastMeasure && logToConsole) {
        console.log(`[Performance] ${name}: ${lastMeasure.duration.toFixed(2)}ms`);
      }
    } catch (error) {
      if (logToConsole) {
        console.warn(`[Performance] Failed to measure ${startMark} to ${endMark}:`, error);
      }
    }
  }, [enabled, componentName, logToConsole]);

  return {
    startInteraction,
    endInteraction,
    getMetrics,
    logSummary,
    measureAsync,
    mark,
    measure,
    enabled,
  };
}

/**
 * Higher-order component to wrap components with performance monitoring
 */
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const PerformanceMonitoredComponent: React.FC<P> = (props: P) => {
    const name = componentName || Component.displayName || Component.name || 'Unknown';
    const { logSummary } = useCommentPerformance(name);

    // Log summary on unmount
    useEffect(() => {
      return () => {
        logSummary();
      };
    }, [logSummary]);

    return React.createElement(Component, props);
  };

  PerformanceMonitoredComponent.displayName = `withPerformanceMonitoring(${componentName || Component.displayName || Component.name || 'Component'})`;

  return PerformanceMonitoredComponent;
}
