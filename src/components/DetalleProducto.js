import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'; 
import { db } from '../firebase';

const DetalleProducto = () => {
  const { productoId } = useParams(); 
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [customText, setCustomText] = useState('');

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

  const agregarAlCarrito = async () => {
    if (!producto) return; // Agregar chequeo si el producto existe

    const productoPersonalizado = {
      productoId: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      color,
      size,
      customText,
    };

    try {
      await addDoc(collection(db, 'carrito'), productoPersonalizado);
      alert('Producto agregado al carrito');
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  if (loading) return <div>Cargando producto...</div>;
  if (error) return <div>{error}</div>;

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
            <p>Colores Disponibles: {producto.colores ? producto.colores.join(', ') : 'No disponibles'}</p>
            <p>Tallas Disponibles: {producto.tallas ? producto.tallas.join(', ') : 'No disponibles'}</p>
            <div className="mt-4">
              <h3>Personaliza tu Producto</h3>
              <form id="customization-form">
                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <select className="form-control" id="color" value={color} onChange={(e) => setColor(e.target.value)}>
                    <option value="">Selecciona un color</option>
                    {producto.colores && producto.colores.map((color, index) => (
                      <option key={index} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="size">Tamaño</label>
                  <select className="form-control" id="size" value={size} onChange={(e) => setSize(e.target.value)}>
                    <option value="">Selecciona un tamaño</option>
                    {producto.tallas && producto.tallas.map((size, index) => (
                      <option key={index} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="text">Texto Personalizado</label>
                  <input type="text" className="form-control" id="text" placeholder="Ingresa el texto" value={customText} onChange={(e) => setCustomText(e.target.value)} />
                </div>
                <button type="button" className="btn btn-primary mt-3" onClick={agregarAlCarrito}>Agregar al Carrito</button>
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
