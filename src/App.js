import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './components/Inicio';
import InicioSesion from './components/InicioSesion';
import Registro from './components/Registro';
import Carrito from './components/Carrito';
import DetalleProducto from './components/DetalleProducto';
import PanelAdmin from './components/PanelAdmin';
import Inventario from './components/Inventario';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/Carrito" element={<Carrito />} />
        <Route path="/InicioSesion" element={<InicioSesion />} />
        <Route path="/Registro" element={<Registro />} /> 
        <Route path="/DetalleProducto/:productoId" element={<DetalleProducto />} />
        <Route path="/PanelAdmin" element={<PanelAdmin />} />
        <Route path="/Inventario" element={<Inventario />} />
      </Routes>
    </Router>
  );
}

export default App;
