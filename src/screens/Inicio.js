import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CardProductos from '../components/CardProductos';
import BarraBusqueda from '../components/BarraBusqueda';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

const Inicio = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarProductos = async () => {
      const productosSnapshot = await getDocs(collection(db, 'productos'));
      const productosData = productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(productosData);
    };

    const cargarCategorias = async () => {
      const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
      const categoriasData = categoriasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategorias(categoriasData);
    };

    cargarProductos();
    cargarCategorias();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = categoriaSeleccionada
      ? producto.categoria === categoriaSeleccionada
      : true;
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <>
      <Header />
      <div className="container my-5">
        <h2 className="text-center mb-4">Nuestros Productos</h2>
        
        <BarraBusqueda
          placeholder="Buscar productos..."
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          opciones={categorias}
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoriaChange={setCategoriaSeleccionada}
        />

        <CardProductos productos={productosFiltrados} />
      </div>
    </>
  );
};

export default Inicio;
