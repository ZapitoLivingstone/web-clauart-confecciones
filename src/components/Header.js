import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; 
import { supabase } from '../supabase';
import '../styles/Header.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerText, setHeaderText] = useState({
    title: 'CLAUART Confecciones',
    subtitle: 'Taller de confecciones de prendas de vestir',
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateHeaderText = () => {
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
    };

    updateHeaderText();
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (session?.user) {
          const { data, error } = await supabase
            .from('usuarios')
            .select('rol')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error al obtener el rol:', error.message);
            setIsAdmin(false);
          } else {
            setIsAdmin(data.rol === 'admin');
          }
          setIsLoggedIn(true);
        } else {
          setIsAdmin(false);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Error al obtener la sesión o el rol del usuario:', err.message);
        setIsAdmin(false);
        setIsLoggedIn(false);
      }
    };

    fetchUserRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        fetchUserRole();
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setIsAdmin(false);
      navigate('/InicioSesion');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header bg-white text-black py-4 shadow-sm">
      <div className="header-container container d-flex justify-content-between align-items-center">
        <div className="header-title">
          <h1 className="m-0 text-dark">{headerText.title}</h1>
          <p className="m-0 text-muted">{headerText.subtitle}</p>
        </div>
        <div className="header-links d-none d-md-flex align-items-center">
          <Link to="/" className="text-dark me-3 text-decoration-none">Inicio</Link>
          {isLoggedIn ? (
            <>
              <Link to="/MiCuenta" className="text-dark me-3 text-decoration-none">Mi cuenta</Link>
              <div className="dropdown">
                <button
                  className="btn btn-outline-dark dropdown-toggle"
                  type="button"
                  id="userMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Menu size={20} className="me-1" /> Menú
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
                  <li><Link to="/MisPedidos" className="dropdown-item">Mis Pedidos</Link></li>
                  <li><Link to="/Carrito" className="dropdown-item">Carrito</Link></li>
                  {isAdmin && <li><Link to="/PanelAdmin" className="dropdown-item">Panel de Administrador</Link></li>}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button onClick={handleLogout} className="dropdown-item text-danger">Cerrar Sesión</button></li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link to="/InicioSesion" className="text-dark me-3 text-decoration-none">Iniciar Sesión</Link>
              <Link to="/Registro" className="text-dark me-3 text-decoration-none">Registrarse</Link>
            </>
          )}
        </div>
        
        <div className="d-md-none">
          <button 
            className="btn btn-outline-dark" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu-overlay position-fixed top-0 start-0 w-100 h-100 bg-white d-md-none">
            <div className="container mt-5">
              <Link to="/" className="d-block py-2 text-dark text-decoration-none" onClick={toggleMenu}>Inicio</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/MiCuenta" className="d-block py-2 text-dark text-decoration-none" onClick={toggleMenu}>Mi cuenta</Link>
                  <Link to="/MisPedidos" className="d-block py-2 text-dark text-decoration-none" onClick={toggleMenu}>Mis Pedidos</Link>
                  <Link to="/Carrito" className="d-block py-2 text-dark text-decoration-none" onClick={toggleMenu}>Carrito</Link>
                  {isAdmin && (
                    <Link to="/PanelAdmin" className="d-block py-2 text-dark text-decoration-none" onClick={toggleMenu}>
                      Panel de Administrador
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }} 
                    className="d-block py-2 text-danger bg-transparent border-0 text-start w-100"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/InicioSesion" className="d-block py-2 text-dark text-decoration-none" onClick={toggleMenu}>Iniciar Sesión</Link>
                  <Link to="/Registro" className="d-block py-2 text-dark text-decoration-none" onClick={toggleMenu}>Registrarse</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;