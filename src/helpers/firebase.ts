// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlO-XS_7KnPiEykzo9h4YxjVBoCvGUqqc",
  authDomain: "managme-dbed0.firebaseapp.com",
  projectId: "managme-dbed0",
  storageBucket: "managme-dbed0.appspot.com",
  messagingSenderId: "345190827516",
  appId: "1:345190827516:web:cfbc22cc697e6a49f95e79",
  measurementId: "G-VBW5R5KZVP",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
