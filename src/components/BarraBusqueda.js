import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/BarraBusqueda.css';

const BarraBusqueda = ({
  placeholder,
  busqueda,
  onBusquedaChange,
  opciones = [],
  categoriaSeleccionada,
  onCategoriaChange,
}) => {
  return (
    <div className="search-container row">
      <div className="col-md-6">
        <input
          type="text"
          className="form-control search-input"
          placeholder={placeholder}
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
        />
      </div>
      {opciones.length > 0 && (
        <div className="col-md-6">
          <select
            className="form-select category-dropdown"
            value={categoriaSeleccionada}
            onChange={(e) => onCategoriaChange(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {opciones.map((opcion) => (
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

BarraBusqueda.propTypes = {
  placeholder: PropTypes.string.isRequired,
  busqueda: PropTypes.string.isRequired,
  onBusquedaChange: PropTypes.func.isRequired,
  opciones: PropTypes.array,
  categoriaSeleccionada: PropTypes.string,
  onCategoriaChange: PropTypes.func,
};

export default BarraBusqueda;
