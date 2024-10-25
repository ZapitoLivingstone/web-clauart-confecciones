import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const CardProductos = () => {
  const [productos, setProductos] = useState([]);

  const fetchProductos = async () => {
    const productosCollection = collection(db, 'productos');
    const productosSnapshot = await getDocs(productosCollection);
    const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProductos(productosList);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="row">
      {productos.map(producto => (
        <div key={producto.id} className="col-md-4 col-lg-3 mb-4">
          <div className="card h-100">
            <img src={producto.imagen_url} className="card-img-top" alt={producto.titulo} />
            <div className="card-body">
              <h5 className="card-title">{producto.titulo}</h5>
              <p className="card-text">{producto.descripcion}</p>
              <a href={`/DetalleProducto`} className="btn btn-info">Leer más</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardProductos;



