import React, { useState } from "react";
import { supabase } from "../supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Ruta para la actualización
      });

      if (error) {
        setError("Hubo un problema al enviar el correo. Inténtalo nuevamente.");
        console.error("Error al enviar correo de restablecimiento:", error);
      } else {
        setMensaje(
          "Correo enviado correctamente. Por favor revisa tu bandeja de entrada."
        );
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Inténtalo más tarde.");
      console.error("Error inesperado:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="reset-password-container">
        <h2>Restablecer Contraseña</h2>
        <p>
          Ingresa tu correo electrónico para enviar un enlace de restablecimiento de contraseña.
        </p>
        <form onSubmit={handlePasswordReset} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Introduce tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {mensaje && <p className="success-message">{mensaje}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">
            Enviar Enlace
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;
