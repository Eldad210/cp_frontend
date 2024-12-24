import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { AuthState, User } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      const mockToken = 'mock.jwt.token';
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        role: 'engineer'
      };

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }
}));