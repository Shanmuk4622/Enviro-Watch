// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "nothing-d7795",
  "appId": "1:970761747972:web:a3d13c0799c38a0a13ff51",
  "storageBucket": "nothing-d7795.firebasestorage.app",
  "apiKey": "AIzaSyDb_mImhsRB31ggWuYpDLYrVAUYB12LoJo",
  "authDomain": "nothing-d7795.firebaseapp.com",
  "messagingSenderId": "970761747972",
  "measurementId": "G-NM54E86EP9"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
