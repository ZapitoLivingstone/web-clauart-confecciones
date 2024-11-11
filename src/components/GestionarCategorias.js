import React, { useState, useEffect } from 'react';
import FormularioGenerico from './FormularioGenerico';
import ListaGenerica from './ListaGenerica';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import Validaciones from './Validaciones';

const GestionarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [valores, setValores] = useState({ nombre: '', descripcion: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const cargarCategorias = async () => {
      const querySnapshot = await getDocs(collection(db, 'categorias'));
      const categoriasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategorias(categoriasData);
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
      await setDoc(doc(db, 'categorias', valores.id), valores);
      setCategorias((prevCategorias) =>
        prevCategorias.map((cat) => (cat.id === valores.id ? { ...cat, ...valores } : cat))
      );
    } else {
      const nuevaCategoria = { nombre: valores.nombre, descripcion: valores.descripcion };
      const docRef = doc(collection(db, 'categorias'));
      await setDoc(docRef, nuevaCategoria);
      setCategorias([...categorias, { id: docRef.id, ...nuevaCategoria }]);
    }

    setValores({ nombre: '', descripcion: '' });
    setErrors({});
    setIsEditing(false);
  };

  const handleEditar = (categoria) => {
    setValores(categoria);
    setIsEditing(true);
  };

  const handleEliminar = async (categoria) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la categoría ${categoria.nombre}?`);
    if (confirmDelete) {
      await deleteDoc(doc(db, 'categorias', categoria.id));
      setCategorias(categorias.filter((cat) => cat.id !== categoria.id));
    }
  };

  return (
    <div>
      <FormularioGenerico
        titulo={isEditing ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
        campos={[
          { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', error: errors.nombre },
          { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'text'},
        ]}
        valores={valores}
        setValores={setValores}
        onSubmit={handleAgregar}
      />
    
      <ListaGenerica
        datos={categorias}
        columnas={[
          { nombre: 'nombre', etiqueta: 'Nombre' },
          { nombre: 'descripcion', etiqueta: 'Descripción' },
        ]}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />
    </div>
  );
};

export default GestionarCategorias;
