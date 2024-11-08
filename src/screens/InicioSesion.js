import React, { useState } from 'react';
import { auth } from '../firebase';
import { FaGoogle } from 'react-icons/fa';
import Header from '../components/Header';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import '../styles/styleAuth.css';

const InicioSesion = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const firestore = getFirestore();

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
      setLoading(true);
      try {
        // Inicio de sesión con email y contraseña
        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        const user = userCredential.user;
        
        const userRef = doc(firestore, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        
        if (!userSnapshot.exists()) {
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName || loginEmail, // Puedes usar el email como displayName si no hay otro
            createdAt: new Date(),
          });
          console.log('Nuevo usuario creado en Firestore.');
        } else {
          console.log('Usuario ya registrado en Firestore.');
        }
        
        console.log('Inicio de sesión exitoso');
        setLoading(false);
        navigate('/'); // Redirige al inicio después de iniciar sesión
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        setErrors({ general: 'Error en el inicio de sesión, por favor verifique sus credenciales.' });
        setLoading(false);
      }
    } else {
      setErrors(formErrors);
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
      const userRef = doc(firestore, "users", user.uid); // Usar el uid como ID del documento
      const userSnapshot = await getDoc(userRef);
  
      if (!userSnapshot.exists()) {
        console.log("Nuevo usuario detectado, creando documento en Firestore...");
        await setDoc(userRef, {
          email: user.email,
          nombre: user.displayName,
          fecha_registro: new Date(),
          metodo_registro: "google",
          rol: "usuario", 
          telefono: "",
          direccion: ""
        });
        console.log('Nuevo usuario creado en Firestore.');
      } else {
        console.log('Usuario ya registrado en Firestore.');
      }
  
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error en el inicio de sesión con Google:', error);
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
