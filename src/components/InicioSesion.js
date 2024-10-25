import React, { useState } from 'react';
import { auth } from '../firebase';
import { FaGoogle } from 'react-icons/fa';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, fetchSignInMethodsForEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import '../styles/styleAuth.css';

const InicioSesion = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    let formErrors = {};

    // Validación de email
    if (!loginEmail) {
      formErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!validateEmail(loginEmail)) {
      formErrors.email = 'El correo electrónico no es válido.';
    }

    // Validación de contraseña
    if (!loginPassword) {
      formErrors.password = 'La contraseña es obligatoria.';
    }

    if (Object.keys(formErrors).length === 0) {
      console.log('Login exitoso:', { loginEmail, loginPassword });
    } else {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    
    try {
      // Inicio de sesión con email y contraseña
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log('Inicio de sesión exitoso');
      setLoading(false);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setLoading(false);
    }
  };

  // Proveedor de Google
  const provider = new GoogleAuthProvider();

  // Manejar el inicio de sesión con Google
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verificar si el usuario ya tiene un método de inicio de sesión
      const methods = await fetchSignInMethodsForEmail(auth, user.email);

      if (methods.length === 0) {
        // Usuario nuevo, puedes crear una cuenta
        console.log('Nuevo usuario, creando cuenta...');
      } else {
        // Usuario ya registrado
        console.log('Inicio de sesión con Google exitoso');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error en el inicio de sesión con Google:', error);
      setLoading(false);
    }
  };

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
            <a href="/Carrito" className="text-white">Carrito</a>
          </div>
        </div>
      </header>
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
