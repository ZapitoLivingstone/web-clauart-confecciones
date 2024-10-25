import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Importamos la configuración de Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import '../styles/styleAuth.css';

const Registro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegisterSubmit = async(e) => {
    e.preventDefault();
    
    let formErrors = {};

    // Validacion de email
    if (!email) {
      formErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!validateEmail(email)) {
      formErrors.email = 'El correo electrónico no es válido.';
    }

    // Validacion de contraseña
    if (!password) {
      formErrors.password = 'La contraseña es obligatoria.';
    } else if (!validatePassword(password)) {
      formErrors.password = 'La contraseña debe tener al menos 8 caracteres, una letra y un número.';
    }

    // Validación de confirmación de contraseña
    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(formErrors).length === 0) {
      console.log('Registro exitoso:', { email, password });
    } else {
      setErrors(formErrors);
    }
    
    setLoading(true);

    try {
      // Registro en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Agregar información del usuario en Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        fecha_registro: new Date(),
        rol: 'usuario'
      });

      console.log('Registro exitoso:', user);
      setLoading(false);
    } catch (error) {
      console.error('Error en el registro:', error);
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
