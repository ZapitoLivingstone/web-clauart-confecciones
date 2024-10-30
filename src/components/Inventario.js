// Inventario.js
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Card, Container, Row, Col } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import HeaderAdmin from './HeaderAdmin'; // Importar el nuevo componente

const Inventario = () => {
  const [materiales, setMateriales] = useState([]);
  const [nuevoMaterial, setNuevoMaterial] = useState({ nombre: '', descripcion: '', stock: '' });
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [pestañaActiva, setPestañaActiva] = useState('inventario'); // Agregar pestaña activa

  useEffect(() => {
    cargarMateriales();
  }, []);

  // Cargar materiales desde Firebase
  const cargarMateriales = async () => {
    const materialesSnapshot = await getDocs(collection(db, 'materiales'));
    const listaMateriales = materialesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMateriales(listaMateriales);
  };

  // Agregar un nuevo material
  const agregarMaterial = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'materiales'), nuevoMaterial);
    setNuevoMaterial({ nombre: '', descripcion: '', stock: '' });
    setMostrarModalAgregar(false);
    cargarMateriales();
  };

  // Actualizar un material existente
  const actualizarMaterial = async (e) => {
    e.preventDefault();
    if (materialSeleccionado) {
      await updateDoc(doc(db, 'materiales', materialSeleccionado.id), materialSeleccionado);
      setMaterialSeleccionado(null);
      setMostrarModalEditar(false);
      cargarMateriales();
    }
  };

  // Eliminar un material
  const eliminarMaterial = async (materialId) => {
    await deleteDoc(doc(db, 'materiales', materialId));
    cargarMateriales();
  };

  return (
    <>
    <HeaderAdmin pestañaActiva={pestañaActiva} setPestañaActiva={setPestañaActiva} /> {/* Usar el header */}

    <Container className="mt-4">

      <Button variant="success" className="mb-3" onClick={() => setMostrarModalAgregar(true)}>
        Agregar Material
      </Button>

      <Row>
        {materiales.map((material) => (
          <Col md={4} key={material.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{material.nombre}</Card.Title>
                <Card.Text>Descripción: {material.descripcion}</Card.Text>
                <Card.Text>Stock: {material.stock} unidades</Card.Text>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setMaterialSeleccionado(material);
                      setMostrarModalEditar(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => eliminarMaterial(material.id)}>
                    Eliminar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para agregar material */}
      <Modal show={mostrarModalAgregar} onHide={() => setMostrarModalAgregar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={agregarMaterial}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Material</Form.Label>
              <Form.Control
                type="text"
                value={nuevoMaterial.nombre}
                onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={nuevoMaterial.descripcion}
                onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, descripcion: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={nuevoMaterial.stock}
                onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, stock: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Agregar Material
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar material */}
      <Modal show={mostrarModalEditar} onHide={() => setMostrarModalEditar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={actualizarMaterial}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Material</Form.Label>
              <Form.Control
                type="text"
                value={materialSeleccionado?.nombre || ''}
                onChange={(e) =>
                  setMaterialSeleccionado((prev) => ({ ...prev, nombre: e.target.value }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={materialSeleccionado?.descripcion || ''}
                onChange={(e) =>
                  setMaterialSeleccionado((prev) => ({ ...prev, descripcion: e.target.value }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={materialSeleccionado?.stock || ''}
                onChange={(e) =>
                  setMaterialSeleccionado((prev) => ({ ...prev, stock: e.target.value }))
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Actualizar Material
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
    </>
  );
};

export default Inventario;
