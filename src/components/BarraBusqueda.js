import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const BarraBusqueda = ({ placeholder, busqueda, onBusquedaChange, opciones, categoriaSeleccionada, onCategoriaChange }) => {
  return (
    <div className="row mb-4">
      <div className="col-md-6">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
        />
      </div>

      {opciones && (
        <div className="col-md-6">
          <select
            className="form-select"
            value={categoriaSeleccionada}
            onChange={(e) => onCategoriaChange(e.target.value)}
          >
            <option value="">Todas las Opciones</option>
            {opciones.map((opcion) => (
              <option key={opcion.id} value={opcion.id}>
                {opcion.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default BarraBusqueda;
