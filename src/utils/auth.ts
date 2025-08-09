/**
 * Authentication Service
 * Handles JWT token management and user authentication
 */

import { TokenPayload, UserRole } from '@/types/rsvp';

export class AuthService {
  private static readonly TOKEN_KEY = 'si3-jwt';
  
  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }
  
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }
  
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }
  
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
      return payload.exp ? payload.exp * 1000 > Date.now() : false;
    } catch {
      return false;
    }
  }
  
  static hasRole(requiredRoles: UserRole[]): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
      return payload.roles.some(role => requiredRoles.includes(role));
    } catch {
      return false;
    }
  }
  
  static isAdmin(): boolean {
    return this.hasRole([UserRole.ADMIN]);
  }
  
  static getUserFromToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      return JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    } catch {
      return null;
    }
  }
}
