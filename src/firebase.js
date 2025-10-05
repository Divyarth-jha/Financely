// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBX_MYaX4_NsdBE9F6k014yzeQGRqQEE2Y",
  authDomain: "financely-9189d.firebaseapp.com",
  projectId: "financely-9189d",
  storageBucket: "financely-9189d.firebasestorage.app",
  messagingSenderId: "479840105282",
  appId: "1:479840105282:web:878537a847cb0d606b0edb",
  measurementId: "G-2YLXGX5L3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db , auth ,provider,doc, setDoc};
