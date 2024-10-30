import React, { useState, useEffect } from 'react';
import FormularioGenerico from './FormularioGenerico';
import ListaGenerica from './ListaGenerica';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';

const GestionarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [valores, setValores] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const cargarCategorias = async () => {
      const querySnapshot = await getDocs(collection(db, 'categorias'));
      const categoriasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategorias(categoriasData);
    };

    cargarCategorias();
  }, []);

  const handleAgregar = async (e) => {
    e.preventDefault();
    // Si isEditing es true, actualiza; de lo contrario, crea una nueva categoría.
    if (isEditing) {
      await setDoc(doc(db, 'categorias', valores.id), valores); // Actualiza la categoría
    } else {
      // Agregar lógica para crear una nueva categoría
      const nuevaCategoria = {
        nombre: valores.nombre,
        descripcion: valores.descripcion,
      };
      const docRef = await setDoc(doc(collection(db, 'categorias')), nuevaCategoria);
      setCategorias([...categorias, { id: docRef.id, ...nuevaCategoria }]);
    }

    setValores({}); // Limpiar el formulario
    setIsEditing(false); // Resetear modo de edición
  };

  const handleEditar = (categoria) => {
    setValores(categoria);
    setIsEditing(true);
  };

  const handleEliminar = async (categoria) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la categoría ${categoria.nombre}?`);
    if (confirmDelete) {
      await deleteDoc(doc(db, 'categorias', categoria.id));
      setCategorias(categorias.filter(cat => cat.id !== categoria.id));
    }
  };

  return (
    <div>
      <FormularioGenerico
        titulo={isEditing ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
        campos={[
          { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text' },
          { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'text' },
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
