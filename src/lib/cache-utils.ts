/**
 * Utility functions for cache management
 */

export async function invalidateCache(tag: string) {
  try {
    // Use the general revalidate endpoint
    const response = await fetch(`/api/revalidate?tag=${tag}`, { 
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.warn('Cache invalidation failed:', response.statusText);
    } else {
      const result = await response.json();
      console.log('Cache invalidated successfully:', result);
    }
  } catch (error) {
    console.warn('Cache invalidation error:', error);
  }
}

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}