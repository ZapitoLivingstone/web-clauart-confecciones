import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/style.css';

const DetalleProducto = () => {
  const { productoId } = useParams(); 
  const [producto, setProducto] = useState(null);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [text, setText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const docRef = doc(db, 'productos', productoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProducto(docSnap.data());
        } else {
          console.log("El producto no existe");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProducto();
  }, [productoId]);

  const handleAddToCart = () => {
    const customProduct = {
      id: productoId,
      name: producto?.titulo,
      color: color,
      size: size,
      text: text,
    };

    console.log('Producto agregado al carrito:', customProduct);
    setShowConfirmation(true);

    setColor('');
    setSize('');
    setText('');
  };

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <div className="container my-5">
      <header className="bg-primary text-white py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="m-0">{producto.titulo}</h1>
          </div>
          <div>
            <a href="/" className="text-white mr-3">Inicio</a>
            <a href="/cuenta" className="text-white mr-3">Mi cuenta</a>
            <a href="/carrito" className="text-white">Carrito</a>
          </div>
        </div>
      </header>

      <div className="row mt-5">
        <div className="col-md-6">
          <img src={producto.imagen_url || 'https://via.placeholder.com/400'} className="img-fluid" alt={producto.titulo} />
        </div>
        <div className="col-md-6">
          <h2>{producto.titulo}</h2>
          <p>{producto.descripcion}</p>

          <h3>Personaliza tu {producto.titulo}</h3>
          <form>
            <div className="form-group">
              <label htmlFor="color">Color</label>
              <select className="form-control" id="color" value={color} onChange={(e) => setColor(e.target.value)}>
                <option value="">Selecciona un color</option>
                <option>Rojo</option>
                <option>Azul</option>
                <option>Verde</option>
                <option>Negro</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="size">Tamaño</label>
              <select className="form-control" id="size" value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="">Selecciona un tamaño</option>
                <option>Pequeño</option>
                <option>Mediano</option>
                <option>Grande</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="text">Texto Personalizado</label>
              <input
                type="text"
                className="form-control"
                id="text"
                placeholder="Ingresa el texto"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
              Agregar al Carrito
            </button>
          </form>
          {showConfirmation && (
            <div className="alert alert-success mt-4" role="alert">
              ¡Producto agregado al carrito exitosamente!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
