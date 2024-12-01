import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Card.css';

const CardProductos = ({ productos }) => {
  return (
    <div className="card-container">
      {productos.map((producto) => (
        <div key={producto.id} className="card">
          <Link to={`/DetalleProducto/${producto.id}`} className="card-link">
            <div className="card-img-container">
              {producto.img_url ? (
                <img 
                  src={producto.img_url} 
                  className="card-img-top" 
                  alt={producto.nombre} 
                  loading="lazy"
                />
              ) : (
                <div className="card-img-top card-img-placeholder">
                  Sin Imagen
                </div>
              )}
            </div>
            <div className="card-body">
              <h5 className="card-title">{producto.nombre}</h5>
              <p className="card-text">{producto.descripcion}</p>
            </div>
            <div className="card-footer">
              <span className="text-dark fw-bold">${producto.precio}</span>
              <span className="btn btn-info">Ver Detalles</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CardProductos;