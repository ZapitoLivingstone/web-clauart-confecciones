import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { db } from '../firebase'; 
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Agrega getDoc aquí

const FormularioGenerico = ({ titulo, campos, valores, setValores, onSubmit, onImageChange }) => {
  const [nuevoColor, setNuevoColor] = useState('');
  const [nuevaTalla, setNuevaTalla] = useState('');
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const [tallasDisponibles, setTallasDisponibles] = useState([]);

  useEffect(() => {
    if (valores.id) {
      const cargarDatos = async () => {
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
      };

      cargarDatos();
    }
  }, [valores.id, setValores]);

  const agregarColor = async () => {
    const color = nuevoColor.trim();
    if (color && !coloresDisponibles.map(c => c.valor).includes(color)) {
      const coloresActualizados = [...coloresDisponibles, { valor: color }];
      setColoresDisponibles(coloresActualizados);
      setValores({ ...valores, colores: coloresActualizados.map(c => c.valor) });

      setNuevoColor('');

      if (valores.id) {
        const productRef = doc(db, 'productos', valores.id);
        await updateDoc(productRef, { colores: coloresActualizados.map(c => c.valor) });
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
        await updateDoc(doc(db, 'productos', valores.id), { tallas: tallasActualizadas.map(t => t.valor) });
      } else {
        console.error("No se puede actualizar, falta el ID del producto.");
      }
    }
  };

  return (
    <div>
      <h2>{titulo}</h2>
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
                    <Button onClick={agregarColor} className="ms-2">Agregar</Button>
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
                    <Button onClick={agregarTalla} className="ms-2">Agregar</Button>
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
