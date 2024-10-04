import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cuenta = () => {
  // Estado para manejar los campos del formulario
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Función para manejar el envío del formulario de inicio de sesión
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de autenticación
    console.log('Login:', { loginEmail, loginPassword });
  };

  // Función para manejar el envío del formulario de registro
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Aquí puedes agregar la lógica de registro
    console.log('Registro:', { registerName, registerEmail, registerPassword });
  };

  return (
    <>
      <header className="bg-primary text-white py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="m-0">Mi cuenta</h1>
          </div>
          <div>
            <a href="/" className="text-white mr-3">Inicio</a>
            <a href="/cuenta" className="text-white mr-3">Mi cuenta</a>
            <a href="/carrito" className="text-white">Carrito</a>
          </div>
        </div>
      </header>

      <div className="container my-5">
        <div className="row">
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
                <a href="#">¿Olvidó su contraseña?</a>
              </p>
            </form>
          </div>

          <div className="col-md-6">
            <h3 className="text-center">Registrarse</h3>
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label htmlFor="registerName">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control"
                  id="registerName"
                  placeholder="Ingrese su nombre completo"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="registerEmail">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  id="registerEmail"
                  placeholder="Ingrese su correo electrónico"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="registerPassword">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="registerPassword"
                  placeholder="Cree una contraseña"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="registerConfirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="registerConfirmPassword"
                  placeholder="Confirme su contraseña"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-success btn-block">Registrarse</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cuenta;
