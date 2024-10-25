import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './components/Inicio';
import Contacto from './components/contacto';
import InicioSesion from './components/InicioSesion';
import Registro from './components/Registro';
import Carrito from './components/Carrito';
import DetalleProducto from './components/DetalleProducto';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/Carrito" element={<Carrito />} />
        <Route path="/InicioSesion" element={<InicioSesion />} />
        <Route path="/Registro" element={<Registro />} /> 
        <Route path="/DetalleProducto" element={<DetalleProducto />} />
      </Routes>
    </Router>
  );
}

export default App;
