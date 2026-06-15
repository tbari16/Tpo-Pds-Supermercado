import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Mantenemos useApp por si luego necesitas actualizar algún estado global
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Correo o contraseña incorrectos');
      }

      const data = await response.json();

      // 1. Guardamos el token con el nombre EXACTO que busca AppContext
      localStorage.setItem('auth_token', data.token);
      
      // 2. Mapeamos (traducimos) el usuario al formato en inglés que espera tu contexto
      if (data.usuario) {
        const userData = {
          id: String(data.usuario.id),
          email: data.usuario.email,
          firstName: data.usuario.nombre,
          lastName: data.usuario.apellido,
          role: data.usuario.rol === 'ADMINISTRADOR' ? 'ADMIN' : 'CLIENT',
        };
        localStorage.setItem('user_data', JSON.stringify(userData));
      }

      toast.success('Sesión iniciada correctamente');

      // 3. Usamos window.location.href en lugar de navigate. 
      // Esto recarga la página para que AppContext despierte, lea el localStorage y te deje pasar.
      if (data.usuario?.rol === 'ADMINISTRADOR') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/products';
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#F0FDF4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E2E8F0]">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#22C55E] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className="text-3xl font-bold text-[#1E293B]">MarketHub</h1>
            </div>
            <h2 className="text-xl text-[#64748B]">Iniciar Sesión</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1E293B] mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] focus:bg-white transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1E293B] mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#2563EB] border-[#E2E8F0] rounded focus:ring-[#2563EB]"
                />
                <span className="ml-2 text-sm text-[#64748B]">Recordarme</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#64748B]">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-[#2563EB] hover:text-[#1D4ED8] font-medium">
                Regístrate
              </Link>
            </p>
          </div>

          {/* Actualizamos la cajita con el usuario que creaste hace un rato para que lo pruebes rápido */}
          <div className="mt-8 p-4 bg-gradient-to-r from-[#EFF6FF] to-[#F0FDF4] rounded-xl border border-[#E2E8F0]">
            <p className="text-sm text-[#1E293B] font-medium mb-2">Cuenta real en la Base de Datos:</p>
            <p className="text-xs text-[#64748B]">Email: sofia@email.com</p>
            <p className="text-xs text-[#64748B]">Password: mi_contraseña_123</p>
          </div>
        </div>
      </div>
    </div>
  );
}