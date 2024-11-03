import React, { useState, useEffect } from 'react';
import HeaderAdmin from './HeaderAdmin';
import { db } from '../firebase';
import { getDocs, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import ModalGenerico from './ModalGenerico'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const pedidosSnapshot = await getDocs(collection(db, 'pedidos'));
        const pedidosData = pedidosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Pedidos cargados:", pedidosData);
        setPedidos(pedidosData);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      }
    };

    const cargarUsuarios = async () => {
      try {
        const usuariosSnapshot = await getDocs(collection(db, 'users'));
        const usuariosData = {};
        usuariosSnapshot.docs.forEach((doc) => {
          const uid = doc.id;
          const data = doc.data();
          usuariosData[uid] = data.nombre;
        });
        console.log("Usuarios cargados:", usuariosData);
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    cargarPedidos();
    cargarUsuarios();
  }, []);

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      const pedidoRef = doc(db, 'pedidos', pedidoId);
      await updateDoc(pedidoRef, { estado: nuevoEstado });
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  const handleDeletePedido = async (pedidoId) => {
    try {
      await deleteDoc(doc(db, 'pedidos', pedidoId));
      setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== pedidoId));
      setShowModal(false); 
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="container mt-4">
        <div className="row">
          {pedidos.map((pedido, index) => (
            <div key={pedido.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{pedido.nombreProducto}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">ID: {pedido.id}</h6>
                  <p>Usuario: {usuarios[pedido.usuarioId] || 'Usuario desconocido'}</p>
                  <p className="card-text">Descripción: {pedido.descripcion}</p>
                  <p className="card-text">Color: {pedido.color}</p>
                  <p className="card-text">Tamaño: {pedido.size}</p>
                  <p className="card-text">Texto Personalizado: {pedido.customText}</p>

                  <div className="mb-3">
                    <label htmlFor={`estadoSelect${index}`} className="form-label">Estado del Pedido</label>
                    <select
                      id={`estadoSelect${index}`}
                      className="form-select"
                      value={pedido.estado || 'pendiente'}
                      onChange={(e) => actualizarEstadoPedido(pedido.id, e.target.value)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="proceso">En Proceso</option>
                      <option value="completado">Completado</option>
                    </select>
                  </div>

                  <button 
                    className="btn btn-primary me-2"
                    onClick={() => actualizarEstadoPedido(pedido.id, pedido.estado)}
                  >
                    Actualizar
                  </button>

                  <button 
                    className="btn btn-danger"
                    onClick={() => {
                      setSelectedPedido(pedido.id); // Guardar el ID del pedido seleccionado
                      setShowModal(true); 
                    }}
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
        handleConfirm={() => handleDeletePedido(selectedPedido)} // Llama a la función de eliminar
        confirmText="Eliminar"
      >
        <p>¿Estás seguro de que deseas eliminar este pedido?</p>
      </ModalGenerico>
    </div>
  );
};

export default Pedidos;
