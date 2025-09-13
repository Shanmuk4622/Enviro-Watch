// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-2251370852-87c98",
  "appId": "1:1027071218265:web:762c6a60551d1681665748",
  "storageBucket": "studio-2251370852-87c98.firebasestorage.app",
  "apiKey": "AIzaSyCznGdaN8dZUkfvd-2C_cnC7bycIMd5lbs",
  "authDomain": "studio-2251370852-87c98.firebaseapp.com",
  "messagingSenderId": "1027071218265"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
