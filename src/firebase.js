// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC-01xjp_aWFojk-PrHb36mjwMdvpQim4g",
  authDomain: "web-clauart-confecciones.firebaseapp.com",
  projectId: "web-clauart-confecciones",
  storageBucket: "web-clauart-confecciones.appspot.com",
  messagingSenderId: "1068096656032",
  appId: "1:1068096656032:web:a35a1eb6707cfa0b602fc5",
  measurementId: "G-7XN20EQRMK"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Exporta db y auth como exportaciones nombradas
export { db, auth };
