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
      const { data: colores, error: errorColores } = await supabase.from('colores').select('*');
      const { data: tallas, error: errorTallas } = await supabase.from('tallas').select('*');

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
    const { data, error } = await supabase
      .from('colores')
      .insert([{ valor: nuevoColor.trim() }]);

    if (error) {
      console.error('Error al agregar el color:', error);
      setMensaje('Error al agregar el color.');
    } else {
      setColoresDisponibles([...coloresDisponibles, data[0]]);
      setMensaje(`Color "${nuevoColor}" agregado exitosamente.`);
      setNuevoColor('');
    }
  };

  const agregarTalla = async () => {
    const { data, error } = await supabase
      .from('tallas')
      .insert([{ valor: nuevaTalla.trim() }]);

    if (error) {
      console.error('Error al agregar la talla:', error);
      setMensaje('Error al agregar la talla.');
    } else {
      setTallasDisponibles([...tallasDisponibles, data[0]]);
      setMensaje(`Talla "${nuevaTalla}" agregada exitosamente.`);
      setNuevaTalla('');
    }
  };

  const eliminarColor = async (colorId, colorValor) => {
    const { error } = await supabase.from('colores').delete().eq('id', colorId);

    if (error) {
      console.error('Error al eliminar el color:', error);
      setMensaje('Error al eliminar el color.');
    } else {
      setColoresDisponibles(coloresDisponibles.filter((c) => c.id !== colorId));
      setValores({
        ...valores,
        colores: (valores.colores || []).filter((c) => c !== colorValor),
      });
      setMensaje(`Color "${colorValor}" eliminado.`);
    }
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
        <Button type="submit" variant="primary">
          Guardar
        </Button>
      </Form>
    </div>
  );
};

export default FormularioGenerico;
