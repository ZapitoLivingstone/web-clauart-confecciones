import React, { useEffect, useState } from "react";
import CardProductos from "./CardProductos";
import { auth, db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import "../styles/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Inicio = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.rol === 'admin');
        }
      }
    };

    fetchUserRole();
  }, []);

  return (
    <>
      <header className="bg-primary text-white py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="m-0">CLAUART Confecciones</h1>
            <p className="m-0">Taller de confecciones de prendas de vestir</p>
          </div>
          <div>
            <a href="/" className="text-white me-3">Inicio</a>
            <a href="/InicioSesion" className="text-white me-3">Mi cuenta</a>
            <a href="/Carrito" className="text-white me-3">Carrito</a>
            {isAdmin && <a href="/admin-panel" className="text-white">Panel de Admin</a>}
          </div>
        </div>
      </header>

      <div className="container my-5">
        <h2 className="text-center mb-4">Nuestros Productos</h2>
        <CardProductos />
      </div>
    </>
  );
};

export default Inicio;
