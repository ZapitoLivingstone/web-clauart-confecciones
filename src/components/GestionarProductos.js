import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const GestionarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', descripcion: '', precio: '', categoria: '', img_url: '', colores: [], tallas: [] });
  const [imagen, setImagen] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    const listaProductos = productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProductos(listaProductos);
  };

  const cargarCategorias = async () => {
    const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
    const listaCategorias = categoriasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCategorias(listaCategorias);
  };

  const agregarProducto = async (e) => {
    e.preventDefault();
    let imgUrl = '';

    if (imagen) {
      const imgRef = ref(storage, `productos/${imagen.name}`);
      await uploadBytes(imgRef, imagen);
      imgUrl = await getDownloadURL(imgRef);
    }

    await addDoc(collection(db, 'productos'), { ...nuevoProducto, img_url: imgUrl });
    setNuevoProducto({ nombre: '', descripcion: '', precio: '', categoria: '', img_url: '', colores: [], tallas: [] });
    setImagen(null);
    cargarProductos();
  };

  const eliminarProducto = async () => {
    if (productoSeleccionado) {
      await deleteDoc(doc(db, 'productos', productoSeleccionado.id));
      setMostrarModalEliminar(false);
      cargarProductos();
      setProductoSeleccionado(null);
    }
  };

  const actualizarProducto = async () => {
    let imgUrl = productoSeleccionado.img_url;

    if (imagen) {
      const imgRef = ref(storage, `productos/${imagen.name}`);
      await uploadBytes(imgRef, imagen);
      imgUrl = await getDownloadURL(imgRef);
    }

    await updateDoc(doc(db, 'productos', productoSeleccionado.id), { ...productoSeleccionado, img_url: imgUrl });
    setMostrarModalEditar(false);
    cargarProductos();
  };

  const handleColorChange = (e) => {
    const selectedColor = e.target.value;
    setNuevoProducto((prev) => ({
      ...prev,
      colores: prev.colores.includes(selectedColor)
        ? prev.colores.filter((color) => color !== selectedColor)
        : [...prev.colores, selectedColor],
    }));
  };

  const handleTallaChange = (e) => {
    const selectedTalla = e.target.value;
    setNuevoProducto((prev) => ({
      ...prev,
      tallas: prev.tallas.includes(selectedTalla)
        ? prev.tallas.filter((talla) => talla !== selectedTalla)
        : [...prev.tallas, selectedTalla],
    }));
  };

  return (
    <div>
      <h2>Gestionar Productos</h2>
      <Form onSubmit={agregarProducto} className="mb-4">
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Descripción</Form.Label>
          <Form.Control as="textarea" value={nuevoProducto.descripcion} onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Precio</Form.Label>
          <Form.Control type="number" value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Categoría</Form.Label>
          <Form.Control as="select" value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}>
            <option>Seleccionar</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.nombre}>{categoria.nombre}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Colores</Form.Label>
          <Form.Check type="checkbox" label="Rojo" value="Rojo" onChange={handleColorChange} />
          <Form.Check type="checkbox" label="Azul" value="Azul" onChange={handleColorChange} />
          <Form.Check type="checkbox" label="Verde" value="Verde" onChange={handleColorChange} />
          <Form.Check type="checkbox" label="Negro" value="Negro" onChange={handleColorChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Tallas</Form.Label>
          <Form.Check type="checkbox" label="Pequeño" value="Pequeño" onChange={handleTallaChange} />
          <Form.Check type="checkbox" label="Mediano" value="Mediano" onChange={handleTallaChange} />
          <Form.Check type="checkbox" label="Grande" value="Grande" onChange={handleTallaChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Imagen</Form.Label>
          <Form.Control type="file" onChange={(e) => setImagen(e.target.files[0])} />
        </Form.Group>
        <Button type="submit" className="mt-3">Agregar Producto</Button>
      </Form>

      <h3>Lista de Productos</h3>
      <Table striped bordered hover>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Descripción</th>
      <th>Precio</th>
      <th>Colores</th>
      <th>Tallas</th>
      <th>Imagen</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {productos.map((producto) => (
      <tr key={producto.id}>
        <td>{producto.nombre}</td>
        <td>{producto.descripcion}</td>
        <td>{producto.precio}</td>
        <td>{Array.isArray(producto.colores) ? producto.colores.join(", ") : "N/A"}</td>
        <td>{Array.isArray(producto.tallas) ? producto.tallas.join(", ") : "N/A"}</td>
        <td>
          <img src={producto.img_url} alt={producto.nombre} style={{ width: '50px', height: '50px' }} />
        </td>
        <td>
          <Button size="sm" variant="warning" onClick={() => { setProductoSeleccionado(producto); setMostrarModalEditar(true); }}>Editar</Button>{' '}
          <Button size="sm" variant="danger" onClick={() => { setProductoSeleccionado(producto); setMostrarModalEliminar(true); }}>Eliminar</Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

      {/* Modal para editar producto */}
      <Modal show={mostrarModalEditar} onHide={() => setMostrarModalEditar(false)}>
        <Modal.Header closeButton><Modal.Title>Editar Producto</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={productoSeleccionado?.nombre || ''} onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, nombre: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" value={productoSeleccionado?.descripcion || ''} onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, descripcion: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" value={productoSeleccionado?.precio || ''} onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, precio: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" onChange={(e) => setImagen(e.target.files[0])} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalEditar(false)}>Cancelar</Button>
          <Button variant="primary" onClick={actualizarProducto}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal show={mostrarModalEliminar} onHide={() => setMostrarModalEliminar(false)}>
        <Modal.Header closeButton><Modal.Title>Eliminar Producto</Modal.Title></Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar este producto?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalEliminar(false)}>Cancelar</Button>
          <Button variant="danger" onClick={eliminarProducto}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionarProductos;
