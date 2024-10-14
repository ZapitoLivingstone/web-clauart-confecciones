import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './components/Inicio';
import Contacto from './components/contacto';
import InicioSesion from './components/InicioSesion';
import Registro from './components/Registro'; // Asegúrate de que no haya espacios al final
import Carrito from './components/Carrito';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/Carrito" element={<Carrito />} />
        <Route path="/InicioSesion" element={<InicioSesion />} />
        <Route path="/Registro" component={<Registro/>} />
      </Routes>
    </Router>
  );
}

export default App;
