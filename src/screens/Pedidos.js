import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import { supabase } from '../supabase';
import ModalGenerico from '../components/ModalGenerico';
import BarraBusqueda from '../components/BarraBusqueda';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CardPedido.css';


const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState('pedidos');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [opciones] = useState([
    { id: 'pendiente', nombre: 'Pendiente' },
    { id: 'proceso', nombre: 'En Proceso' },
    { id: 'completado', nombre: 'Completado' },
  ]);

  const formatDate = (fecha) => {
    if (!fecha) return 'Fecha desconocida';
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener pedidos con el nombre del producto
        const { data: pedidosData, error: pedidosError } = await supabase
          .from('pedidos')
          .select(`
            *,
            productos(nombre)
          `);
        if (pedidosError) throw pedidosError;
  
        const pedidosConFecha = pedidosData.map((pedido) => ({
          ...pedido,
          nombreProducto: pedido.productos?.nombre || 'Producto desconocido',
          fecha: formatDate(pedido.fechaPedido),
        }));
        setPedidos(pedidosConFecha);
  
        // Obtener usuarios desde Supabase
        const { data: usuariosData, error: usuariosError } = await supabase
          .from('usuarios')
          .select('*');
        if (usuariosError) throw usuariosError;
  
        const usuariosMap = usuariosData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
        setUsuarios(usuariosMap);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
  
    cargarDatos();
  }, []);
  
  const actualizarEstadoPedido = async (docId, nuevoEstado) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ estado: nuevoEstado })
        .match({ id: docId });

      if (error) throw error;

      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === docId ? { ...pedido, estado: nuevoEstado } : pedido
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
    }
  };

  const handleDeletePedido = async () => {
    if (!selectedPedidoId) return;

    try {
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .match({ id: selectedPedidoId });

      if (error) throw error;

      setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== selectedPedidoId));
      setShowModal(false);
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const nombreProducto = pedido.nombreProducto ? pedido.nombreProducto.toLowerCase() : '';
    const busquedaLower = busqueda.toLowerCase();
  
    const coincideBusqueda = nombreProducto.includes(busquedaLower);
    const coincideEstado = !categoriaSeleccionada || pedido.estado === categoriaSeleccionada;
  
    return coincideBusqueda && coincideEstado;
  });

  return (
    <div>
      <HeaderAdmin pestañaActiva={pestañaActiva} setPestañaActiva={setPestañaActiva} />
      <div className="container mt-4">
          <BarraBusqueda
            placeholder="Buscar por producto"
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            opciones={opciones.map((opcion) => ({ value: opcion.id, label: opcion.nombre }))}
            categoriaSeleccionada={categoriaSeleccionada}
            onCategoriaChange={setCategoriaSeleccionada}
          />
        <div className="row">
          {pedidosFiltrados.map((pedido, index) => (
            <div key={pedido.id} className="col-md-4 mb-4">
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
                  <p className="card-text">Fecha del Pedido: {pedido.fecha}</p>

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
                    className="btn btn-danger"
                    onClick={() => {
                      setSelectedPedidoId(pedido.id);
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
