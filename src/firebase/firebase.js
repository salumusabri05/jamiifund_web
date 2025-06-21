// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import getAnalytics, but don't initialize it immediately
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBg79tmHROdxkYPppaRNOGZyFweohjumIc",
  authDomain: "jamiifund.firebaseapp.com",
  projectId: "jamiifund",
  storageBucket: "jamiifund.firebasestorage.app",
  messagingSenderId: "540422263356",
  appId: "1:540422263356:web:38379025f96ea816a02939",
  measurementId: "G-RBNCP4YMY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize analytics only on client side
let analytics = null;

// Only initialize analytics in the browser environment
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };