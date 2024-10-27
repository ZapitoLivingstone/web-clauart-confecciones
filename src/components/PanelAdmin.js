import React, { useState } from 'react';
import { Dropdown, Container, Button, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styleAdmin.css';

const PanelAdmin = () => {
  const [activeTab, setActiveTab] = useState('products');

  const showTab = (tabId) => {
    setActiveTab(tabId);
  };

  const previewImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('imagePreview');
      if (preview) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Vista previa" style="max-width: 300px;">`;
      }
    };
    if (file) reader.readAsDataURL(file);
  };

  const navigateTo = (page) => {
    switch (page) {
      case 'inicio':
        window.location.href = '/';
        break;
      case 'panelAdmin':
        window.location.href = '/panelAdmin';
        break;
      case 'pedidos':
        window.location.href = '/pedidos';
        break;
      case 'inventario':
        window.location.href = '/inventario';
        break;
      default:
        break;
    }
  };

  const renderCategories = () => (
    <div id="categories" className="tab-content">
      <h2>Gestionar Categorías</h2>
      <Form className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Nombre de la Categoría</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej. Ropa, Zapatos, Tazas"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Descripción de la categoría"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Agregar Categoría
        </Button>
      </Form>

      <h3>Lista de Categorías</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ropa</td>
            <td>Todo tipo de ropa</td>
            <td>
              <Button variant="warning" size="sm" className="me-2">Editar</Button>
              <Button variant="danger" size="sm">Eliminar</Button>
            </td>
          </tr>
          <tr>
            <td>Zapatos</td>
            <td>Diferentes tipos de zapatos</td>
            <td>
              <Button variant="warning" size="sm" className="me-2">Editar</Button>
              <Button variant="danger" size="sm">Eliminar</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );

  const renderProducts = () => (
    <div id="products" className="tab-content">
      <h2>Gestionar Productos</h2>
      <Form className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Nombre del Producto</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej. Polera, Vestido"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Descripción del producto"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            placeholder="Precio en CLP"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Select>
            <option value="ropa">Ropa</option>
            <option value="zapatos">Zapatos</option>
            <option value="tazas">Tazas</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Imagen del Producto</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={previewImage}
          />
          <div id="imagePreview" className="mt-2"></div>
        </Form.Group>
        <Button variant="primary" type="submit">
          Agregar Producto
        </Button>
      </Form>

      <h3>Lista de Productos</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Polera Azul</td>
            <td>Polera de algodón azul</td>
            <td>$20</td>
            <td>Ropa</td>
            <td>
              <img 
                src="/api/placeholder/100/100" 
                alt="Polera Azul" 
                className="img-thumbnail" 
                style={{ maxWidth: '100px' }} 
              />
            </td>
            <td>
              <Button variant="warning" size="sm" className="me-2">Editar</Button>
              <Button variant="danger" size="sm">Eliminar</Button>
            </td>
          </tr>
          <tr>
            <td>Vestido Rojo</td>
            <td>Vestido de fiesta rojo</td>
            <td>$50</td>
            <td>Ropa</td>
            <td>
              <img 
                src="/api/placeholder/100/100" 
                alt="Vestido Rojo" 
                className="img-thumbnail" 
                style={{ maxWidth: '100px' }} 
              />
            </td>
            <td>
              <Button variant="warning" size="sm" className="me-2">Editar</Button>
              <Button variant="danger" size="sm">Eliminar</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );

  return (
    <div>
      <header className="bg-dark text-white py-3">
        <Container className="d-flex justify-content-between align-items-center">
          <h1 className="mb-0">Panel de Administración</h1>
          <div className="d-flex align-items-center gap-3">
            <Button
              variant={activeTab === 'products' ? 'primary' : 'outline-light'}
              onClick={() => showTab('products')}
            >
              Gestionar Productos
            </Button>
            <Button
              variant={activeTab === 'categories' ? 'primary' : 'outline-light'}
              onClick={() => showTab('categories')}
            >
              Gestionar Categorías
            </Button>
            
            <Dropdown>
              <Dropdown.Toggle variant="outline-light">
                Más Opciones
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigateTo('inicio')}>Inicio</Dropdown.Item>
                <Dropdown.Item onClick={() => navigateTo('pedidos')}>Pedidos</Dropdown.Item>
                <Dropdown.Item onClick={() => navigateTo('inventario')}>Inventario</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </header>

      <Container className="mt-4">
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'categories' && renderCategories()}
      </Container>
    </div>
  );
};

export default PanelAdmin;