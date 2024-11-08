// PanelAdmin.js
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import HeaderAdmin from '../components/HeaderAdmin'; 
import GestionarProductos from '../components/GestionarProductos';
import GestionarCategorias from '../components/GestionarCategorias';

const PanelAdmin = () => {
  const [pestañaActiva, setPestañaActiva] = useState('productos');

  return (
    <div>
      <HeaderAdmin pestañaActiva={pestañaActiva} setPestañaActiva={setPestañaActiva} /> {/* Usar el header */}
      <Container className="mt-4">
        {pestañaActiva === 'productos' ? <GestionarProductos /> : <GestionarCategorias />}
      </Container>
    </div>
  );
};

export default PanelAdmin;
