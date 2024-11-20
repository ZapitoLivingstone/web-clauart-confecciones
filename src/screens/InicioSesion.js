import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // Importamos la configuración de Supabase
import '../styles/styleAuth.css';

const InicioSesion = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        // Iniciar sesión con email y contraseña en Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

        if (error) {
          setErrors({ general: 'Error en el inicio de sesión, por favor verifique sus credenciales.' });
          setLoading(false);
          return;
        }

        // Verificar si el usuario existe en la tabla 'users'
        const { error: userError } = await supabase
          .from('users')
          .select()
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.log("Nuevo usuario detectado, creando documento en Supabase...");
          // Crear un nuevo usuario si no existe
          await supabase.from('users').insert([{
            id: data.user.id,
            email: data.user.email,
            displayName: data.user.user_metadata.full_name || loginEmail,
            createdAt: new Date(),
          }]);
          console.log('Nuevo usuario creado en Supabase.');
        } else {
          console.log('Usuario ya registrado en Supabase.');
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

  // Manejar el inicio de sesión con Google
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        console.error('Error en el inicio de sesión con Google:', error);
        setLoading(false);
        return;
      }

      // Verificar si el usuario existe en la tabla 'users'
      const { error: userError } = await supabase
        .from('users')
        .select()
        .eq('id', data.user.id)
        .single();

      if (userError) {
        console.log("Nuevo usuario detectado, creando documento en Supabase...");
        // Crear un nuevo usuario si no existe
        await supabase.from('users').insert([{
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.user_metadata.full_name,
          createdAt: new Date(),
          metodo_registro: 'google',
        }]);
        console.log('Nuevo usuario creado en Supabase.');
      } else {
        console.log('Usuario ya registrado en Supabase.');
      }

      setLoading(false);
      navigate('/'); // Redirige al inicio después de iniciar sesión
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
