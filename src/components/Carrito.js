import React, { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../firebase';
import Header from './Header';
import { collection, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error, mensaje) => {
    console.error(mensaje, error);
    alert(`${mensaje}. Por favor, intenta nuevamente.`);
  };

  const cargarCarrito = useCallback(async () => {
    setIsLoading(true);
    try {
      const carritoSnapshot = await getDocs(collection(db, 'carrito'));
      const items = carritoSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
    } catch (error) {
      handleError(error, "Error al cargar el carrito");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  const confirmOrder = async () => {
    const user = auth.currentUser;
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
      const pedidosCollection = collection(db, 'pedidos');
      
      const pedidosPromises = cartItems.map(async (item) => {
        const pedidoData = {
          ...item,
          usuarioId: user.uid,
          fechaPedido: new Date().toISOString(),
          estado: 'pendiente',
        };

        const pedidoRef = await addDoc(pedidosCollection, pedidoData);
        
        await deleteDoc(doc(db, 'carrito', item.id));
        
        return pedidoRef;
      });

      await Promise.all(pedidosPromises);

      setCartItems([]);
      setOrderConfirmed(true);
      
      setTimeout(() => {
        setOrderConfirmed(false);
      }, 3000);

    } catch (error) {
      handleError(error, "Error al procesar el pedido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header/>
      <div className="container my-5">
        <h1>Carrito de Compras</h1>
        {cartItems.length > 0 ? (
          <div className="row">
            <div className="col-md-12">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Color</th>
                    <th>Tamaño</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nombre}</td>
                      <td>{item.color}</td>
                      <td>{item.size}</td>
                      <td>${item.precio}</td>
                      <td>
                        <button 
                          type="button" 
                          className="btn btn-danger" 
                          onClick={async () => {
                            try {
                              await deleteDoc(doc(db, 'carrito', item.id));
                              cargarCarrito();
                            } catch (error) {
                              handleError(error, "Error al eliminar item del carrito");
                            }
                          }}
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
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
    </>
  );
};

export default Carrito;