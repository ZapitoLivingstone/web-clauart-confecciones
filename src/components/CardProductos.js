import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const CardProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      const productosSnapshot = await getDocs(collection(db, 'productos'));
      const listaProductos = productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(listaProductos);
    };
  
    cargarProductos();
  }, []);
  
  return (
    <div className="row">
      {productos.map(producto => (
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
