import React from "react";
import CardProductos from "./CardProductos";
import "../styles/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Inicio = () => {
  return (
    <>
      <header className="bg-primary text-white py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="m-0">CLAUART Confecciones</h1>
            <p className="m-0">Taller de confecciones de prendas de vestir</p>
          </div>
          <div>
            <a href="/" className="text-white me-3">Inicio</a>
            <a href="/InicioSesion" className="text-white me-3">Mi cuenta</a>
            <a href="/Carrito" className="text-white">Carrito</a>
          </div>
        </div>
      </header>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-8">
            <input type="text" className="form-control" id="searchInput" placeholder="Buscar productos..." />
          </div>
          <div className="col-md-4 text-end">
            <button className="btn btn-primary" id="searchButton">Buscar</button>
          </div>
        </div>

        <br />
        <div className="filter-container mb-4">
          <h4>Filtrar por Categoría</h4>
          <form id="filterForm">
            <select id="categoryFilter" className="form-select">
              <option value="">Todas las categorías</option>
            </select>
          </form>
        </div>
      </div>

      <div className="container my-5">
        <h2 className="text-center mb-4">Nuestros Productos</h2>

        <div className="row">
          <div className="col-md-4 col-lg-3 mb-4">
            <div className="card h-100">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Producto 1" />
              <div className="card-body">
                <h5 className="card-title">Vestido Tejido a Mano</h5>
                <p className="card-text">Un elegante vestido hecho completamente a mano.</p>
                <a href="/producto1" className="btn btn-info">Leer más</a>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-3 mb-4">
            <div className="card h-100">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Producto 2" />
              <div className="card-body">
                <h5 className="card-title">Chaleco de Lana</h5>
                <p className="card-text">Chaleco cálido y confortable ideal para el invierno.</p>
                <a href="/producto2" className="btn btn-info" data-bs-toggle="modal" data-bs-target="#productoModal2">Leer más</a>
              </div>
            </div>
          </div>
          <CardProductos/>
          {/* Repite las otras cards aquí */}

        </div>
      </div>
    </>
  );
};

export default Inicio;
