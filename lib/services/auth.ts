import { api } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  username: string;
  gender: 'male' | 'female' | 'other';
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  gender: string;
  createdAt: string;
}

export interface AuthResponse {
  user: {
    id: number;
    user_id: number;
    name: string;
    email: string;
    username: string;
    gender: string;
  };
  token: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', data);
    const responseData = response.data;
    
    // Save user and token to cookies
    if (responseData.user && responseData.token) {
      this.setUser(responseData.user, responseData.token);
    }
    
    return responseData;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      // Continue with local logout even if server logout fails
      console.error('Logout error:', error);
    }
    this.clearAuth();
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post('/api/auth/refresh');
    return response.data;
  },

  async getUserProfile(): Promise<{ user: User; profiles: any[] }> {
    const response = await api.get('/api/auth/user-profile');
    return response.data;
  },

  clearAuth(): void {
    if (typeof window !== 'undefined') {      
      // Clear user cookie
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=lax;';
      
      // Clear token cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=lax;';
    }
  },

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      // Get user from cookie
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='));
      
      if (userCookie) {
        try {
          const userValue = decodeURIComponent(userCookie.split('=')[1]);
          return JSON.parse(userValue);
        } catch (error) {
          console.error('Error parsing user cookie:', error);
        }
      }
    }
    return null;
  },

  setUser(user: User, token: string): void {
    if (typeof window !== 'undefined') {      
      // Store user data in cookie
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=lax; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`;
      
      // Store token in cookie for API calls
      document.cookie = `token=${token}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=lax; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      // Check if user cookie exists
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='));
      return !!userCookie;
    }
    return false;
  },
};
