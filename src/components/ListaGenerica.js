// ListaGenerica.js
import React from 'react';
import { Table, Button } from 'react-bootstrap';

const ListaGenerica = ({ datos, columnas, onEditar, onEliminar }) => (
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
      {datos.map((item) => (
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
);

export default ListaGenerica;
