import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, User } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            AIR JORDAN <span className="text-red-500">1</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Odkrijte legendarno kolekcijo Air Jordan 1 čevljev. Ikonični dizajn, neprekosljiv stil.
          </p>
          <Link
            to="/products"
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
          >
            Razišči kolekcijo
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Izpostavljeni izdelki</h2>
          {loading ? (
            <div className="text-center py-12">Nalaganje...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block border-2 border-black hover:bg-black hover:text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Vsi izdelki
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Brezplačna dostava</h3>
            <p className="text-gray-600">Za naročila nad 100€</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Varna plačila</h3>
            <p className="text-gray-600">100% varno nakupovanje</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Podpora strankam</h3>
            <p className="text-gray-600">24/7 pomoč</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
