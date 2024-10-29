import React from 'react';
import Header from './Header';
import CardProductos from './CardProductos';
import 'bootstrap/dist/css/bootstrap.min.css';

const Inicio = () => {
  return (
    <>
      <Header />
      <div className="container my-5">
        <h2 className="text-center mb-4">Nuestros Productos</h2>
        <CardProductos />
      </div>
    </>
  );
};

export default Inicio;
