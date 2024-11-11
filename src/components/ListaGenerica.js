import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import BarraBusqueda from './BarraBusqueda';

const ListaGenerica = ({ datos, columnas, onEditar, onEliminar }) => {
  const [busqueda, setBusqueda] = useState('');

  // Filtrar los datos según el término de búsqueda en nombre o categoría
  const datosFiltrados = datos.filter((item) => {
    const nombre = item.nombre ? item.nombre.toLowerCase() : '';
    const categoria = item.categoria ? item.categoria.toLowerCase() : '';
    return nombre.includes(busqueda.toLowerCase()) || categoria.includes(busqueda.toLowerCase());
  });

  return (
    <>
      <BarraBusqueda
        placeholder="Buscar por nombre o categoría..."
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col.nombre}>{col.etiqueta}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datosFiltrados.map((item) => (
            <tr key={item.id}>
              {columnas.map((col) => (
                <td key={col.nombre}>
                  {col.nombre === 'img_url' && item[col.nombre] ? (
                    <img src={item[col.nombre]} alt="Producto" style={{ width: '50px', height: '50px' }} />
                  ) : Array.isArray(item[col.nombre]) ? (
                    item[col.nombre].join(', ')
                  ) : (
                    item[col.nombre]
                  )}
                </td>
              ))}
              <td>
                <Button size="sm" variant="warning" onClick={() => onEditar(item)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => onEliminar(item)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ListaGenerica;
