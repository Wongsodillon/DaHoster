import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgiyBqolfbp7CDgobrChxEK3OCSqc3QsI",
  authDomain: "dahoster-31a29.firebaseapp.com",
  projectId: "dahoster-31a29",
  storageBucket: "dahoster-31a29.appspot.com",
  messagingSenderId: "180477227445",
  appId: "1:180477227445:web:fe9ce68a610b0101f2e9fc",
  measurementId: "G-Y8QHZLH2KG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();

