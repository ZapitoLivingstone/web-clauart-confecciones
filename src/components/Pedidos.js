import React, { useState, useEffect, useCallback } from 'react';
import HeaderAdmin from './HeaderAdmin';
import { db } from '../firebase';
import { getDocs, collection, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import ModalGenerico from './ModalGenerico';
import 'bootstrap/dist/css/bootstrap.min.css';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState('pedidos');
  const [isLoading, setIsLoading] = useState(false);

  const cargarPedidos = useCallback(async () => {
    setIsLoading(true);
    try {
      const pedidosRef = collection(db, 'pedidos');
      const pedidosSnapshot = await getDocs(pedidosRef);
      const pedidosData = pedidosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Pedidos cargados:", pedidosData);
      setPedidos(pedidosData);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      alert("Error al cargar los pedidos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cargarUsuarios = useCallback(async () => {
    try {
      const usuariosRef = collection(db, 'users');
      const usuariosSnapshot = await getDocs(usuariosRef);
      const usuariosData = {};
      usuariosSnapshot.docs.forEach((doc) => {
        usuariosData[doc.id] = doc.data().nombre;
      });
      setUsuarios(usuariosData);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      alert("Error al cargar los usuarios");
    }
  }, []);

  useEffect(() => {
    cargarPedidos();
    cargarUsuarios();
  }, [cargarPedidos, cargarUsuarios]);

  const verificarDocumento = async (pedidoId) => {
    try {
      console.log(`Verificando documento con ID: ${pedidoId}`);
      const docRef = doc(db, 'pedidos', pedidoId);
      const docSnap = await getDoc(docRef);
      console.log(`Documento existe: ${docSnap.exists()}`);
      return docSnap.exists();
    } catch (error) {
      console.error("Error al verificar documento:", error);
      return false;
    }
  };

  const handleDeletePedido = async () => {
    if (!selectedPedido) return;

    setIsLoading(true);
    try {
      const existe = await verificarDocumento(selectedPedido);
      if (!existe) {
        throw new Error("El pedido no existe");
      }

      const pedidoRef = doc(db, 'pedidos', selectedPedido);
      await deleteDoc(pedidoRef);
      
      setPedidos(prevPedidos => 
        prevPedidos.filter(pedido => pedido.id !== selectedPedido)
      );
      
      setShowModal(false);
      setSelectedPedido(null);
      alert("Pedido eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
      alert(error.message || "Error al eliminar el pedido");
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    setIsLoading(true);
    try {
      console.log(`Intentando actualizar pedido: ${pedidoId} a estado: ${nuevoEstado}`);
      
      const existe = await verificarDocumento(pedidoId);
      if (!existe) {
        throw new Error("El pedido no existe en la base de datos");
      }

      const pedidoRef = doc(db, 'pedidos', pedidoId);
      await updateDoc(pedidoRef, {
        estado: nuevoEstado
      });

      setPedidos(prevPedidos =>
        prevPedidos.map(pedido =>
          pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
        )
      );

      alert("Estado actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      alert(error.message || "Error al actualizar el estado del pedido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <HeaderAdmin pestañaActiva={pestañaActiva} setPestañaActiva={setPestañaActiva} />
      <div className="container mt-4">
        {isLoading && (
          <div className="alert alert-info">
            Cargando...
          </div>
        )}
        <div className="row">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{pedido.nombre}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">ID: {pedido.id}</h6>
                  <p>Usuario: {usuarios[pedido.usuarioId] || 'Usuario desconocido'}</p>
                  <p className="card-text">Descripción: {pedido.descripcion}</p>
                  <p className="card-text">Color: {pedido.color}</p>
                  <p className="card-text">Tamaño: {pedido.size}</p>
                  <p className="card-text">Texto Personalizado: {pedido.customText}</p>

                  <div className="mb-3">
                    <label className="form-label">Estado del Pedido</label>
                    <select
                      className="form-select"
                      value={pedido.estado || 'pendiente'}
                      onChange={(e) => {
                        console.log(`Cambiando estado de pedido ${pedido.id} a ${e.target.value}`);
                        actualizarEstadoPedido(pedido.id, e.target.value);
                      }}
                      disabled={isLoading}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="proceso">En Proceso</option>
                      <option value="completado">Completado</option>
                    </select>
                  </div>

                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      console.log(`Seleccionando pedido para eliminar: ${pedido.id}`);
                      setSelectedPedido(pedido.id);
                      setShowModal(true);
                    }}
                    disabled={isLoading}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalGenerico
        show={showModal}
        handleClose={() => setShowModal(false)}
        title="Confirmar Eliminación"
        handleConfirm={handleDeletePedido}
        confirmText="Eliminar"
      >
        <p>¿Estás seguro de que deseas eliminar el pedido <strong>{selectedPedido}</strong>?</p>
      </ModalGenerico>
    </div>
  );
};

export default Pedidos;