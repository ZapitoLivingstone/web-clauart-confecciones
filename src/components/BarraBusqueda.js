import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/BarraBusqueda.css';

const BarraBusqueda = ({ placeholder, busqueda, onBusquedaChange, opciones, categoriaSeleccionada, onCategoriaChange }) => {
  return (
    <div className="search-container">
      <div className="col-md-6">
        <input
          type="text"
          className="form-control search-input"
          placeholder={placeholder}
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
        />
      </div>

      {opciones && (
        <div className="col-md-6">
          <select
          className="form-select category-dropdown"
          value={categoriaSeleccionada}
          onChange={(e) => onCategoriaChange(e.target.value)}
        >
          <option value="">Todas las Opciones</option>
          {opciones && opciones.length > 0 && opciones.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>

        </div>
      )}
    </div>
  );
};

export default BarraBusqueda;
