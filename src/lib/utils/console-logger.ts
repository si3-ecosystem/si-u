/**
 * Console logger utility that suppresses console output in production
 * while keeping it available in development
 */

type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'info';

class ConsoleLogger {
  private isProduction: boolean;
  private originalMethods: Record<LogLevel, typeof console.log>;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.originalMethods = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
      info: console.info,
    };
    
    if (this.isProduction) {
      this.suppressConsole();
    }
  }

  /**
   * Suppress console methods in production
   */
  private suppressConsole(): void {
    // Only suppress log, debug, and info in production
    // Keep warn and error for critical issues
    if (typeof window !== 'undefined') {
      console.log = () => {};
      console.debug = () => {};
      console.info = () => {};
      
      // Optional: Add a prefix to warn/error messages in production
      console.warn = (...args: any[]) => {
        this.originalMethods.warn('[APP]', ...args);
      };
      console.error = (...args: any[]) => {
        this.originalMethods.error('[APP]', ...args);
      };
    }
  }

  /**
   * Restore original console methods (useful for debugging)
   */
  public restoreConsole(): void {
    if (typeof window !== 'undefined') {
      console.log = this.originalMethods.log;
      console.warn = this.originalMethods.warn;
      console.error = this.originalMethods.error;
      console.debug = this.originalMethods.debug;
      console.info = this.originalMethods.info;
    }
  }

  /**
   * Check if we're in production
   */
  public isProd(): boolean {
    return this.isProduction;
  }

  /**
   * Safe logging method that respects environment
   */
  public log(level: LogLevel, ...args: any[]): void {
    if (!this.isProduction || level === 'error' || level === 'warn') {
      const method = this.originalMethods[level] || console.log;
      method(...args);
    }
  }
}

// Create singleton instance
const consoleLogger = new ConsoleLogger();

// Export for use in components
export { consoleLogger };

// Export convenience methods
export const log = (...args: any[]) => consoleLogger.log('log', ...args);
export const warn = (...args: any[]) => consoleLogger.log('warn', ...args);
export const error = (...args: any[]) => consoleLogger.log('error', ...args);
export const debug = (...args: any[]) => consoleLogger.log('debug', ...args);
export const info = (...args: any[]) => consoleLogger.log('info', ...args);

// Export for conditional logging
export const shouldLog = !consoleLogger.isProd();