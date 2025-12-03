import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Prosimo, izberite velikost');
      return;
    }
    addItem(product, selectedSize);
    navigate('/cart');
  };

  if (loading) {
    return <div className="text-center py-20">Nalaganje...</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Izdelek ni najden</div>;
  }

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col">
              <span className="text-sm text-gray-500 uppercase tracking-wide">
                {product.category_name}
              </span>
              <h1 className="text-3xl font-bold mt-2 mb-4">{product.name}</h1>
              <p className="text-red-500 text-3xl font-bold mb-6">
                {parseFloat(product.price).toFixed(2)} €
              </p>
              <p className="text-gray-600 mb-8">{product.description}</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Izberite velikost:</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map(s => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s.size)}
                      disabled={s.stock === 0}
                      className={`w-14 h-14 rounded-lg border-2 font-semibold transition
                        ${selectedSize === s.size
                          ? 'border-black bg-black text-white'
                          : s.stock > 0
                            ? 'border-gray-300 hover:border-black'
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Podrobnosti izdelka:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Originalni Air Jordan 1</li>
                  <li>• Premium usnje</li>
                  <li>• Air-Sole enota za udobje</li>
                  <li>• Klasična visoka silhueta</li>
                  <li>• Na zalogi: {product.stock} kosov</li>
                </ul>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-auto bg-black hover:bg-gray-800 text-white py-4 px-8 rounded-lg font-semibold text-lg transition"
              >
                Dodaj v košarico
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
