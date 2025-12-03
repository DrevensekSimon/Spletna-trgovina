import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter products based on type (High, Mid, Low)
  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    const name = product.name.toLowerCase();
    if (filter === 'high') return name.includes('high') || (!name.includes('mid') && !name.includes('low'));
    if (filter === 'mid') return name.includes('mid');
    if (filter === 'low') return name.includes('low');
    return true;
  });

  const filterOptions = [
    { value: 'all', label: 'Vsi izdelki' },
    { value: 'high', label: 'High Top' },
    { value: 'mid', label: 'Mid Top' },
    { value: 'low', label: 'Low Top' }
  ];

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-4xl font-bold">Air Jordan 1 Kolekcija</h1>
          
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <div className="flex gap-2 flex-wrap">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === option.value
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-500 mb-6">
          Prikazanih {filteredProducts.length} od {products.length} izdelkov
        </p>

        {loading ? (
          <div className="text-center py-12">Nalaganje...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Ni izdelkov za izbrani filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
