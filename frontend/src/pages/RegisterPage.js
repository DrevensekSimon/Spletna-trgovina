import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.email, form.password, form.firstName, form.lastName);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Napaka pri registraciji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Registracija</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ime</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priimek</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Geslo</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg transition"
          >
            {loading ? 'Registracija...' : 'Registriraj se'}
          </button>

          <p className="text-center mt-4 text-gray-600">
            Že imate račun?{' '}
            <Link to="/login" className="text-black font-semibold hover:underline">
              Prijava
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
