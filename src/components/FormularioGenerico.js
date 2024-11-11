import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

const FormularioGenerico = ({ titulo, campos, valores, setValores, onSubmit, onImageChange }) => {
  const [nuevoColor, setNuevoColor] = useState('');
  const [nuevaTalla, setNuevaTalla] = useState('');
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const [tallasDisponibles, setTallasDisponibles] = useState([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      if (valores.id) {
        const docRef = doc(db, 'productos', valores.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setValores((prev) => ({
            ...prev,
            colores: data.colores || [],
            tallas: data.tallas || [],
          }));
        } else {
          console.error("No se encontró el documento del producto.");
        }
      }
    };

    const cargarColoresYTallas = async () => {
      const coloresSnapshot = await getDocs(collection(db, 'colores'));
      const tallasSnapshot = await getDocs(collection(db, 'tallas'));
      setColoresDisponibles(coloresSnapshot.docs.map((doc) => ({ id: doc.id, valor: doc.data().valor })));
      setTallasDisponibles(tallasSnapshot.docs.map((doc) => ({ id: doc.id, valor: doc.data().valor })));
    };

    const cargarCategorias = async () => {
      const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
      const categorias = categoriasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategoriasDisponibles(categorias);
    };

    cargarDatos();
    cargarColoresYTallas();
    cargarCategorias();
  }, [valores.id, setValores]);

  const agregarColor = async () => {
    const color = nuevoColor.trim();
    if (color && !coloresDisponibles.map((c) => c.valor).includes(color)) {
      try {
        const nuevoDocRef = await addDoc(collection(db, 'colores'), { valor: color });
        setColoresDisponibles([...coloresDisponibles, { id: nuevoDocRef.id, valor: color }]);
        setMensaje(`Color ${color} agregado exitosamente.`);
        setNuevoColor('');
      } catch (error) {
        console.error("Error al agregar el color:", error);
        setMensaje("Error al agregar el color.");
      }
    }
  };

  const agregarTalla = async () => {
    const talla = nuevaTalla.trim();
    if (talla && !tallasDisponibles.map((t) => t.valor).includes(talla)) {
      try {
        const nuevoDocRef = await addDoc(collection(db, 'tallas'), { valor: talla });
        setTallasDisponibles([...tallasDisponibles, { id: nuevoDocRef.id, valor: talla }]);
        setMensaje(`Talla ${talla} agregada exitosamente.`);
        setNuevaTalla('');
      } catch (error) {
        console.error("Error al agregar la talla:", error);
        setMensaje("Error al agregar la talla.");
      }
    }
  };

  const eliminarColor = async (colorId, colorValor) => {
    try {
      await deleteDoc(doc(db, 'colores', colorId));
      setColoresDisponibles(coloresDisponibles.filter((c) => c.id !== colorId));
      setValores({
        ...valores,
        colores: (valores.colores || []).filter((c) => c !== colorValor),
      });
      setMensaje(`Color ${colorValor} eliminado.`);
    } catch (error) {
      console.error("Error al eliminar el color:", error);
      setMensaje("Error al eliminar el color.");
    }
  };

  const eliminarTalla = async (tallaId, tallaValor) => {
    try {
      await deleteDoc(doc(db, 'tallas', tallaId));
      setTallasDisponibles(tallasDisponibles.filter((t) => t.id !== tallaId));
      setValores({
        ...valores,
        tallas: (valores.tallas || []).filter((t) => t !== tallaValor),
      });
      setMensaje(`Talla ${tallaValor} eliminada.`);
    } catch (error) {
      console.error("Error al eliminar la talla:", error);
      setMensaje("Error al eliminar la talla.");
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
                    <Button onClick={agregarColor} className="ms-2" disabled={!nuevoColor}>
                      Agregar
                    </Button>
                  </div>
                  <div className="mt-2">
                    {coloresDisponibles.map((color) => (
                      <div key={color.id} className="d-inline-flex align-items-center me-2">
                        <Form.Check
                          type="checkbox"
                          label={color.valor}
                          checked={(valores.colores || []).includes(color.valor)}
                          onChange={() => {
                            const actualizados = (valores.colores || []).includes(color.valor)
                              ? valores.colores.filter((c) => c !== color.valor)
                              : [...(valores.colores || []), color.valor];
                            setValores({ ...valores, colores: actualizados });
                          }}
                          inline
                        />
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => eliminarColor(color.id, color.valor)}
                        >
                          &times;
                        </Button>
                      </div>
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
                    <Button onClick={agregarTalla} className="ms-2" disabled={!nuevaTalla}>
                      Agregar
                    </Button>
                  </div>
                  <div className="mt-2">
                    {tallasDisponibles.map((talla) => (
                      <div key={talla.id} className="d-inline-flex align-items-center me-2">
                        <Form.Check
                          type="checkbox"
                          label={talla.valor}
                          checked={(valores.tallas || []).includes(talla.valor)}
                          onChange={() => {
                            const actualizados = (valores.tallas || []).includes(talla.valor)
                              ? valores.tallas.filter((t) => t !== talla.valor)
                              : [...(valores.tallas || []), talla.valor];
                            setValores({ ...valores, tallas: actualizados });
                          }}
                          inline
                        />
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => eliminarTalla(talla.id, talla.valor)}
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              ) : null
            ) : campo.nombre === 'categoria' ? (
              <Form.Control
                as="select"
                value={valores.categoria || ''}
                onChange={(e) => setValores({ ...valores, categoria: e.target.value })}
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categoriasDisponibles.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </Form.Control>
            ) : (
              <Form.Control
                type={campo.tipo}
                value={valores[campo.nombre] || ''}
                onChange={(e) => setValores({ ...valores, [campo.nombre]: e.target.value })}
                className={campo.error ? 'is-invalid' : ''}
              />
            )}
            {campo.error && <div className="invalid-feedback">{campo.error}</div>}
          </Form.Group>
        ))}
        <Button type="submit">Agregar</Button>
      </Form>
    </div>
  );
};

export default FormularioGenerico;
