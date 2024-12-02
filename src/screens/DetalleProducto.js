import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 
import Header from '../components/Header';
import '../styles/DetalleProducto.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const DetalleProducto = () => {
  const { productoId } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [customText, setCustomText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      if (!productoId) {
        console.error("ID del producto es undefined");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('id', productoId)
          .single(); 

        if (error) {
          setError("Error al obtener el producto: " + error.message);
        } else {
          setProducto(data);
        }
      } catch (error) {
        handleError(error, "Error al obtener el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [productoId]);

  const handleError = (error, mensaje) => {
    console.error(mensaje, error);
    alert(`${mensaje}. Por favor, intenta nuevamente.`);
  };

  const validarProducto = () => {
    if (!color) {
      alert('Por favor selecciona un color');
      return false;
    }
    if (!size) {
      alert('Por favor selecciona un tamaño');
      return false;
    }
    return true;
  };

  const agregarAlCarrito = async () => {
    if (!producto || !validarProducto()) return;

    setIsLoading(true);

    const productoPersonalizado = {
      producto_id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      color,
      size,
      custom_text: customText,
      fecha_agregado: new Date(), 
      img_url: producto.img_url
    };

    try {
      const { error } = await supabase
        .from('carrito')
        .insert([productoPersonalizado]);

      if (error) {
        handleError(error, "Error al agregar al carrito");
      } else {
        alert('Producto agregado al carrito exitosamente');
        setColor('');
        setSize('');
        setCustomText('');
        navigate('/carrito');
      }
    } catch (error) {
      handleError(error, "Error al agregar al carrito");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div className="text-center my-5">Cargando producto...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <Header />
      <div className="container product-details-container">
        {producto ? (
          <div className="row">
            <div className="col-md-6">
              <div className="product-image-container">
                <img 
                  src={producto.img_url} 
                  className="product-image" 
                  alt={producto.nombre} 
                />
              </div>
            </div>
            <div className="col-md-6 product-info">
              <h2 className="product-title">{producto.nombre}</h2>
              <p className="product-description">{producto.descripcion}</p>
              <p className="product-price">${producto.precio}</p>
              
              <div className="mb-3">
                <strong>Colores Disponibles:</strong> 
                <p>{producto.colores ? producto.colores.join(', ') : 'No disponibles'}</p>
              </div>
              <div className="mb-3">
                <strong>Tallas Disponibles:</strong> 
                <p>{producto.tallas ? producto.tallas.join(', ') : 'No disponibles'}</p>
              </div>

              <div className="customization-section">
                <h3 className="mb-4">Personaliza tu Producto</h3>
                <form id="customization-form">
                  <div className="form-group mb-3">
                    <label htmlFor="color">Color</label>
                    <select 
                      className="form-control" 
                      id="color" 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)}
                    >
                      <option value="">Selecciona un color</option>
                      {producto.colores && producto.colores.map((color, index) => (
                        <option key={index} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="size">Tamaño</label>
                    <select 
                      className="form-control" 
                      id="size" 
                      value={size} 
                      onChange={(e) => setSize(e.target.value)}
                    >
                      <option value="">Selecciona un tamaño</option>
                      {producto.tallas && producto.tallas.map((size, index) => (
                        <option key={index} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="text">Texto Personalizado</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="text" 
                      placeholder="Ingresa el texto" 
                      value={customText} 
                      onChange={(e) => setCustomText(e.target.value)} 
                    />
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary w-100" 
                    onClick={agregarAlCarrito}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">No se encontró información del producto.</p>
        )}
      </div>
    </>
  );
};

export default DetalleProducto;