
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDe5Z5cVhreXu9a95vBFvlCt-5rmYQpdUo",
  authDomain: "civil-planner-demo.firebaseapp.com",
  projectId: "civil-planner-demo",
  storageBucket: "civil-planner-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
