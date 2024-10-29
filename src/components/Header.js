import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore'; // Agregar importaciones necesarias
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [headerText, setHeaderText] = useState({
    title: 'CLAUART Confecciones',
    subtitle: 'Taller de confecciones de prendas de vestir',
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setHeaderText({
          title: 'CLAUART Confecciones',
          subtitle: 'Taller de confecciones de prendas de vestir',
        });
        break;
      case '/Carrito':
        setHeaderText({
          title: 'Tu Carrito',
          subtitle: 'Revisa y gestiona tus productos',
        });
        break;
      case '/PanelAdmin':
        setHeaderText({
          title: 'Panel de Administración',
          subtitle: 'Gestiona los productos y el inventario',
        });
        break;
      default:
        setHeaderText({
          title: 'CLAUART Confecciones',
          subtitle: 'Taller de confecciones de prendas de vestir',
        });
        break;
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserRole = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          setIsLoggedIn(true);
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.rol === 'admin');
          }
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      });
    };

    fetchUserRole();
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('/InicioSesion');
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <header className="bg-primary text-white py-4">
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          <h1 className="m-0">{headerText.title}</h1>
          <p className="m-0">{headerText.subtitle}</p>
        </div>
        <div>
          <Link to="/" className="text-white me-3">Inicio</Link>
          <Link to="/InicioSesion" className="text-white me-3">Mi cuenta</Link>
          <Link to="/Carrito" className="text-white me-3">Carrito</Link>
          {isAdmin && <Link to="/PanelAdmin" className="text-white me-3">Panel de Admin</Link>}
          {isLoggedIn && (
            <button onClick={handleLogout} className="btn btn-sm btn-light">Cerrar Sesión</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
