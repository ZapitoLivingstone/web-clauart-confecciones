import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const Carrito = () => {
  //carrito con productos (simula datos)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Vestido Tejido a Mano' },
    { id: 2, name: 'Chaleco de Lana' },
  ]);

  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // carrito de productos
  const renderCart = () => {
    return cartItems.map(item => (
      <div className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
        <span className="mr-3">{item.name}</span>
        <div>
          <button className="btn btn-warning btn-sm" onClick={() => modifyItem(item.id)}>Modificar</button>
          <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>Eliminar</button>
        </div>
      </div>
    ));
  };

  //modificar un producto
  const modifyItem = (id) => {
    // Lógica para redirigir o modificar (puede ajustarse según la ruta de React Router)
    window.location.href = "/producto1"; 
  };

  // eliminar un producto
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // confirmar el pedido
  const confirmOrder = () => {
    setOrderConfirmed(true);
  };

  return (
    <>
      <header className="bg-primary text-white py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="m-0">Carrito de pedidos</h1>
          </div>
          <div>
            <a href="/" className="text-white mr-3">Inicio</a>
            <a href="/cuenta" className="text-white mr-3">Mi cuenta</a>
            <a href="/carrito" className="text-white">Carrito</a>
          </div>
        </div>
      </header>

      <div className="container my-5">
        <h2 className="mb-4">Tus Productos</h2>
        <div className="list-group" id="cart-items">
          {renderCart()}
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
