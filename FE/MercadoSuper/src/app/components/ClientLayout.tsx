import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Bell, User, LogOut, Menu, Search } from 'lucide-react';
import { useState } from 'react';

export default function ClientLayout() {
  const { user, logout, cart, notifications } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/products" className="flex items-center gap-2 text-2xl font-bold text-[#2563EB]">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#22C55E] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                MarketHub
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link to="/products" className="text-[#1E293B] hover:text-[#2563EB] font-medium">
                  Productos
                </Link>
                <Link to="/orders" className="text-[#1E293B] hover:text-[#2563EB] font-medium">
                  Mis Pedidos
                </Link>
              </nav>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setNotificationsPanelOpen(!notificationsPanelOpen)}
                  className="relative p-2 text-[#1E293B] hover:text-[#2563EB] hover:bg-[#F8FAFC] rounded-xl"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#F97316] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsPanelOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No hay notificaciones
                      </div>
                    ) : (
                      <div>
                        {notifications.slice(0, 10).map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                              !notif.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-900">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notif.timestamp).toLocaleString('es-ES')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/cart"
                className="relative p-2 text-[#1E293B] hover:text-[#2563EB] hover:bg-[#F8FAFC] rounded-xl"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-[#1E293B] hover:text-[#2563EB] hover:bg-[#F8FAFC] rounded-xl">
                  <User className="w-6 h-6" />
                  <span className="hidden md:inline font-medium">{user?.firstName}</span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E2E8F0] hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-[#1E293B] hover:bg-[#F8FAFC] rounded-t-xl"
                  >
                    Mi Cuenta
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-[#FEF2F2] rounded-b-xl flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
                />
              </div>
              <nav className="flex flex-col gap-2">
                <Link
                  to="/products"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Productos
                </Link>
                <Link
                  to="/orders"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mis Pedidos
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mi Cuenta
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#22C55E] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h3 className="font-bold text-[#1E293B]">MarketHub</h3>
              </div>
              <p className="text-sm text-[#64748B]">
                Tu supermercado omnicanal de confianza para productos frescos y de calidad.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1E293B] mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li><Link to="/products" className="hover:text-[#2563EB]">Productos</Link></li>
                <li><Link to="/orders" className="hover:text-[#2563EB]">Mis Pedidos</Link></li>
                <li><Link to="/profile" className="hover:text-[#2563EB]">Mi Cuenta</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1E293B] mb-4">Información</h4>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li><a href="#" className="hover:text-[#2563EB]">Acerca de</a></li>
                <li><a href="#" className="hover:text-[#2563EB]">Contacto</a></li>
                <li><a href="#" className="hover:text-[#2563EB]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1E293B] mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li><a href="#" className="hover:text-[#2563EB]">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-[#2563EB]">Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#E2E8F0] text-center text-sm text-[#64748B]">
            © 2026 MarketHub. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
