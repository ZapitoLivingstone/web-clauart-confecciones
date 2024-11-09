import React from 'react';

const CardProductos = ({ productos }) => {
  return (
    <div className="row">
      {productos.map((producto) => (
        <div key={producto.id} className="col-md-4 col-lg-3 mb-4">
          <div className="card h-100">
            <img src={producto.img_url} className="card-img-top" alt={producto.nombre} />
            <div className="card-body">
              <h5 className="card-title">{producto.nombre}</h5>
              <p className="card-text">{producto.descripcion}</p>
              <a href={`/DetalleProducto/${producto.id}`} className="btn btn-info">Leer más</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardProductos;
