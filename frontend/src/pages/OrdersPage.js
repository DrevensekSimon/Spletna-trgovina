import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import api from '../api/axios';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'V čakanju',
    processing: 'V obdelavi',
    shipped: 'Odposlano',
    delivered: 'Dostavljeno',
    cancelled: 'Preklicano'
  };

  if (loading) {
    return <div className="text-center py-20">Nalaganje...</div>;
  }

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Moja naročila</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nimate še nobenih naročil</p>
            <Link
              to="/products"
              className="inline-block mt-4 bg-black text-white px-6 py-3 rounded-lg font-semibold"
            >
              Začni z nakupovanjem
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Naročilo #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('sl-SI')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">Vel. {item.size} x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">{parseFloat(item.price).toFixed(2)} €</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold">Skupaj:</span>
                  <span className="font-bold text-red-500">{parseFloat(order.total_amount).toFixed(2)} €</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
