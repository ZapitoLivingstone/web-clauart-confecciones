import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom'; 
import Header from '../components/Header';
import ModalGenerico from '../components/ModalGenerico';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [modalAction, setModalAction] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleError = (error, mensaje) => {
    console.error(mensaje, error);
    alert(`${mensaje}. Por favor, intenta nuevamente.`);
  };

  const cargarCarrito = useCallback(async () => {
    setIsLoading(true);
    try {
      // Obtén la sesión de Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
  
      const user = session?.user;
      if (!user) {
        alert('Debes iniciar sesión para ver el carrito');
        setIsLoading(false);
        return;
      }
  
      const { data, error } = await supabase
        .from('carrito')
        .select(`
          id, 
          producto_id, 
          productos(nombre, img_url, precio), 
          color, 
          size, 
          cantidad, 
          texto_personalizado
        `)
        .eq('usuario_id', user.id); // Filtro por usuario logueado
  
      if (error) throw error;
  
      const items = data.map((item) => ({
        ...item,
        nombre: item.productos.nombre,
        img_url: item.productos.img_url,
        precio: item.productos.precio,
      }));
  
      setCartItems(items);
    } catch (error) {
      handleError(error, 'Error al cargar el carrito');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  const confirmOrder = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      handleError(error, 'Error al obtener la sesión');
      return;
    }

    const user = session?.user;

    if (!user) {
      alert('Debes iniciar sesión para realizar un pedido');
      return;
    }

    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setIsLoading(true);
    try {
      const pedidosPromises = cartItems.map(async (item) => {
        const pedidoData = {
          usuarioId: user.id,
          producto_id: item.producto_id,
          color: item.color,
          size: item.size,
          cantidad: item.cantidad || 1,
          precio: item.precio,
          fechaPedido: new Date().toISOString(),
          estado: 'pendiente',
        };

        const { error } = await supabase.from('pedidos').insert([pedidoData]);

        if (error) throw error;

        const { error: deleteError } = await supabase
          .from('carrito')
          .delete()
          .match({ id: item.id });

        if (deleteError) throw deleteError;
      });

      await Promise.all(pedidosPromises);
      setCartItems([]);
      setOrderConfirmed(true);

      setTimeout(() => {
        navigate('/MisPedidos'); 
      }, 1000); 
    } catch (error) {
      handleError(error, 'Error al procesar el pedido');
    } finally {
      setIsLoading(false);
    }
  };
  

  const openEditModal = (item) => {
    setEditItem({ ...item });
    setModalAction('edit');
  };

  const openDeleteModal = (item) => {
    setEditItem(item);
    setModalAction('delete');
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;

    try {
      const { error } = await supabase
        .from('carrito')
        .update({
          color: editItem.color,
          size: editItem.size,
          cantidad: editItem.cantidad,
        })
        .match({ id: editItem.id });

      if (error) throw error;

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editItem.id ? { ...item, ...editItem } : item
        )
      );
      setEditItem(null);
      setModalAction('');
    } catch (error) {
      handleError(error, "Error al actualizar item del carrito");
    }
  };

  const handleDeleteItem = async () => {
    if (!editItem) return;

    try {
      const { error } = await supabase
        .from('carrito')
        .delete()
        .match({ id: editItem.id });

      if (error) throw error;

      setCartItems((prevItems) => prevItems.filter((item) => item.id !== editItem.id));
      setEditItem(null);
      setModalAction('');
    } catch (error) {
      handleError(error, "Error al eliminar item del carrito");
    }
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <h1>Carrito de Compras</h1>
        {cartItems.length > 0 ? (
          <div className="row">
            <div className="col-md-12">
              <table className="table table-striped">
              <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Color</th>
                <th>Tamaño</th>
                <th>Texto Personalizado</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.img_url}
                        alt={item.nombre}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{item.nombre}</td>
                    <td>{item.color}</td>
                    <td>{item.size}</td>
                    <td>{item.texto_personalizado || 'N/A'}</td>
                    <td>${item.precio}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-warning me-2"
                        onClick={() => openEditModal(item)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => openDeleteModal(item)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              </table>
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={confirmOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : null}
                {isLoading ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
              {orderConfirmed && (
                <div className="alert alert-success mt-3" role="alert">
                  Pedido confirmado exitosamente!
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>No hay items en el carrito.</p>
        )}
      </div>
      <Footer />

      <ModalGenerico
        show={modalAction !== ''}
        handleClose={() => {
          setEditItem(null);
          setModalAction('');
        }}
        title={modalAction === 'edit' ? 'Editar Item' : 'Confirmar Eliminación'}
        handleConfirm={modalAction === 'edit' ? handleSaveEdit : handleDeleteItem}
        confirmText={modalAction === 'edit' ? 'Guardar Cambios' : 'Eliminar'}
      >
        {modalAction === 'edit' ? (
          <div>
            <label>Color:</label>
            <input
              type="text"
              value={editItem?.color || ''}
              onChange={(e) => setEditItem({ ...editItem, color: e.target.value })}
              className="form-control mb-2"
            />
            <label>Texto Personalizado:</label>
            <textarea
              value={editItem?.texto_personalizado || ''}
              onChange={(e) => setEditItem({ ...editItem, texto_personalizado: e.target.value })}
              className="form-control"
            />
          </div>
        ) : (
          <p>¿Estás seguro de que deseas eliminar este item del carrito?</p>
        )}

      </ModalGenerico>

    </>
  );
};

export default Carrito;
