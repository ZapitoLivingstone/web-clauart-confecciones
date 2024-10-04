import React, { useState } from 'react';

const Contacto = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Vestido Tejido a Mano' },
    { id: 2, name: 'Chaleco de Lana' }
  ]);

  const modifyItem = (id) => {
    window.location.href = "producto1.html";  // Redirige según sea necesario
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const confirmOrder = () => {
    document.getElementById('order-notification').classList.remove('d-none');
  };

  return (
    <>
      <header className="bg-primary text-white py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="m-0">Carrito de pedidos</h1>
          </div>
          <div>
            <a href="index.html" className="text-white mr-3">Inicio</a>
            <a href="cuenta.html" className="text-white mr-3">Mi cuenta</a>
            <a href="carrito.html" className="text-white">Carrito</a>
          </div>
        </div>
      </header>

      <div className="container my-5">
        <h2 className="mb-4">Tus Productos</h2>
        <div className="list-group" id="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span className="mr-3">{item.name}</span>
              <div>
                <button className="btn btn-warning btn-sm" onClick={() => modifyItem(item.id)}>Modificar</button>
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-success btn-block mt-3" onClick={confirmOrder}>Confirmar Pedido</button>

        <div id="order-notification" className="alert alert-success mt-4 d-none" role="alert">
          ¡Tu pedido ha sido enviado a la modista!
        </div>
      </div>
    </>
  );
};

export default Contacto;
