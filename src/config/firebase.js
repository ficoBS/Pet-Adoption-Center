import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOaYyuTW7kIrva_Zb6uBaIw-rc5xzX54U",
  authDomain: "pet-adoption-center-ffcdf.firebaseapp.com",
  projectId: "pet-adoption-center-ffcdf",
  storageBucket: "pet-adoption-center-ffcdf.firebasestorage.app",
  messagingSenderId: "260679283000",
  appId: "1:260679283000:web:db88084f0a29feda2a11cd",
  measurementId: "G-ZB6W3ZFPG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();