import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: user?.address || '',
    city: user?.city || 'Maribor',
    postalCode: user?.postalCode || '2000'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.address || !form.city || !form.postalCode) {
      alert('Prosimo, izpolnite vsa polja');
      return;
    }

    setLoading(true);
    try {
      await api.post('/orders', {
        items: items.map(i => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity
        })),
        shippingAddress: form.address,
        shippingCity: form.city,
        shippingPostalCode: form.postalCode
      });

      clearCart();
      navigate('/orders');
      alert('Naročilo uspešno oddano!');
    } catch (error) {
      alert('Napaka pri oddaji naročila');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blagajna</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Naslov za dostavo</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Naslov</label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="Ulica in hišna številka"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mesto</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                  placeholder="Maribor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Poštna številka</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={e => setForm({ ...form, postalCode: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                  placeholder="2000"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Povzetek naročila</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                  <span>{item.name} (Vel. {item.size}) x{item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-4">
              <span>Skupaj:</span>
              <span className="text-red-500">{total.toFixed(2)} €</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg transition"
          >
            {loading ? 'Obdelovanje...' : 'Potrdi naročilo'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
