import React, { useState, useEffect } from 'react';
import FormularioGenerico from './FormularioGenerico';
import ListaGenerica from './ListaGenerica';
import ModalGenerico from './ModalGenerico';
import { supabase } from '../supabase'; // Asegúrate de configurar tu cliente Supabase en un archivo separado
import Validaciones from './Validaciones';

const GestionarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [valores, setValores] = useState({ nombre: '', descripcion: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [modalType, setModalType] = useState(''); // 'edit' or 'delete'

  // Cargar categorías al iniciar el componente
  useEffect(() => {
    const cargarCategorias = async () => {
      const { data, error } = await supabase.from('categorias').select();
      if (error) {
        console.error('Error al cargar categorías:', error);
      } else {
        setCategorias(data);
      }
    };

    cargarCategorias();
  }, []);

  const validarFormulario = () => {
    const nuevoErrores = {
      nombre: Validaciones.texto(valores.nombre, 'Nombre'),
    };
    setErrors(nuevoErrores);
    return !Object.values(nuevoErrores).some((error) => error);
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    if (isEditing) {
      // Actualizar categoría
      const { error } = await supabase
        .from('categorias')
        .update({ nombre: valores.nombre, descripcion: valores.descripcion })
        .eq('id', valores.id);

      if (error) {
        console.error('Error al actualizar categoría:', error);
      } else {
        setCategorias((prevCategorias) =>
          prevCategorias.map((cat) => (cat.id === valores.id ? { ...cat, ...valores } : cat))
        );
      }
    } else {
      // Agregar nueva categoría
      const { data, error } = await supabase
        .from('categorias')
        .insert([{ nombre: valores.nombre, descripcion: valores.descripcion }]);

      if (error) {
        console.error('Error al agregar categoría:', error);
      } else {
        setCategorias([...categorias, ...data]);
      }
    }

    setValores({ nombre: '', descripcion: '' });
    setErrors({});
    setIsEditing(false);
    setShowModal(false);
  };

  const handleEditar = (categoria) => {
    setValores(categoria);
    setIsEditing(true);
    setModalType('edit');
    setShowModal(true);
  };

  const handleEliminar = async () => {
    if (selectedCategoria) {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', selectedCategoria.id);

      if (error) {
        console.error('Error al eliminar categoría:', error);
      } else {
        setCategorias(categorias.filter((cat) => cat.id !== selectedCategoria.id));
      }
    }
    setShowModal(false);
    setSelectedCategoria(null);
  };

  const handleOpenDeleteModal = (categoria) => {
    setSelectedCategoria(categoria);
    setModalType('delete');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setValores({ nombre: '', descripcion: '' });
    setSelectedCategoria(null);
    setIsEditing(false);
  };

  return (
    <div>
      <FormularioGenerico
        titulo={isEditing ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
        campos={[
          { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', error: errors.nombre },
          { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'text' },
        ]}
        valores={valores}
        setValores={setValores}
        onSubmit={(e) => {
          e.preventDefault();
          setModalType('edit');
          setShowModal(true);
        }}
      />

      <ListaGenerica
        datos={categorias}
        columnas={[
          { nombre: 'nombre', etiqueta: 'Nombre' },
          { nombre: 'descripcion', etiqueta: 'Descripción' },
        ]}
        onEditar={handleEditar}
        onEliminar={handleOpenDeleteModal}
      />

      <ModalGenerico
        show={showModal}
        handleClose={handleCloseModal}
        title={modalType === 'delete' ? 'Confirmar Eliminación' : 'Editar Categoría'}
        handleConfirm={modalType === 'delete' ? handleEliminar : handleAgregar}
        confirmText={modalType === 'delete' ? 'Eliminar' : 'Guardar'}
      >
        {modalType === 'delete' ? (
          <p>¿Estás seguro de que deseas eliminar la categoría "{selectedCategoria?.nombre}"?</p>
        ) : (
          <FormularioGenerico
            titulo="Editar Categoría"
            campos={[
              { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', error: errors.nombre },
              { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'text' },
            ]}
            valores={valores}
            setValores={setValores}
            onSubmit={handleAgregar}
          />
        )}
      </ModalGenerico>
    </div>
  );
};

export default GestionarCategorias;
