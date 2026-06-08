import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  User,
  UserCredential,
  getAuth,
  Auth,
} from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq9ksTz4cLmTD9REuoCsxjHqWf7ibayIc",
  authDomain: "jobtracker-b2580.firebaseapp.com",
  projectId: "jobtracker-b2580",
  storageBucket: "jobtracker-b2580.firebasestorage.app",
  messagingSenderId: "882099912573",
  appId: "1:882099912573:web:e74f3e51e43cffd8875614",
};

// Initialize Firebase and Auth
const getFirebaseAuth = (): Auth => {
  // Initialize app if not already initialized
  if (!getApps().length) {
    initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized in authService');
  }
  return getAuth();
};

// Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface FirebaseAuthResult {
  user: User;
  credential: UserCredential;
}

export const firebaseAuthService = {
  // Sign in with Google
  signInWithGoogle: async (): Promise<FirebaseAuthResult> => {
    try {
      const auth = getFirebaseAuth();
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      return {
        user: result.user,
        credential: result,
      };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  },

  // Sign in with email and password
  signInWithEmail: async (email: string, password: string): Promise<User> => {
    try {
      const auth = getFirebaseAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('No account found with this email');
        case 'auth/wrong-password':
          throw new Error('Incorrect password');
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/user-disabled':
          throw new Error('This account has been disabled');
        default:
          throw new Error(error.message || 'Failed to sign in');
      }
    }
  },

  // Create user with email and password
  signUpWithEmail: async (email: string, password: string): Promise<User> => {
    try {
      const auth = getFirebaseAuth();
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification
      await sendEmailVerification(result.user);
      
      return result.user;
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Email already in use');
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/weak-password':
          throw new Error('Password is too weak. Use at least 6 characters');
        default:
          throw new Error(error.message || 'Failed to create account');
      }
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign-out error:', error);
      throw new Error('Failed to sign out');
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const auth = getFirebaseAuth();
    return auth.currentUser;
  },

  // Get ID token
  getIdToken: async (): Promise<string | null> => {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  },

  // Send email verification
  sendVerificationEmail: async (): Promise<void> => {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    } else {
      throw new Error('No user logged in');
    }
  },

  // Check if email is verified
  isEmailVerified: (): boolean => {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    return user?.emailVerified ?? false;
  },
};
