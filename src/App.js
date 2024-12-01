import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './screens/Inicio';
import InicioSesion from './screens/InicioSesion';
import Registro from './screens/Registro';
import Carrito from './screens/Carrito';
import DetalleProducto from './screens/DetalleProducto';
import PanelAdmin from './screens/PanelAdmin';
import Inventario from './screens/Inventario';
import Pedidos from './screens/Pedidos';
import MiCuenta from './screens/MiCuenta';
import MisPedidos from './screens/MisPedidos';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
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
        <Route path="/Pedidos" element={<Pedidos />} />
        <Route path="/MiCuenta" element={<MiCuenta />} />
        <Route path="/MisPedidos" element={<MisPedidos />} />
      </Routes>
    </Router>
  );
}

export default App;
