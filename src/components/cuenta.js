import React from 'react';

const Cuenta = () => {
  return (
    <>
      <header className="bg-primary text-white py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="m-0">Mi cuenta</h1>
          </div>
          <div>
            <a href="index.html" className="text-white mr-3">Inicio</a>
            <a href="cuenta.html" className="text-white mr-3">Mi cuenta</a>
            <a href="carrito.html" className="text-white">Carrito</a>
          </div>
        </div>
      </header>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-6 mb-4">
            <h3 className="text-center">Iniciar Sesión</h3>
            <form>
              <div className="form-group">
                <label htmlFor="loginEmail">Correo Electrónico</label>
                <input type="email" className="form-control" id="loginEmail" placeholder="Ingrese su correo electrónico" />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Contraseña</label>
                <input type="password" className="form-control" id="loginPassword" placeholder="Ingrese su contraseña" />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Iniciar Sesión</button>
              <p className="text-center mt-3">
                <a href="password-reset.html">¿Olvidó su contraseña?</a>
              </p>
            </form>
          </div>

          <div className="col-md-6">
            <h3 className="text-center">Registrarse</h3>
            <form>
              <div className="form-group">
                <label htmlFor="registerName">Nombre Completo</label>
                <input type="text" className="form-control" id="registerName" placeholder="Ingrese su nombre completo" />
              </div>
              <div className="form-group">
                <label htmlFor="registerEmail">Correo Electrónico</label>
                <input type="email" className="form-control" id="registerEmail" placeholder="Ingrese su correo electrónico" />
              </div>
              <div className="form-group">
                <label htmlFor="registerPassword">Contraseña</label>
                <input type="password" className="form-control" id="registerPassword" placeholder="Cree una contraseña" />
              </div>
              <div className="form-group">
                <label htmlFor="registerConfirmPassword">Confirmar Contraseña</label>
                <input type="password" className="form-control" id="registerConfirmPassword" placeholder="Confirme su contraseña" />
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
