import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
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

    // Corregido: Almacenar la función de cleanup retornada por onAuthStateChange
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

    // Cleanup function
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