import { apiClient } from '@/services/api';

export interface CreateAdminUserPayload {
  email: string;
  username?: string;
  roles?: string[]; // includes 'team'
  wallet_address?: string;
}

export interface UpdateUserRolesPayload {
  roles: string[];
}

export class AdminUserService {
  static async createUser(payload: CreateAdminUserPayload) {
    // Backend not implemented yet; this will call the expected endpoint
    return apiClient.post('/admin/users', payload);
  }

  static async updateUserRoles(userId: string, roles: string[]) {
    return apiClient.patch(`/admin/users/${userId}/role`, { roles } as UpdateUserRolesPayload);
  }
}

