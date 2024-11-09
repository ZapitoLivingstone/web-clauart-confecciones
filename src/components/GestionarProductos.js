import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FormularioGenerico from './FormularioGenerico';
import ListaGenerica from './ListaGenerica';
import ModalGenerico from './ModalGenerico';
import Validaciones from './Validaciones';

const GestionarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const [tallasDisponibles, setTallasDisponibles] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ 
    nombre: '', 
    descripcion: '', 
    precio: '', 
    categoria: '', 
    img_url: '', 
    colores: [], 
    tallas: [] 
  });
  const [imagen, setImagen] = useState(null);
  const [modalConfig, setModalConfig] = useState({ show: false, mode: '', producto: null });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarColoresYTallas();
  }, []);

  const cargarProductos = async () => {
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    setProductos(productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const cargarCategorias = async () => {
    const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
    setCategorias(categoriasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const cargarColoresYTallas = async () => {
    const coloresSnapshot = await getDocs(collection(db, 'colores'));
    const tallasSnapshot = await getDocs(collection(db, 'tallas'));
    setColoresDisponibles(coloresSnapshot.docs.map((doc) => ({ id: doc.id, valor: doc.data().valor })));
    setTallasDisponibles(tallasSnapshot.docs.map((doc) => ({ id: doc.id, valor: doc.data().valor })));
  };

  const validarFormulario = () => {
    const nuevosErrores = {
      nombre: Validaciones.texto(nuevoProducto.nombre, 'Nombre'),
      precio: Validaciones.precio(nuevoProducto.precio),
      categoria: Validaciones.seleccion(nuevoProducto.categoria, 'Categoría'),
    };
    setErrors(nuevosErrores);
    return !Object.values(nuevosErrores).some((error) => error);
  };

  const agregarProducto = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

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

  const handleEditarProducto = (producto) => {
    setModalConfig({ show: true, mode: 'edit', producto });
  };

  const handleEliminarProducto = (producto) => {
    setModalConfig({ show: true, mode: 'delete', producto });
  };

  const actualizarProducto = async () => {
    if (!validarFormulario()) return;
    
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

  const eliminarProducto = async () => {
    if (modalConfig.producto) {
      await deleteDoc(doc(db, 'productos', modalConfig.producto.id));
      setModalConfig({ show: false, mode: '', producto: null });
      cargarProductos();
    }
  };

  const camposProducto = [
    { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', error: errors.nombre },
    { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea'},
    { nombre: 'precio', etiqueta: 'Precio', tipo: 'number', error: errors.precio },
    { nombre: 'categoria', etiqueta: 'Categoría', tipo: 'select', opciones: categorias, error: errors.categoria },
    { nombre: 'img_url', etiqueta: 'Imagen', tipo: 'file' },
    { nombre: 'colores', etiqueta: 'Colores', tipo: 'checkbox', opciones: coloresDisponibles },
    { nombre: 'tallas', etiqueta: 'Tallas', tipo: 'checkbox', opciones: tallasDisponibles },
  ];

  const columnasProducto = [
    { nombre: 'nombre', etiqueta: 'Nombre' },
    { nombre: 'descripcion', etiqueta: 'Descripción' },
    { nombre: 'precio', etiqueta: 'Precio' },
    { nombre: 'colores', etiqueta: 'Colores' },
    { nombre: 'tallas', etiqueta: 'Tallas' },
    { nombre: 'img_url', etiqueta: 'Imagen' },
  ];

  return (
    <div>
      <FormularioGenerico
        titulo="Agregar Producto"
        campos={camposProducto}
        valores={nuevoProducto}
        setValores={setNuevoProducto}
        onSubmit={agregarProducto}
        onImageChange={(e) => setImagen(e.target.files[0])}
      />
      <ListaGenerica
        datos={productos}
        columnas={columnasProducto}
        onEditar={handleEditarProducto}
        onEliminar={handleEliminarProducto}
      />
      <ModalGenerico
        show={modalConfig.show}
        handleClose={() => setModalConfig({ show: false, mode: '', producto: null })}
        title={modalConfig.mode === 'edit' ? 'Editar Producto' : 'Eliminar Producto'}
        handleConfirm={modalConfig.mode === 'edit' ? actualizarProducto : eliminarProducto}
        confirmText={modalConfig.mode === 'edit' ? 'Guardar Cambios' : 'Eliminar'}
      >
        {modalConfig.mode === 'edit' ? (
          <FormularioGenerico
            titulo="Editar Producto"
            campos={camposProducto}
            valores={modalConfig.producto}
            setValores={(valores) => setModalConfig({ ...modalConfig, producto: valores })}
            onSubmit={actualizarProducto}
            onImageChange={(e) => setImagen(e.target.files[0])}
          />
        ) : (
          <p>¿Estás seguro de que deseas eliminar este producto?</p>
        )}
      </ModalGenerico>
    </div>
  );
};

export default GestionarProductos;
