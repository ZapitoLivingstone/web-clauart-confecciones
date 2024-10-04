import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './components/Inicio';
import Contacto from './components/contacto';
import Carrito from './components/carrito';
import Cuenta from './components/cuenta';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/cuenta" element={<Cuenta />} />
      </Routes>
    </Router>
  );
}

export default App;
