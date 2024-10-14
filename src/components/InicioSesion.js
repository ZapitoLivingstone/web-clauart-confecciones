import React, { useState } from 'react';
import '../styles/styleAuth.css'; // Importar el CSS

const InicioSesion = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { loginEmail, loginPassword });
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
        <div className="col-md-6 mb-4">
          <h3 className="text-center">Iniciar Sesión</h3>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="loginEmail">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="loginEmail"
                placeholder="Ingrese su correo electrónico"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="loginPassword"
                placeholder="Ingrese su contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Iniciar Sesión</button>
            <p className="text-center mt-3">
              <span>¿Olvidó su contraseña?</span>
            </p>
            <p className="text-center mt-3">
              ¿No tienes cuenta?<a href="/Registro" className="text-white">Regístrate aquí</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default InicioSesion;
