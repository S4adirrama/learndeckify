import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKbBjpHE3V8grHJX5wHHMlK0g4KvhIYRY",
  authDomain: "learndeckify.firebaseapp.com",
  projectId: "learndeckify",
  storageBucket: "learndeckify.appspot.com",
  messagingSenderId: "736447352630",
  appId: "1:736447352630:web:50f8e2ef4b354e40276d97",
  measurementId: "G-SBS47T3PBJ"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);   // Initialize Firebase Auth
const db = getFirestore(app);  // Initialize Firestore

export { auth, db };  // Export both auth and db

