
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB5STm_sxcJ-ESsGrdI_Vj7rjZib07P28A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "civilplanner-49fcc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "civilplanner-49fcc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "civilplanner-49fcc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "915978277757",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:915978277757:web:9bbf886765fbca75a3b214",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZP1X53YW6P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
