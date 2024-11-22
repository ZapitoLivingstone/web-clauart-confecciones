import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import '../styles/styleAuth.css';

const InicioSesion = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setErrors({ general: 'Credenciales incorrectas o cuenta no confirmada.' });
        setLoading(false);
        return;
      }

      const { error: userError, data: userData } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('email', loginEmail)
        .single();

      if (userError || !userData) {
        setErrors({ general: 'No se pudo obtener información de usuario.' });
        setLoading(false);
        return;
      }

      if (userData.rol === 'admin') {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (error) {
      setErrors({ general: 'Hubo un problema con el inicio de sesión.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });

      if (error) {
        setErrors({ general: 'Error al iniciar sesión con Google.' });
        setLoading(false);
        return;
      }

      navigate('/');
    } catch (error) {
      setErrors({ general: 'Hubo un problema al iniciar sesión con Google.' });
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <div className="col-md-6 offset-md-3">
          <h3 className="text-center">Iniciar Sesión</h3>
          <form onSubmit={handleLoginSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="loginEmail">Correo Electrónico</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="loginEmail"
                placeholder="Ingrese su correo electrónico"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Contraseña</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="loginPassword"
                placeholder="Ingrese su contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            {errors.general && <div className="alert alert-danger">{errors.general}</div>}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <hr />
            <button
              className="btn btn-danger btn-block d-flex align-items-center justify-content-center"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? 'Procesando...' : (
                <>
                  <FaGoogle size={20} className="me-2" />
                  Iniciar sesión con Google
                </>
              )}
            </button>

            <p className="text-center mt-3">
              <Link to="/OlvidoContrasena" className="text-primary">¿Olvidó su contraseña?</Link>
            </p>
            <p className="text-center mt-3">
              ¿No tienes cuenta? <Link to="/Registro" className="text-primary">Regístrate aquí</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default InicioSesion;
