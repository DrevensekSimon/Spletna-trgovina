import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="py-20 px-4 text-center bg-gray-50 min-h-screen">
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Vaša košarica je prazna</h2>
        <Link
          to="/products"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold"
        >
          Nadaljuj z nakupovanjem
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Košarica</h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {items.map((item, idx) => (
            <div
              key={`${item.productId}-${item.size}`}
              className={`flex items-center gap-4 p-4 ${idx > 0 ? 'border-t' : ''}`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">Velikost: {item.size}</p>
                <p className="text-red-500 font-bold">{parseFloat(item.price).toFixed(2)} €</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.productId, item.size)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center text-xl font-bold mb-6">
            <span>Skupaj:</span>
            <span className="text-red-500">{total.toFixed(2)} €</span>
          </div>
          <button
            onClick={() => user ? navigate('/checkout') : navigate('/login?redirect=checkout')}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-lg font-semibold text-lg transition"
          >
            {user ? 'Nadaljuj na blagajno' : 'Prijava za nadaljevanje'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
