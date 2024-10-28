import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../firebase';

const DetalleProducto = () => {
  const { productoId } = useParams(); 
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      if (!productoId) {
        console.error("ID del producto es undefined");
        setLoading(false);
        return;
      }

      try {
        const productoRef = doc(db, 'productos', productoId);
        const productoSnapshot = await getDoc(productoRef);

        if (productoSnapshot.exists()) {
          const data = productoSnapshot.data();
          console.log("Datos del producto:", data); // Verifica los datos
          
          // Usar img_url directamente
          setProducto({ id: productoSnapshot.id, ...data });
        } else {
          console.error("El producto no existe");
          setError("El producto no existe");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
        setError("Error al obtener el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [productoId]);

  if (loading) {
    return <div>Cargando producto...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <div className="container my-5">
      <h1>Detalles del Producto</h1>
      {producto ? (
        <div className="row">
          <div className="col-md-6">
          <img src={producto.img_url} className="img-fluid" alt={producto.nombre} />
          </div>
          <div className="col-md-6">
            <h2>{producto.nombre}</h2>
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <div className="mt-4">
              <h3>Personaliza tu Producto</h3>
              <form id="customization-form">
                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <select className="form-control" id="color">
                    <option>Rojo</option>
                    <option>Azul</option>
                    <option>Verde</option>
                    <option>Negro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="size">Tamaño</label>
                  <select className="form-control" id="size">
                    <option>Pequeño</option>
                    <option>Mediano</option>
                    <option>Grande</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="text">Texto Personalizado</label>
                  <input type="text" className="form-control" id="text" placeholder="Ingresa el texto" />
                </div>
                <button type="button" className="btn btn-primary" onClick={() => alert('Producto agregado al carrito')}>Agregar al Carrito</button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <p>No se encontró información del producto.</p>
      )}
    </div>
  );
};

export default DetalleProducto;
