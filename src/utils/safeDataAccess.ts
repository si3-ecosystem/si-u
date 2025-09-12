// Utility functions for safe data access in publisher components

// Helper function to safely get string data with fallback
export const safeString = (
  value: string | undefined | null,
  fallback: string = ""
): string => {
  if (!value || typeof value !== "string" || value.trim() === "") {
    return fallback;
  }
  return value;
};

// Helper function to safely get array data with fallback
export const safeArray = <T>(
  value: T[] | undefined | null,
  fallback: T[] = []
): T[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback;
  }
  return value;
};

// Helper function to safely get object data with fallback
export const safeObject = <T>(value: T | undefined | null, fallback: T): T => {
  if (!value || typeof value !== "object") {
    return fallback;
  }
  return value;
};

// Helper function to check if data has meaningful content
export const hasData = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") {
    return Object.keys(value).some((key) => hasData(value[key]));
  }
  return true;
};

// Helper function to safely merge objects with fallbacks
export const safeMerge = <T extends Record<string, any>>(
  target: T,
  source: Partial<T> | undefined | null
): T => {
  if (!source || !hasData(source)) {
    return target;
  }
  return { ...target, ...source };
};
