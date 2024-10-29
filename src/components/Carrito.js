import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import Header from './Header';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const cargarCarrito = async () => {
    const carritoSnapshot = await getDocs(collection(db, 'carrito'));
    const items = carritoSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCartItems(items);
  };

  useEffect(() => {
    cargarCarrito();
  }, []);

  const removeItem = async (id) => {
    await deleteDoc(doc(db, 'carrito', id));
    cargarCarrito();
  };

  const confirmOrder = () => {
    setOrderConfirmed(true);
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <h2 className="mb-4">Tus Productos</h2>
        <div className="list-group" id="cart-items">
          {cartItems.map(item => (
            <div className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
              <div>
                <span className="mr-3">{item.nombre}</span>
                <p className="mb-1">Color: {item.color}</p>
                <p className="mb-1">Tamaño: {item.size}</p>
                {item.customText && <p className="mb-1">Texto: {item.customText}</p>}
              </div>
              <div>
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-success btn-block mt-3" onClick={confirmOrder}>
          Confirmar Pedido
        </button>

        {orderConfirmed && (
          <div className="alert alert-success mt-4" role="alert">
            ¡Tu pedido ha sido enviado a la modista!
          </div>
        )}
      </div>
    </>
  );
};

export default Carrito;
