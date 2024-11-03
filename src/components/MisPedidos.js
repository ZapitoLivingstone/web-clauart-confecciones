import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Header from './Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const pedidosRef = collection(db, 'pedidos');
      const q = query(pedidosRef, where('usuarioId', '==', user.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const pedidosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setPedidos(pedidosData);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

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
                    <td>{pedido.customText || 'N/A'}</td>
                    <td>{pedido.size}</td>
                    <td>${pedido.precio}</td>
                    <td>{new Date(pedido.fechaPedido.seconds * 1000).toLocaleDateString()}</td>
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
