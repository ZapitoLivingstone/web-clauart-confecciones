import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import ModalGenerico from '../components/ModalGenerico';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const MiCuenta = () => {
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Reautenticar al usuario antes de guardar los cambios
        const credential = EmailAuthProvider.credential(user.email, authPassword);
        await reauthenticateWithCredential(user, credential);

        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, userData);
        setIsEditing(false);
        alert('Información actualizada correctamente');
      }
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      alert('Error al actualizar la información. Verifica tu contraseña.');
    }
  };

  const handleEmailChange = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateEmail(user, newEmail);
        setUserData((prevData) => ({ ...prevData, email: newEmail }));
        alert('Correo electrónico actualizado correctamente');
        setShowEmailModal(false);
      }
    } catch (error) {
      console.error('Error al actualizar el correo electrónico:', error);
      alert('Error al actualizar el correo electrónico');
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        alert('Contraseña actualizada correctamente');
        setShowPasswordModal(false);
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      alert('Error al actualizar la contraseña');
    }
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <>
      <Header />
      <div className="container my-4">
        <h2>Mi Cuenta</h2>
        <div className="card p-4">
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              value={userData.nombre}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={userData.email}
              disabled
            />
            <button className="btn btn-link" onClick={() => setShowEmailModal(true)}>
              Cambiar correo electrónico
            </button>
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input
              type="text"
              className="form-control"
              id="telefono"
              name="telefono"
              value={userData.telefono}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input
              type="text"
              className="form-control"
              id="direccion"
              name="direccion"
              value={userData.direccion}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          {isEditing && (
            <div className="mb-3">
              <label htmlFor="authPassword" className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="authPassword"
                placeholder="Introduce tu contraseña actual"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </div>
          )}
          <div className="d-flex justify-content-between">
            <button className="btn btn-primary" onClick={handleEditToggle}>
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
            {isEditing && (
              <button className="btn btn-success" onClick={handleSave}>
                Guardar Cambios
              </button>
            )}
          </div>
          <div className="mt-3">
            <button className="btn btn-secondary" onClick={() => setShowPasswordModal(true)}>
              Cambiar contraseña
            </button>
          </div>
        </div>
      </div>

      <ModalGenerico
        show={showEmailModal}
        handleClose={() => setShowEmailModal(false)}
        title="Cambiar Correo Electrónico"
        handleConfirm={handleEmailChange}
        confirmText="Actualizar Correo"
      >
        <input
          type="email"
          className="form-control"
          placeholder="Nuevo correo electrónico"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
      </ModalGenerico>

      <ModalGenerico
        show={showPasswordModal}
        handleClose={() => setShowPasswordModal(false)}
        title="Cambiar Contraseña"
        handleConfirm={handlePasswordChange}
        confirmText="Actualizar Contraseña"
      >
        <input
          type="password"
          className="form-control"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          className="form-control mt-2"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </ModalGenerico>
    </>
  );
};

export default MiCuenta;
