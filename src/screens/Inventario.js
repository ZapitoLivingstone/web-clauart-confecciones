// Importaciones de Inventario.js
import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import HeaderAdmin from '../components/HeaderAdmin';
import BarraBusqueda from '../components/BarraBusqueda';
import ModalGenerico from '../components/ModalGenerico';
import Validaciones from '../components/Validaciones';

const Inventario = () => {
  const [materiales, setMateriales] = useState([]);
  const [materialesFiltrados, setMaterialesFiltrados] = useState([]);
  const [nuevoMaterial, setNuevoMaterial] = useState({ nombre: '', descripcion: '', stock: '' });
  const [errores, setErrores] = useState({});
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [pestañaActiva, setPestañaActiva] = useState('inventario');

  useEffect(() => {
    cargarMateriales();
  }, []);

  useEffect(() => {
    const materialesFiltrados = materiales.filter((material) =>
      material.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setMaterialesFiltrados(materialesFiltrados);
  }, [busqueda, materiales]);

  // Cargar materiales desde Firebase
  const cargarMateriales = async () => {
    const materialesSnapshot = await getDocs(collection(db, 'materiales'));
    const listaMateriales = materialesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMateriales(listaMateriales);
  };

  // Validar el material antes de agregar
  const validarMaterial = () => {
    const erroresValidacion = {};
    erroresValidacion.nombre = Validaciones.texto(nuevoMaterial.nombre, 'Nombre');
    erroresValidacion.stock = Validaciones.precio(nuevoMaterial.stock);
    setErrores(erroresValidacion);
    return Object.values(erroresValidacion).every((error) => error === null);
  };

  // Agregar un nuevo material
  const agregarMaterial = async (e) => {
    e.preventDefault();
    if (validarMaterial()) {
      await addDoc(collection(db, 'materiales'), nuevoMaterial);
      setNuevoMaterial({ nombre: '', descripcion: '', stock: '' });
      setMostrarModalAgregar(false);
      cargarMateriales();
    }
  };

  // Actualizar un material existente
  const actualizarMaterial = async () => {
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
      <HeaderAdmin pestañaActiva={pestañaActiva} setPestañaActiva={setPestañaActiva} />

      <Container className="mt-4">
        <Button variant="success" className="mb-3" onClick={() => setMostrarModalAgregar(true)}>
          Agregar Material
        </Button>

        {/* Barra de Búsqueda */}
        <BarraBusqueda
          placeholder="Buscar material..."
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
        />

        <Row>
          {materialesFiltrados.map((material) => (
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
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setMaterialSeleccionado(material);
                        eliminarMaterial(material.id);
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal para agregar material */}
        <ModalGenerico
          show={mostrarModalAgregar}
          handleClose={() => setMostrarModalAgregar(false)}
          title="Agregar Nuevo Material"
          handleConfirm={agregarMaterial}
          confirmText="Agregar Material"
        >
          <form onSubmit={agregarMaterial}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Material</Form.Label>
              <Form.Control
                type="text"
                value={nuevoMaterial.nombre}
                onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, nombre: e.target.value })}
                isInvalid={!!errores.nombre}
                required
              />
              <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={nuevoMaterial.descripcion}
                onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, descripcion: e.target.value })}
                isInvalid={!!errores.descripcion}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={nuevoMaterial.stock}
                onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, stock: e.target.value })}
                isInvalid={!!errores.stock}
                required
              />
              <Form.Control.Feedback type="invalid">{errores.stock}</Form.Control.Feedback>
            </Form.Group>
          </form>
        </ModalGenerico>

        {/* Modal para editar material */}
        <ModalGenerico
          show={mostrarModalEditar}
          handleClose={() => setMostrarModalEditar(false)}
          title="Editar Material"
          handleConfirm={actualizarMaterial}
          confirmText="Actualizar Material"
        >
          <form onSubmit={actualizarMaterial}>
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
          </form>
        </ModalGenerico>
      </Container>
    </>
  );
};

export default Inventario;
