/**
 * Utility functions for username handling and display
 */

/**
 * Truncates a username to show only the first 4 characters followed by "..."
 * @param username - The username to truncate
 * @param maxLength - Maximum length before truncation (default: 4)
 * @returns Truncated username
 */
export function truncateUsername(username: string, maxLength: number = 6): string {
  if (!username || username.length <= maxLength) {
    return username;
  }
  
  return `${username.substring(0, maxLength)}...`;
}

/**
 * Gets display name from user object with truncation
 * @param user - User object with firstName, lastName, email
 * @param truncate - Whether to truncate the name (default: false)
 * @returns Display name string
 */
export function getDisplayName(
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null | undefined,
  truncate: boolean = false
): string {
  if (!user) return 'Anonymous User';
  
  let displayName: string;
  
  if (user.firstName && user.lastName) {
    displayName = `${user.firstName} ${user.lastName}`;
  } else if (user.email) {
    displayName = user.email.split('@')[0];
  } else {
    displayName = 'Anonymous User';
  }
  
  return truncate ? truncateUsername(displayName) : displayName;
}

/**
 * Gets responsive display name - truncated on mobile, full on desktop
 * @param user - User object
 * @param isMobile - Whether the current view is mobile
 * @returns Appropriate display name for the screen size
 */
export function getResponsiveDisplayName(
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null | undefined,
  isMobile: boolean = false
): string {
  return getDisplayName(user, isMobile);
}
