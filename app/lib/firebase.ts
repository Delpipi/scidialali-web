import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: "scidialali-api.firebaseapp.com",
  projectId: "scidialali-api",
  storageBucket: "scidialali-api.firebasestorage.app",
  messagingSenderId: "248401107041",
  appId: "1:248401107041:web:e4aff3feabcbabd11d3220",
  measurementId: "G-Y8N5GVJ5PJ",
};

let firebase: any;

if (!firebase) {
  firebase = initializeApp(firebaseConfig);
}

export default firebase;
