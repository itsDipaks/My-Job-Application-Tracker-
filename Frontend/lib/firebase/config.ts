import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq9ksTz4cLmTD9REuoCsxjHqWf7ibayIc",
  authDomain: "jobtracker-b2580.firebaseapp.com",
  projectId: "jobtracker-b2580",
  storageBucket: "jobtracker-b2580.firebasestorage.app",
  messagingSenderId: "882099912573",
  appId: "1:882099912573:web:e74f3e51e43cffd8875614",
};
// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
// Initialize on client side only
if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
}
// Export with runtime check
const getAuthInstance = (): Auth => {
  if (!auth) {
    throw new Error('Firebase auth not initialized. Make sure this runs on the client side.');
  }
  return auth;
};
export { auth, getAuthInstance };
export default app;
