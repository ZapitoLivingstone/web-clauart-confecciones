import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/Header.css';
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
    <header className="header bg-primary text-white py-4">
      <div className="header-container container d-flex justify-content-between align-items-center">
        <div className="header-title">
          <h1 className="m-0">{headerText.title}</h1>
          <p className="m-0">{headerText.subtitle}</p>
        </div>
        <div className="header-links">
          <Link to="/" className="text-white me-3">Inicio</Link>

          {isLoggedIn ? (
            <>
              <Link to="/MiCuenta" className="text-white me-3">Mi cuenta</Link>
              <div className="dropdown d-inline">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Opciones
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li><Link to="/MisPedidos" className="dropdown-item">Mis Pedidos</Link></li>
                  <li><Link to="/Carrito" className="dropdown-item">Carrito</Link></li>
                  {isAdmin && <li><Link to="/PanelAdmin" className="dropdown-item">Panel de Administrador</Link></li>}
                  <li><button onClick={handleLogout} className="dropdown-item">Cerrar Sesión</button></li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link to="/InicioSesion" className="text-white me-3">Iniciar Sesión</Link>
              <Link to="/Registro" className="text-white me-3">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;