import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(`/${redirect}`);
    } catch (err) {
      setError('Napačen email ali geslo');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
  };

  return (
    <div className="py-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Prijava</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="vas@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Geslo</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg transition"
          >
            {loading ? 'Prijavljanje...' : 'Prijava'}
          </button>

          <p className="text-center mt-4 text-gray-600">
            Nimate računa?{' '}
            <Link to="/register" className="text-black font-semibold hover:underline">
              Registracija
            </Link>
          </p>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo račun:</p>
            <p className="text-sm"><strong>Email:</strong> demo@example.com</p>
            <p className="text-sm"><strong>Geslo:</strong> demo123</p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Izpolni demo podatke
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
