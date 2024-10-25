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

// Inicializa Firestore
const db = getFirestore(app);

// Inicializa Firebase Auth
const auth = getAuth(app);

export { db, auth };
