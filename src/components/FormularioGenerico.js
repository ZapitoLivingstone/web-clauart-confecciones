import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { supabase } from '../supabase';

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
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('id', valores.id)
          .single();

        if (error) {
          console.error('Error al cargar el producto:', error);
        } else {
          setValores((prev) => ({
            ...prev,
            colores: data.colores || [],
            tallas: data.tallas || [],
          }));
        }
      }
    };

    const cargarColoresYTallas = async () => {
      const { data: colores, error: errorColores } = await supabase
        .from('colores')
        .select('*');

      const { data: tallas, error: errorTallas } = await supabase
        .from('tallas')
        .select('*');

      if (errorColores) {
        console.error('Error al cargar colores:', errorColores);
      } else {
        setColoresDisponibles(colores || []);
      }

      if (errorTallas) {
        console.error('Error al cargar tallas:', errorTallas);
      } else {
        setTallasDisponibles(tallas || []);
      }
    };

    const cargarCategorias = async () => {
      const { data: categorias, error } = await supabase.from('categorias').select('*');

      if (error) {
        console.error('Error al cargar categorías:', error);
      } else {
        setCategoriasDisponibles(categorias || []);
      }
    };

    cargarDatos();
    cargarColoresYTallas();
    cargarCategorias();
  }, [valores.id, setValores]);

  const agregarColor = async () => {
    if (!nuevoColor.trim()) return;

    const { data, error } = await supabase
      .from('colores')
      .insert([{ nombre: nuevoColor.trim() }])
      .select();

    if (error) {
      console.error('Error al agregar el color:', error);
      setMensaje('Error al agregar el color.');
      return;
    }

    const colorId = data[0].id;

    const { error: errorRelacion } = await supabase
      .from('productos_colores')
      .insert([{ producto_id: valores.id, color_id: colorId }]);

    if (errorRelacion) {
      console.error('Error al asociar el color con el producto:', errorRelacion);
    } else {
      setColoresDisponibles([...coloresDisponibles, data[0]]);
      setMensaje(`Color "${nuevoColor}" agregado exitosamente.`);
      setNuevoColor('');
    }
  };

  const agregarTalla = async () => {
    if (!nuevaTalla.trim()) return; // Evitar agregar tallas vacías

    const { data, error } = await supabase
        .from('tallas')
        .insert([{ nombre: nuevaTalla.trim() }])
        .select(); // Asegúrate de que la respuesta incluya la nueva talla

    if (error) {
        console.error('Error al agregar la talla:', error);
        setMensaje('Error al agregar la talla.');
        return;
    }

    // Verifica si data tiene algún elemento antes de acceder a él
    if (data && data.length > 0) {
        setTallasDisponibles([...tallasDisponibles, data[0]]);
        setMensaje(`Talla "${nuevaTalla}" agregada exitosamente.`);
        setNuevaTalla('');
    } else {
        console.error('No se recibió datos válidos al agregar la talla.');
        setMensaje('Error al agregar la talla. No se recibieron datos válidos.');
    }
};

  const eliminarColor = async (colorId, colorValor) => {
    const { error: errorRelacion } = await supabase
      .from('productos_colores')
      .delete()
      .eq('color_id', colorId)
      .eq('producto_id', valores.id);

    if (errorRelacion) {
      console.error('Error al eliminar la relación color-producto:', errorRelacion);
      setMensaje('Error al eliminar el color.');
      return;
    }

    setColoresDisponibles(coloresDisponibles.filter((c) => c.id !== colorId));
    setValores({
      ...valores,
      colores: (valores.colores || []).filter((c) => c !== colorValor),
    });
    setMensaje(`Color "${colorValor}" eliminado.`);
  };

  const eliminarTalla = async (tallaId, tallaValor) => {
    const { error } = await supabase.from('tallas').delete().eq('id', tallaId);

    if (error) {
      console.error('Error al eliminar la talla:', error);
      setMensaje('Error al eliminar la talla.');
    } else {
      setTallasDisponibles(tallasDisponibles.filter((t) => t.id !== tallaId));
      setValores({
        ...valores,
        tallas: (valores.tallas || []).filter((t) => t !== tallaValor),
      });
      setMensaje(`Talla "${tallaValor}" eliminada.`);
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
                          label={color.nombre}
                          checked={(valores.colores || []).includes(color.nombre)}
                          onChange={() => {
                            const actualizados = (valores.colores || []).includes(color.nombre)
                              ? valores.colores.filter((c) => c !== color.nombre)
                              : [...(valores.colores || []), color.nombre];
                            setValores({ ...valores, colores: actualizados });
                          }}
                          inline
                        />
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => eliminarColor(color.id, color.nombre)}
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
                          label={talla.nombre}
                          checked={(valores.tallas || []).includes(talla.nombre)}
                          onChange={() => {
                            const actualizados = (valores.tallas || []).includes(talla.nombre)
                              ? valores.tallas.filter((t) => t !== talla.nombre)
                              : [...(valores.tallas || []), talla.nombre];
                            setValores({ ...valores, tallas: actualizados });
                          }}
                          inline
                        />
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => eliminarTalla(talla.id, talla.nombre)}
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              ) : null
            ) : campo.nombre === 'categorias_id' ? (
              <Form.Control
                as="select"
                value={valores.categorias_id || ''}
                onChange={(e) => setValores({ ...valores, categorias_id: e.target.value })}
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
        <Button type="submit" variant="primary">
          Guardar
        </Button>
      </Form>
    </div>
  );
};

export default FormularioGenerico;