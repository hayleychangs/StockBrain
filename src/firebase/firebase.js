// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAdtWSMWnHTDffI1A6VeL-zfM5I3pwqCk",
  authDomain: "my-awesome-project-c8fd0.firebaseapp.com",
  projectId: "my-awesome-project-c8fd0",
  storageBucket: "my-awesome-project-c8fd0.appspot.com",
  messagingSenderId: "638972204522",
  appId: "1:638972204522:web:99f737fca76e21efbb4e93",
  measurementId: "G-KRXB26HE69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);

// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
