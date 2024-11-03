import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Importamos la configuración de Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/styleAuth.css';

const Registro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    let formErrors = {};

    if (!email) {
      formErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!validateEmail(email)) {
      formErrors.email = 'El correo electrónico no es válido.';
    }

    if (!password) {
      formErrors.password = 'La contraseña es obligatoria.';
    } else if (!validatePassword(password)) {
      formErrors.password = 'La contraseña debe tener al menos 8 caracteres, una letra y un número.';
    }

    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verificar si ya existe un administrador en la base de datos
      const adminQuery = await getDoc(doc(db, 'admin', 'uniqueAdminDoc'));
      
      let rol = 'usuario';
      if (!adminQuery.exists()) {
        rol = 'admin'; // Si no hay administrador, el primer usuario registrado será el administrador
        await addDoc(collection(db, 'admin'), { uid: user.uid }); // Guarda un marcador de administrador
      }

      // Guardar usuario en la colección 'users'
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        fecha_registro: new Date(),
        rol: rol
      });

      console.log('Registro exitoso:', user);
      setLoading(false);

      // Redirigir según el rol
      if (rol === 'admin') {
        navigate('/admin'); // Redirige a la vista de administrador
      } else {
        navigate('/user'); // Redirige a la vista de usuario
      }
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
