import React, { useState } from 'react';
import { Container, Button, Dropdown } from 'react-bootstrap';
import GestionarProductos from './GestionarProductos';
import GestionarCategorias from './GestionarCategorias';

const PanelAdmin = () => {
  const [pestañaActiva, setPestañaActiva] = useState('productos');

  const mostrarPestaña = (pestaña) => setPestañaActiva(pestaña);

  return (
    <div>
      <header className="bg-dark text-white py-3">
        <Container className="d-flex justify-content-between align-items-center">
          <h1 className="mb-0">Panel de Administración</h1>
          <div className="d-flex align-items-center gap-3">
            <Button variant={pestañaActiva === 'productos' ? 'primary' : 'outline-light'} onClick={() => mostrarPestaña('productos')}>
              Gestionar Productos
            </Button>
            <Button variant={pestañaActiva === 'categorias' ? 'primary' : 'outline-light'} onClick={() => mostrarPestaña('categorias')}>
              Gestionar Categorías
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="outline-light">Más Opciones</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/">Inicio</Dropdown.Item>
                <Dropdown.Item href="/pedidos">Pedidos</Dropdown.Item>
                <Dropdown.Item href="/inventario">Inventario</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </header>

      <Container className="mt-4">
        {pestañaActiva === 'productos' ? <GestionarProductos /> : <GestionarCategorias />}
      </Container>
    </div>
  );
};

export default PanelAdmin;
