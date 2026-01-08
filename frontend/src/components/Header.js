import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            JORDAN<span className="text-red-500">SHOP</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-red-500 transition">Domov</Link>
            <Link to="/products" className="hover:text-red-500 transition">Izdelki</Link>
            {user && (
              <Link to="/orders" className="hover:text-red-500 transition">Naročila</Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative hover:text-red-500 transition">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-300">{user.firstName}</span>
                <button onClick={logout} className="hover:text-red-500 transition">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-1 hover:text-red-500 transition">
                <User size={20} />
                <span>Prijava</span>
              </Link>
            )}

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 flex flex-col gap-3">
            <Link to="/" className="hover:text-red-500" onClick={() => setMenuOpen(false)}>Domov</Link>
            <Link to="/products" className="hover:text-red-500" onClick={() => setMenuOpen(false)}>Izdelki</Link>
            {user ? (
              <>
                <Link to="/orders" className="hover:text-red-500" onClick={() => setMenuOpen(false)}>Naročila</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left hover:text-red-500">
                  Odjava
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-red-500" onClick={() => setMenuOpen(false)}>Prijava</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
