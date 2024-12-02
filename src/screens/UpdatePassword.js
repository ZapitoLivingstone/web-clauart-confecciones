import React, { useState } from "react";
import { supabase } from "../supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/UpdatePassword.css";


const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError("Hubo un problema al actualizar la contraseña.");
        console.error("Error al actualizar contraseña:", error);
      } else {
        setMensaje("Contraseña actualizada correctamente.");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Inténtalo más tarde.");
      console.error("Error inesperado:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="update-password-container">
        <h2>Actualizar Contraseña</h2>
        <p>Ingresa tu nueva contraseña para continuar.</p>
        <form onSubmit={handlePasswordUpdate} className="update-password-form">
          <div className="form-group">
            <label htmlFor="password">Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Introduce tu nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {mensaje && <p className="success-message">{mensaje}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">
            Actualizar Contraseña
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UpdatePassword;
