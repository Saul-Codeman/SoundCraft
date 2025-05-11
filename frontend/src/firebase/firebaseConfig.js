import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log(
  "VITE_FIREBASE_AUTH_DOMAIN:",
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
);
console.log(
  "VITE_FIREBASE_PROJECT_ID:",
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);
console.log("VITE_FIREBASE_APP_ID:", import.meta.env.VITE_FIREBASE_APP_ID);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
