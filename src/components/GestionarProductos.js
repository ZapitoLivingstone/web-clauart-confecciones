import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ModalGenerico from './ModalGenerico';

const GestionarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', descripcion: '', precio: '', categoria: '', img_url: '', colores: [], tallas: [] });
  const [imagen, setImagen] = useState(null);
  const [modalConfig, setModalConfig] = useState({ show: false, mode: '', producto: null });

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    setProductos(productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const cargarCategorias = async () => {
    const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
    setCategorias(categoriasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
    if (modalConfig.producto) {
      await deleteDoc(doc(db, 'productos', modalConfig.producto.id));
      setModalConfig({ show: false, mode: '', producto: null });
      cargarProductos();
    }
  };

  const actualizarProducto = async () => {
    let imgUrl = modalConfig.producto.img_url;

    if (imagen) {
      const imgRef = ref(storage, `productos/${imagen.name}`);
      await uploadBytes(imgRef, imagen);
      imgUrl = await getDownloadURL(imgRef);
    }

    await updateDoc(doc(db, 'productos', modalConfig.producto.id), { ...modalConfig.producto, img_url: imgUrl });
    setModalConfig({ show: false, mode: '', producto: null });
    cargarProductos();
  };

  const handleEdit = (producto) => {
    setModalConfig({ show: true, mode: 'edit', producto });
  };

  const handleDelete = (producto) => {
    setModalConfig({ show: true, mode: 'delete', producto });
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
              <td><img src={producto.img_url} alt={producto.nombre} style={{ width: '50px', height: '50px' }} /></td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEdit(producto)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(producto)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalGenerico
        show={modalConfig.show}
        handleClose={() => setModalConfig({ show: false, mode: '', producto: null })}
        title={modalConfig.mode === 'edit' ? 'Editar Producto' : 'Eliminar Producto'}
        handleConfirm={modalConfig.mode === 'edit' ? actualizarProducto : eliminarProducto}
        confirmText={modalConfig.mode === 'edit' ? 'Guardar Cambios' : 'Eliminar'}
      >
        {modalConfig.mode === 'edit' ? (
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={modalConfig.producto?.nombre || ''} onChange={(e) => setModalConfig({ ...modalConfig, producto: { ...modalConfig.producto, nombre: e.target.value } })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" value={modalConfig.producto?.descripcion || ''} onChange={(e) => setModalConfig({ ...modalConfig, producto: { ...modalConfig.producto, descripcion: e.target.value } })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" value={modalConfig.producto?.precio || ''} onChange={(e) => setModalConfig({ ...modalConfig, producto: { ...modalConfig.producto, precio: e.target.value } })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" onChange={(e) => setImagen(e.target.files[0])} />
            </Form.Group>
          </Form>
        ) : (
          <p>¿Estás seguro de que deseas eliminar este producto?</p>
        )}
      </ModalGenerico>
    </div>
  );
};

export default GestionarProductos;
