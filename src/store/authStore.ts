
import { create } from 'zustand';
import { AuthState, User } from '../types/auth';
import { auth } from '../utils/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

export const useAuthStore = create<AuthState>((set) => {
  // Initialize auth state from Firebase
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        role: 'engineer' // Default role
      };
      
      set({
        user,
        token: firebaseUser.refreshToken,
        isAuthenticated: true
      });
    } else {
      set({
        user: null,
        token: null,
        isAuthenticated: false
      });
    }
  });

  return {
    user: null,
    token: null,
    isAuthenticated: false,

    login: async (email: string, password: string) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Create user object from firebase user
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
          role: 'engineer' // Default role - you might want to store this in a database
        };

        set({
          user,
          token: firebaseUser.refreshToken,
          isAuthenticated: true
        });
      } catch (error) {
        console.error('Login failed:', error);
        
        // Determine the type of error and throw appropriate message
        if (error instanceof Error) {
          const errorCode = (error as any).code;
          if (errorCode === 'auth/user-not-found') {
            throw new Error('User not found');
          } else if (errorCode === 'auth/wrong-password') {
            throw new Error('Invalid password');
          } else if (errorCode === 'auth/invalid-credential') {
            throw new Error('Invalid credentials');
          } else {
            throw new Error('Login failed');
          }
        } else {
          throw new Error('An unexpected error occurred');
        }
      }
    },

    logout: async () => {
      try {
        await signOut(auth);
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      } catch (error) {
        console.error('Logout failed:', error);
        throw error;
      }
    }
  };
});
