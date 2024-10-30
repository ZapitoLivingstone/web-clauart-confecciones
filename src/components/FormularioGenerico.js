import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { db } from '../firebase'; 
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore'; // Importa las funciones necesarias

const FormularioGenerico = ({ titulo, campos, valores, setValores, onSubmit, onImageChange }) => {
  const [nuevoColor, setNuevoColor] = useState('');
  const [nuevaTalla, setNuevaTalla] = useState('');
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const [tallasDisponibles, setTallasDisponibles] = useState([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]); // Estado para categorías
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      if (valores.id) {
        const docRef = doc(db, 'productos', valores.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setColoresDisponibles(data.colores.map(c => ({ valor: c })) || []);
          setTallasDisponibles(data.tallas.map(t => ({ valor: t })) || []);
          setValores(prev => ({
            ...prev,
            colores: data.colores || [],
            tallas: data.tallas || [],
          }));
        } else {
          console.error("No se encontró el documento del producto.");
        }
      }
    };

    // Cargar categorías disponibles desde la base de datos
    const cargarCategorias = async () => {
      const categoriasSnapshot = await getDocs(collection(db, 'categorias')); // Usa collection y getDocs
      const categorias = categoriasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategoriasDisponibles(categorias);
    };

    cargarDatos();
    cargarCategorias(); // Llamar a la función para cargar categorías
  }, [valores.id, setValores]);

  const agregarColor = async () => {
    const color = nuevoColor.trim();
    if (color && !coloresDisponibles.map(c => c.valor).includes(color)) {
      const coloresActualizados = [...coloresDisponibles, { valor: color }];
      setColoresDisponibles(coloresActualizados);
      setValores({ ...valores, colores: coloresActualizados.map(c => c.valor) });
      setNuevoColor('');

      if (valores.id) {
        try {
          await updateDoc(doc(db, 'productos', valores.id), { colores: coloresActualizados.map(c => c.valor) });
          setMensaje(`Color ${color} agregado exitosamente.`);
        } catch (error) {
          console.error("Error al actualizar el color:", error);
          setMensaje("Error al agregar el color.");
        }
      } else {
        console.error("No se puede actualizar, falta el ID del producto.");
      }
    }
  };

  const agregarTalla = async () => {
    const talla = nuevaTalla.trim();
    if (talla && !tallasDisponibles.map(t => t.valor).includes(talla)) {
      const tallasActualizadas = [...tallasDisponibles, { valor: talla }];
      setTallasDisponibles(tallasActualizadas);
      setValores({ ...valores, tallas: tallasActualizadas.map(t => t.valor) });
      setNuevaTalla('');

      if (valores.id) {
        try {
          await updateDoc(doc(db, 'productos', valores.id), { tallas: tallasActualizadas.map(t => t.valor) });
          setMensaje(`Talla ${talla} agregada exitosamente.`);
        } catch (error) {
          console.error("Error al actualizar la talla:", error);
          setMensaje("Error al agregar la talla.");
        }
      } else {
        console.error("No se puede actualizar, falta el ID del producto.");
      }
    }
  };

  return (
    <div>
      <h2>{titulo}</h2>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      <Form onSubmit={onSubmit}>
        {campos.map((campo) => (
          <Form.Group key={campo.nombre} className="mb-3">
            <Form.Label>{campo.etiqueta}</Form.Label>
            {campo.tipo === 'file' ? (
              <Form.Control type="file" onChange={onImageChange} />
            ) : campo.tipo === 'checkbox' ? (
              campo.nombre === 'colores' ? (
                <>
                  <div className="d-flex align-items-center">
                    <Form.Control 
                      type="text" 
                      placeholder="Agregar nuevo color" 
                      value={nuevoColor} 
                      onChange={(e) => setNuevoColor(e.target.value)} 
                    />
                    <Button onClick={agregarColor} className="ms-2" disabled={!nuevoColor}>Agregar</Button>
                  </div>
                  <div className="mt-2">
                    {coloresDisponibles.map((color, index) => (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        label={color.valor}
                        checked={valores.colores.includes(color.valor)}
                        onChange={() => {
                          const actualizados = valores.colores.includes(color.valor)
                            ? valores.colores.filter((c) => c !== color.valor)
                            : [...valores.colores, color.valor];
                          setValores({ ...valores, colores: actualizados });
                        }}
                        inline
                      />
                    ))}
                  </div>
                </>
              ) : campo.nombre === 'tallas' ? (
                <>
                  <div className="d-flex align-items-center">
                    <Form.Control 
                      type="text" 
                      placeholder="Agregar nueva talla" 
                      value={nuevaTalla} 
                      onChange={(e) => setNuevaTalla(e.target.value)} 
                    />
                    <Button onClick={agregarTalla} className="ms-2" disabled={!nuevaTalla}>Agregar</Button>
                  </div>
                  <div className="mt-2">
                    {tallasDisponibles.map((talla, index) => (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        label={talla.valor}
                        checked={valores.tallas.includes(talla.valor)}
                        onChange={() => {
                          const actualizados = valores.tallas.includes(talla.valor)
                            ? valores.tallas.filter((t) => t !== talla.valor)
                            : [...valores.tallas, talla.valor];
                          setValores({ ...valores, tallas: actualizados });
                        }}
                        inline
                      />
                    ))}
                  </div>
                </>
              ) : null
            ) : campo.nombre === 'categoria' ? ( // Aquí se agrega el select para la categoría
              <Form.Control as="select" value={valores.categoria || ''} onChange={(e) => setValores({ ...valores, categoria: e.target.value })}>
                <option value="" disabled>Selecciona una categoría</option>
                {categoriasDisponibles.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option> // Suponiendo que cada categoría tiene un id y un nombre
                ))}
              </Form.Control>
            ) : (
              <Form.Control
                type={campo.tipo}
                value={valores[campo.nombre] || ''}
                onChange={(e) => setValores({ ...valores, [campo.nombre]: e.target.value })}
              />
            )}
          </Form.Group>
        ))}
        <Button type="submit">Agregar</Button>
      </Form>
    </div>
  );
};

export default FormularioGenerico;
