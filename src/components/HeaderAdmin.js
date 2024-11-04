import React from 'react';
import { Container, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HeaderAdmin = ({ pestañaActiva, setPestañaActiva }) => {
  const mostrarPestaña = (pestaña) => setPestañaActiva(pestaña);

  return (
    <header className="bg-dark text-white py-3">
      <Container className="d-flex justify-content-between align-items-center">
        <h1 className="mb-0">Panel de Administración</h1>
        <div className="d-flex align-items-center gap-3">
          <Link to="/PanelAdmin">
            <Button
              variant={pestañaActiva === 'productos' ? 'primary' : 'outline-light'}
              onClick={() => mostrarPestaña('productos')}
            >
              Gestionar Productos
            </Button>
          </Link>
          <Link to="/PanelAdmin">
            <Button
              variant={pestañaActiva === 'categorias' ? 'primary' : 'outline-light'}
              onClick={() => mostrarPestaña('categorias')}
            >
              Gestionar Categorías
            </Button>
          </Link>
          <Dropdown>
            <Dropdown.Toggle variant="outline-light">Más Opciones</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/">Inicio</Dropdown.Item>
              <Dropdown.Item as={Link} to="/Pedidos">Pedidos</Dropdown.Item>
              <Dropdown.Item as={Link} to="/Inventario">Inventario</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </header>
  );
};

export default HeaderAdmin;
