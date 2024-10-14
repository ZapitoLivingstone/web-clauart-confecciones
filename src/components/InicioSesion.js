import React, { useState } from 'react';
import '../styles/styleAuth.css';
import { Link } from 'react-router-dom';

const InicioSesion = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    let formErrors = {};

    // Validacion de email
    if (!loginEmail) {
      formErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!validateEmail(loginEmail)) {
      formErrors.email = 'El correo electrónico no es válido.';
    }

    // Validacion de contraseña
    if (!loginPassword) {
      formErrors.password = 'La contraseña es obligatoria.';
    }

    if (Object.keys(formErrors).length === 0) {
      console.log('Login exitoso:', { loginEmail, loginPassword });
    } else {
      setErrors(formErrors);
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
            <button type="submit" className="btn btn-primary btn-block">Iniciar Sesión</button>
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
