/**
 * Next.js specific console suppression
 * This runs both on server and client side
 */

// Server-side suppression
if (typeof window === 'undefined') {
  // Server-side code
  if (process.env.NODE_ENV === 'production') {
    // Suppress most console output in production
    const originalLog = console.log;
    
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    
    // Keep error and warn for critical issues
    console.warn = (...args: any[]) => {
      originalLog('[SERVER-WARN]', ...args);
    };
    console.error = (...args: any[]) => {
      originalLog('[SERVER-ERROR]', ...args);
    };
  }
} else {
  // Client-side code
  if (process.env.NODE_ENV === 'production') {
    // Suppress console output in production
    const originalLog = console.log;
    
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    
    // Keep error and warn for critical issues
    console.warn = (...args: any[]) => {
      originalLog('[CLIENT-WARN]', ...args);
    };
    console.error = (...args: any[]) => {
      originalLog('[CLIENT-ERROR]', ...args);
    };
  }
}

// Export a function to check if logging is enabled
export const isLoggingEnabled = () => process.env.NODE_ENV !== 'production';