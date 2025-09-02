import { UserRole } from '@/types/comment';
import { useCurrentUserV2 } from '@/hooks/auth/useCurrentUserV2';

/**
 * Hook to derive a canonical UserRole from AuthV2 user roles.
 * Admins inherit the target role when needed.
 */
export function useUserRole(target?: UserRole): UserRole {
  const { user } = useCurrentUserV2();
  const roles = user?.roles || [];

  const isAdmin = roles.includes('admin');
  const isGuide = roles.includes('guide');
  const isScholar = roles.includes('scholar');
  const isPartner = roles.includes('partner');

  if (target) {
    if (roles.includes(target)) return target;
    if (isAdmin) return target; // admin inherits
  }

  if (isGuide || isAdmin) return 'guide';
  if (isScholar) return 'scholar';
  if (isPartner) return 'partner' as UserRole;
  return 'scholar';
}

