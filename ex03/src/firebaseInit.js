// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-Nhb6Na1ZJmnMsZ3a4KMD1-7jNDtplyU",
  authDomain: "authentication-a4a37.firebaseapp.com",
  projectId: "authentication-a4a37",
  storageBucket: "authentication-a4a37.appspot.com",
  messagingSenderId: "1014541273023",
  appId: "1:1014541273023:web:105880e5efefc5d521830a",
  measurementId: "G-B0ZH3SLTNW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);