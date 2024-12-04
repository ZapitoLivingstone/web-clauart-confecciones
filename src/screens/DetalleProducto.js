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
        console.error("Error al obtener el producto", error);
        setError("Error al obtener el producto. Por favor, intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [productoId]);

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
  
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser(); // Obtener el usuario autenticado
      if (userError || !user) {
        alert("Debes iniciar sesión para agregar productos al carrito.");
        return;
      }
  
      const productoCarrito = {
        usuario_id: user.id, 
        producto_id: producto.id,
        color,
        size: size, 
        texto_personalizado: customText || null, 
        cantidad: 1, 
      };
      
  
      const { error } = await supabase
        .from('carrito')
        .insert([productoCarrito]);
  
      if (error) {
        console.error("Error al agregar al carrito", error);
        alert("Error al agregar al carrito. Por favor, intenta nuevamente.");
      } else {
        setColor('');
        setSize('');
        setCustomText('');
        navigate('/carrito'); 
      }
    } catch (error) {
      console.error("Error al agregar al carrito", error);
      alert("Error inesperado. Por favor, intenta nuevamente.");
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
                <p>{producto.colores?.join(', ') || 'No disponibles'}</p>
              </div>
              <div className="mb-3">
                <strong>Tallas Disponibles:</strong> 
                <p>{producto.tallas?.join(', ') || 'No disponibles'}</p>
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
