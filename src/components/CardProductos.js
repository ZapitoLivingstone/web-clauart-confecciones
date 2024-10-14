import React from 'react';
import PropTypes from 'prop-types';

const CardProductos = ({ id, imagen, titulo, descripcion }) => {

    const handleRedirect = () => {
        window.location.href = `/producto/${id}`; // Redirige a la página del producto con el ID
    };

    return (
        <div className="card" style={{ width: '18rem' }}>
            <img src={imagen} className="card-img-top" alt={titulo} />
            <div className="card-body">
                <h5 className="card-title">{titulo}</h5>
                <p className="card-text">{descripcion}</p>
                <button onClick={handleRedirect} className="btn btn-primary">
                    Agendar
                </button>
            </div>
        </div>
    );
};

CardProductos.propTypes = {
    id: PropTypes.string.isRequired,          
    imagen: PropTypes.string.isRequired,      
    titulo: PropTypes.string.isRequired,       
    descripcion: PropTypes.string.isRequired   
};

export default CardProductos;
