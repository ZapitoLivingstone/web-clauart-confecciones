import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';  // Asegúrate de configurar el cliente de Supabase en otro archivo
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
    const { data: productosData, error } = await supabase
      .from('productos')
      .select('*');
    
    if (error) {
      console.error(error);
    } else {
      setProductos(productosData);
    }
  };

  const cargarCategorias = async () => {
    const { data: categoriasData, error } = await supabase
      .from('categorias')
      .select('*');
    
    if (error) {
      console.error(error);
    } else {
      setCategorias(categoriasData);
    }
  };

  const cargarColoresYTallas = async () => {
    const { data: coloresData, error: coloresError } = await supabase
      .from('colores')
      .select('*');
    const { data: tallasData, error: tallasError } = await supabase
      .from('tallas')
      .select('*');
    
    if (coloresError || tallasError) {
      console.error(coloresError, tallasError);
    } else {
      setColoresDisponibles(coloresData);
      setTallasDisponibles(tallasData);
    }
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
      const { data, error } = await supabase
        .storage
        .from('productos')
        .upload(`productos/${imagen.name}`, imagen);
      
      if (error) {
        console.error(error);
      } else {
        const { publicURL } = supabase.storage.from('productos').getPublicUrl(data.path);
        imgUrl = publicURL;
      }
    }

    const { error } = await supabase
      .from('productos')
      .insert([{ 
        ...nuevoProducto, 
        img_url: imgUrl 
      }]);
    
    if (error) {
      console.error(error);
    } else {
      setNuevoProducto({ nombre: '', descripcion: '', precio: '', categoria: '', img_url: '', colores: [], tallas: [] });
      setImagen(null);
      cargarProductos();
    }
  };

  const handleEditarProducto = (producto) => {
    setModalConfig({
      show: true,
      mode: 'edit',
      producto: {
        ...producto,
        colores: producto.colores || [], 
        tallas: producto.tallas || [],  
      },
    });
  };

  const handleEliminarProducto = (producto) => {
    setModalConfig({ show: true, mode: 'delete', producto });
  };

  const actualizarProducto = async () => {
    if (!validarFormulario()) return;

    let imgUrl = modalConfig.producto.img_url;
    if (imagen) {
      const { data, error } = await supabase
        .storage
        .from('productos')
        .upload(`productos/${imagen.name}`, imagen);
      
      if (error) {
        console.error(error);
      } else {
        const { publicURL } = supabase.storage.from('productos').getPublicUrl(data.path);
        imgUrl = publicURL;
      }
    }

    const { error } = await supabase
      .from('productos')
      .update({ ...modalConfig.producto, img_url: imgUrl })
      .eq('id', modalConfig.producto.id);
    
    if (error) {
      console.error(error);
    } else {
      setModalConfig({ show: false, mode: '', producto: null });
      cargarProductos();
    }
  };

  const eliminarProducto = async () => {
    if (modalConfig.producto) {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', modalConfig.producto.id);
      
      if (error) {
        console.error(error);
      } else {
        setModalConfig({ show: false, mode: '', producto: null });
        cargarProductos();
      }
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
