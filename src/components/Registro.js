//Registro.js
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Registro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    // Validaciones
    if (!email) formErrors.email = 'El correo electrónico es obligatorio.';
    if (!password) formErrors.password = 'La contraseña es obligatoria.';
    if (password !== confirmPassword) formErrors.confirmPassword = 'Las contraseñas no coinciden.';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar usuario en Firestore con dirección y teléfono
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        direccion,
        telefono,
        fecha_registro: new Date(),
        rol: 'usuario'
      });

      setLoading(false);
      navigate('/user'); // Redirigir a la vista de usuario
    } catch (error) {
      console.error('Error en el registro:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <div className="container my-5">
        <div className="col-md-6 offset-md-3">
          <h3 className="text-center">Registrarse</h3>
          <form onSubmit={handleRegisterSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="registerEmail">Correo Electrónico</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="registerEmail"
                placeholder="Ingrese su correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="registerPassword">Contraseña</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="registerPassword"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                id="confirmPassword"
                placeholder="Confirme su contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
            <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input
              type="text"
              className="form-control"
              id="direccion"
              placeholder="Ingrese su dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              className="form-control"
              id="telefono"
              placeholder="Ingrese su teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
            <button type="submit" className="btn btn-primary btn-block">
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registro;
