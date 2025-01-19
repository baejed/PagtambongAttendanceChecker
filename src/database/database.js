import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

class MainDatabase {
  static firebaseConfig = {
    apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "pagtambong.firebaseapp.com",
    projectId: "pagtambong",
    storageBucket: "pagtambong.firebasestorage.app",
    messagingSenderId: "214065685114",
    appId: "1:214065685114:web:569de195d0c7171e5191c3",
    measurementId: "G-B3J0XHVMQZ",
  };

  static firebaseApp = initializeApp(MainDatabase.firebaseConfig);

  static db = getFirestore(MainDatabase.firebaseApp);
}

export default MainDatabase;
