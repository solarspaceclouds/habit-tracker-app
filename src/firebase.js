// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuP0gKhF-CEP1zCF3aWt_FTnGGQ6vygJU",
  authDomain: "habittracker-space.firebaseapp.com",
  projectId: "habittracker-space",
  storageBucket: "habittracker-space.appspot.com",
  messagingSenderId: "790339805382",
  appId: "1:790339805382:web:f3536f44ec5ceb3f5ab7c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };