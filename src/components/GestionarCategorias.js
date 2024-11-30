import React, { useState, useEffect } from 'react';
import FormularioGenerico from './FormularioGenerico';
import ListaGenerica from './ListaGenerica';
import ModalGenerico from './ModalGenerico';
import { supabase } from '../supabase';
import Validaciones from './Validaciones';

const GestionarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [valores, setValores] = useState({ nombre: '', descripcion: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [modalType, setModalType] = useState(''); // 'edit' or 'delete'

  useEffect(() => {
    const cargarCategorias = async () => {
      const { data, error } = await supabase.from('categorias').select('*');
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

    const nuevaCategoria = { nombre: valores.nombre.trim(), descripcion: valores.descripcion.trim() };

    const { error } = await supabase.from('categorias').insert([nuevaCategoria]);

    if (error) {
      console.error('Error al agregar categoría:', error);
      return;
    }

    setCategorias([...categorias, nuevaCategoria]);
    setValores({ nombre: '', descripcion: '' });
    setErrors({});
    setShowModal(false);
  };

  const handleEditar = (categoria) => {
    setValores({ nombre: categoria.nombre, descripcion: categoria.descripcion });
    setIsEditing(true);
    setModalType('edit');
    setSelectedCategoria(categoria);
    setShowModal(true);
  };

  const handleActualizar = async () => {
    const categoriaEditada = { nombre: valores.nombre.trim(), descripcion: valores.descripcion.trim() };

    const { error } = await supabase
      .from('categorias')
      .update(categoriaEditada)
      .eq('id', selectedCategoria.id);

    if (error) {
      console.error('Error al actualizar categoría:', error);
      return;
    }

    setCategorias(categorias.map(cat => (cat.id === selectedCategoria.id ? { ...cat, ...categoriaEditada } : cat)));
    setValores({ nombre: '', descripcion: '' });
    setErrors({});
    setIsEditing(false);
    setShowModal(false);
  };

  const handleEliminar = async () => {
    const { error } = await supabase.from('categorias').delete().eq('id', selectedCategoria.id);
    if (error) {
      console.error('Error al eliminar categoría:', error);
      return;
    }

    setCategorias(categorias.filter(cat => cat.id !== selectedCategoria.id));
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
          if (isEditing) {
            handleActualizar();
          } else {
            handleAgregar(e);
          }
        }}
      />

      <ListaGenerica
        datos={categorias}
        columnas={[{ nombre: 'nombre', etiqueta: 'Nombre' }, { nombre: 'descripcion', etiqueta: 'Descripción' }]}
        onEditar={(categoria) => handleEditar(categoria)}
        onEliminar={(categoria) => handleOpenDeleteModal(categoria)}
      />

      <ModalGenerico
        show={showModal}
        handleClose={handleCloseModal}
        title={modalType === 'delete' ? 'Confirmar Eliminación' : 'Editar Categoría'}
        handleConfirm={modalType === 'delete' ? handleEliminar : handleActualizar}
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
            onSubmit={handleActualizar}
          />
        )}
      </ModalGenerico>
    </div>
  );
};

export default GestionarCategorias;