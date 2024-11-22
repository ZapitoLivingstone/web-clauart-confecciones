import React, { useState } from 'react';
import { supabase } from '../supabase';  // Asegúrate de que hayas configurado Supabase correctamente
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Validaciones from '../components/Validaciones';

const Registro = () => {
  const [nombre, setNombre] = useState('');  // Agregar estado para el nombre
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validar el formulario
  const validarFormulario = () => {
    const nuevoErrores = {};
    nuevoErrores.nombre = Validaciones.texto(nombre, 'Nombre');
    nuevoErrores.email = Validaciones.email(email);
    nuevoErrores.password = Validaciones.password(password);
    nuevoErrores.confirmPassword = Validaciones.confirmPassword(confirmPassword, password);
    nuevoErrores.telefono = Validaciones.telefono(telefono);
    nuevoErrores.direccion = Validaciones.direccion(direccion);
    
    setErrors(nuevoErrores);
    return !Object.values(nuevoErrores).some((error) => error);
  };
  

  // Manejar el envío del formulario
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
  
    if (!validarFormulario() || loading) return;
  
    setLoading(true);
  
    try {
      const { data, error: authError } = await supabase.auth.signUp(
        {
          email,
          password,
        },
        { autoSignIn: false } // Evita el inicio de sesión automático
      );
  
      if (authError) {
        if (authError.message.includes('email rate limit exceeded')) {
          throw new Error('Demasiados intentos de registro. Por favor, intente más tarde.');
        }
        throw new Error(authError.message);
      }
  
      const user = data?.user;
  
      if (!user) {
        throw new Error('No se pudo crear el usuario.');
      }
  
      // Insertar datos en la tabla 'usuarios'
      const { error } = await supabase
        .from('usuarios')
        .upsert(
          {
            id: user.id,
            nombre, // Incluir nombre en el registro
            email: user.email,
            direccion,
            telefono,
            fecha_registro: new Date(),
            rol: 'usuario',
          },
          { onConflict: 'id' }
        );
  
      if (error) throw new Error(error.message);
  
      // Redirigir al formulario de inicio de sesión
      navigate('/InicioSesion');
    } catch (error) {
      console.error('Registration Error:', error);
      alert('Error en el registro: ' + (error.message || 'Error desconocido'));
    } finally {
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
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              id="nombre"
              placeholder="Ingrese su nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>
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
              {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registro;
