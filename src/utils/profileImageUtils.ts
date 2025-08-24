/**
 * Profile Image Utilities
 * Helper functions for handling profile images across the application
 */

import { UserData } from '@/redux/slice/userSlice';

/**
 * Get the profile image URL for a user, prioritizing profileImage over avatar
 * @param user - User data object
 * @param fallbackUrl - Optional fallback URL if no image is found
 * @returns Profile image URL or fallback
 */
export function getProfileImageUrl(user?: UserData | null, fallbackUrl?: string): string | undefined {


  if (!user) {
    return fallbackUrl;
  }

  // Prioritize the new profileImage field (IPFS) over the legacy avatar field
  if (user.profileImage) {
    return user.profileImage;
  }

  // Fall back to legacy avatar field
  if (user.avatar) {
    return user.avatar;
  }

  // Return fallback if provided
  return fallbackUrl;
}

/**
 * Check if user has a profile image (either profileImage or avatar)
 * @param user - User data object
 * @returns Boolean indicating if user has a profile image
 */
export function hasProfileImage(user?: UserData | null): boolean {
  if (!user) return false;
  return !!(user.profileImage || user.avatar);
}

/**
 * Get user initials for avatar fallback
 * @param user - User data object
 * @returns User initials string
 */
export function getUserInitials(user?: UserData | null): string {
  if (!user) return 'U';
  
  // Try username first
  if (user.username) {
    return user.username.charAt(0).toUpperCase();
  }
  
  // Try first and last name
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  
  // Try just first name
  if (user.firstName) {
    return user.firstName.charAt(0).toUpperCase();
  }
  
  // Try email
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  // Default fallback
  return 'U';
}

/**
 * Get display name for user
 * @param user - User data object
 * @returns Display name string
 */
export function getDisplayName(user?: UserData | null): string {
  if (!user) return 'Unknown User';
  
  // Try username first
  if (user.username) {
    return user.username;
  }
  
  // Try full name
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  // Try just first name
  if (user.firstName) {
    return user.firstName;
  }
  
  // Try name field
  if (user.name) {
    return user.name;
  }
  
  // Try email (without domain)
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'Unknown User';
}

/**
 * Check if the profile image is from IPFS (new system)
 * @param user - User data object
 * @returns Boolean indicating if using IPFS image
 */
export function isUsingIPFSImage(user?: UserData | null): boolean {
  if (!user?.profileImage) return false;
  return user.profileImage.includes('gateway.pinata.cloud/ipfs/') || 
         user.profileImage.includes('ipfs://');
}

/**
 * Get profile image source type for debugging/display
 * @param user - User data object
 * @returns String indicating the source of the profile image
 */
export function getProfileImageSource(user?: UserData | null): 'ipfs' | 'legacy' | 'none' {
  if (!user) return 'none';
  
  if (user.profileImage) {
    return 'ipfs';
  }
  
  if (user.avatar) {
    return 'legacy';
  }
  
  return 'none';
}
