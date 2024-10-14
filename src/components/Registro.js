import React, { useState } from 'react';
import '../styles/styleAuth.css'; // Importar el CSS

const Registro = () => {
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Registro:', { registerName, registerEmail, registerPassword });
  };

  return (
    <div className="container my-5">
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
  );
};

export default Registro;
