import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CardProductos from '../components/CardProductos';
import BarraBusqueda from '../components/BarraBusqueda';
import { supabase } from '../supabase';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const Inicio = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { data: productosData, error: productosError } = await supabase
          .from('productos')
          .select('*');
        if (productosError) throw productosError;
        setProductos(productosData);

        const { data: categoriasData, error: categoriasError } = await supabase
          .from('categorias')
          .select('*');
        if (categoriasError) throw categoriasError;
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error cargando datos:', error.message);
      }
    };

    cargarDatos();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = categoriaSeleccionada
      ? producto.categorias_id === parseInt(categoriaSeleccionada, 10)
      : true;
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
  
    return coincideCategoria && coincideBusqueda;
  });
  

  return (
    <>
      <Header />
      <div className="container my-5">
        <h2 className="text-center">Nuestros Productos</h2>
        <BarraBusqueda
          placeholder="Buscar productos..."
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          opciones={categorias.map((categoria) => ({
            value: categoria.id,
            label: categoria.nombre,
          }))}
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoriaChange={setCategoriaSeleccionada}
        />
        <CardProductos productos={productosFiltrados} />
        
      </div>
      <Footer />
    </>
  );
};

export default Inicio;
