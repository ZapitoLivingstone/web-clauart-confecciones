import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';  // Importa tu instancia de supabase
import Header from '../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      const user = supabase.auth.user();  // Obtiene el usuario autenticado

      if (user) {
        try {
          const { data, error } = await supabase
            .from('pedidos')  // Reemplaza 'pedidos' por el nombre de tu tabla en Supabase
            .select('*')
            .eq('usuario_id', user.id);  // Asegúrate de que el campo en Supabase se llame 'usuario_id'

          if (error) throw error;

          const pedidosData = data.map((pedido) => ({
            id: pedido.id,
            descripcion: pedido.descripcion,
            color: pedido.color,
            customText: pedido.custom_text || 'N/A',
            size: pedido.size,
            precio: pedido.precio,
            fechaPedido: formatFechaPedido(pedido.fecha_pedido),  // Ajusta el campo de la fecha si es necesario
            estado: pedido.estado,
          }));

          setPedidos(pedidosData);
        } catch (error) {
          console.error('Error al obtener los pedidos:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPedidos();
  }, []);

  const formatFechaPedido = (fechaPedido) => {
    if (fechaPedido) {
      return new Date(fechaPedido).toLocaleDateString();  // Ajusta si 'fechaPedido' está en formato timestamp
    }
    return 'Fecha no disponible';
  };

  if (loading) {
    return <p>Cargando tus pedidos...</p>;
  }

  return (
    <>
      <Header />
      <div className="container my-4">
        <h2>Mis Pedidos</h2>
        {pedidos.length === 0 ? (
          <p>No tienes pedidos aún.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Color</th>
                  <th>Texto Personalizado</th>
                  <th>Tamaño</th>
                  <th>Precio</th>
                  <th>Fecha del Pedido</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.descripcion}</td>
                    <td>{pedido.color}</td>
                    <td>{pedido.customText}</td>
                    <td>{pedido.size}</td>
                    <td>${pedido.precio}</td>
                    <td>{pedido.fechaPedido}</td>
                    <td>{pedido.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MisPedidos;
