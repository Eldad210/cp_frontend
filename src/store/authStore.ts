
import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      // Check if the email is authorized
      if (email !== 'boris@civilplanner.co') {
        throw new Error('Unauthorized email');
      }
      
      // Check if password matches
      if (password !== 'q1w2e3r4!!') {
        throw new Error('Invalid password');
      }
      
      // Proceed with login for authorized email and password
      const mockToken = 'mock.jwt.token';
      const mockUser: User = {
        id: '1',
        email,
        name: 'Boris',
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
