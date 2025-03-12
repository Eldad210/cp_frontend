
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5STm_sxcJ-ESsGrdI_Vj7rjZib07P28A",
  authDomain: "civilplanner-49fcc.firebaseapp.com",
  projectId: "civilplanner-49fcc",
  storageBucket: "civilplanner-49fcc.firebasestorage.app",
  messagingSenderId: "915978277757",
  appId: "1:915978277757:web:9bbf886765fbca75a3b214",
  measurementId: "G-ZP1X53YW6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
