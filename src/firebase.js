import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Firebase config block
const firebaseConfig = {
  apiKey: "AIzaSyBjpUVchUl3dGwvn5ax_42LwVhAKsEa3sw",
  authDomain: "railway-caution-viewer.firebaseapp.com",
  projectId: "railway-caution-viewer",
  storageBucket: "railway-caution-viewer.appspot.com",
  messagingSenderId: "43444362686",
  appId: "1:43444362686:web:5efac3771eb6a73b302def"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Export services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
