import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              JORDAN<span className="text-red-500">SHOP</span>
            </h3>
            <p className="text-gray-400">
              Vaša destinacija za originalne Air Jordan 1 čevlje.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Povezave</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white">Domov</Link></li>
              <li><Link to="/products" className="hover:text-white">Izdelki</Link></li>
              <li><Link to="/cart" className="hover:text-white">Košarica</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-gray-400">
              <li>info@jordanshop.si</li>
              <li>+386 2 234 5678</li>
              <li>Maribor, Slovenija</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          © 2025 JordanShop. Vse pravice pridržane.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
