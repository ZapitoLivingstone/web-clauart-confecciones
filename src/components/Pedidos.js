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
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState('pedidos'); 

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const pedidosSnapshot = await getDocs(collection(db, 'pedidos'));
        const pedidosData = pedidosSnapshot.docs.map((pedidoDoc) => ({
          docId: pedidoDoc.id,
          ...pedidoDoc.data(),
        }));
        setPedidos(pedidosData);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      }
    };

    const cargarUsuarios = async () => {
      try {
        const usuariosSnapshot = await getDocs(collection(db, 'users'));
        const usuariosData = {};
        usuariosSnapshot.docs.forEach((usuarioDoc) => {
          const uid = usuarioDoc.id;
          const data = usuarioDoc.data();
          // Incluimos nombre, dirección y teléfono en cada usuario
          usuariosData[uid] = {
            nombre: data.nombre || 'Usuario desconocido',
            direccion: data.direccion || '',
            telefono: data.telefono || ''
          };
        });
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    cargarPedidos();
    cargarUsuarios();
  }, []);

  const actualizarEstadoPedido = async (docId, nuevoEstado) => {
    try {
      const pedidoRef = doc(db, 'pedidos', docId);
      await updateDoc(pedidoRef, { estado: nuevoEstado });
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.docId === docId ? { ...pedido, estado: nuevoEstado } : pedido
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  const handleDeletePedido = async () => {
    if (!selectedPedidoId) return;

    try {
      const pedidoRef = doc(db, 'pedidos', selectedPedidoId);
      await deleteDoc(pedidoRef);
      setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.docId !== selectedPedidoId));
      setShowModal(false);
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  return (
    <div>
      <HeaderAdmin pestañaActiva={pestañaActiva} setPestañaActiva={setPestañaActiva} /> 
      <div className="container mt-4">
        <div className="row">
          {pedidos.map((pedido, index) => (
            <div key={pedido.docId} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{pedido.nombreProducto}</h5>
                  <p>Usuario: {usuarios[pedido.usuarioId]?.nombre || 'Usuario desconocido'}</p>                 
                  {usuarios[pedido.usuarioId]?.direccion && (
                    <p className="card-text">Dirección: {usuarios[pedido.usuarioId].direccion}</p>
                  )}
                  {usuarios[pedido.usuarioId]?.telefono && (
                    <p className="card-text">Teléfono: {usuarios[pedido.usuarioId].telefono}</p>
                  )}

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
                      onChange={(e) => actualizarEstadoPedido(pedido.docId, e.target.value)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="proceso">En Proceso</option>
                      <option value="completado">Completado</option>
                    </select>
                  </div>

                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setSelectedPedidoId(pedido.docId);
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
        handleConfirm={handleDeletePedido}
        confirmText="Eliminar"
      >
        <p>¿Estás seguro de que deseas eliminar este pedido?</p>
      </ModalGenerico>
    </div>
  );
};

export default Pedidos;
