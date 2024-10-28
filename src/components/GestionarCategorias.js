import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, doc, getDocs, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const GestionarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' });
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // Cargar las categorías desde Firestore
  const cargarCategorias = async () => {
    try {
      const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
      const listaCategorias = categoriasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategorias(listaCategorias);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const agregarCategoria = async (e) => {
    e.preventDefault();
    if (nuevaCategoria.nombre && nuevaCategoria.descripcion) {
      try {
        await addDoc(collection(db, 'categorias'), {
          nombre: nuevaCategoria.nombre,
          descripcion: nuevaCategoria.descripcion,
        });
        setNuevaCategoria({ nombre: '', descripcion: '' });
        cargarCategorias();
      } catch (error) {
        console.error('Error al agregar categoría:', error);
      }
    } else {
      console.error('Por favor completa todos los campos.');
    }
  };
  

  const eliminarCategoria = async () => {
    try {
      await deleteDoc(doc(db, 'categorias', categoriaSeleccionada.id));
      setMostrarModalEliminar(false);
      cargarCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  const editarCategoria = async () => {
    try {
      await updateDoc(doc(db, 'categorias', categoriaSeleccionada.id), {
        nombre: categoriaSeleccionada.nombre,
        descripcion: categoriaSeleccionada.descripcion,
      });
      setMostrarModalEditar(false);
      cargarCategorias();
    } catch (error) {
      console.error('Error al editar categoría:', error);
    }
  };

  return (
    <div>
      <h2>Gestionar Categorías</h2>
      <Form onSubmit={agregarCategoria} className="mb-4">
        <Form.Group>
          <Form.Label>Nombre de la Categoría</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej. Ropa, Zapatos, Tazas"
            value={nuevaCategoria.nombre}
            onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Descripción de la categoría"
            value={nuevaCategoria.descripcion}
            onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
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
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => {
                    setCategoriaSeleccionada(categoria);
                    setMostrarModalEditar(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setCategoriaSeleccionada(categoria);
                    setMostrarModalEliminar(true);
                  }}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de Confirmación de Eliminación */}
      <Modal show={mostrarModalEliminar} onHide={() => setMostrarModalEliminar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la categoría "{categoriaSeleccionada?.nombre}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalEliminar(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarCategoria}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={mostrarModalEditar} onHide={() => setMostrarModalEditar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre de la Categoría</Form.Label>
              <Form.Control
                type="text"
                value={categoriaSeleccionada?.nombre}
                onChange={(e) => setCategoriaSeleccionada({ ...categoriaSeleccionada, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={categoriaSeleccionada?.descripcion}
                onChange={(e) => setCategoriaSeleccionada({ ...categoriaSeleccionada, descripcion: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalEditar(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={editarCategoria}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionarCategorias;
