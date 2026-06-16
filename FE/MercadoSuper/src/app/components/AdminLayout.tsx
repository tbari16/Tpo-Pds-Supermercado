import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Productos', icon: Package },
    { path: '/admin/categories', label: 'Categorias', icon: FolderTree },
    { path: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E2E8F0] transform transition-transform duration-300 shadow-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:shadow-none`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#E2E8F0]">
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-xl font-bold text-[#2563EB]">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#22C55E] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            MarketHub
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2563EB]/10 to-[#22C55E]/10 text-[#2563EB]'
                    : 'text-[#1E293B] hover:bg-[#F8FAFC]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-[#1E293B] hover:bg-[#F8FAFC] rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />

          <div className="relative group">
            <button className="flex items-center gap-2 p-2 text-[#1E293B] hover:text-[#2563EB] hover:bg-[#F8FAFC] rounded-xl">
              <User className="w-6 h-6" />
              <span className="hidden md:inline font-medium">{user?.firstName}</span>
            </button>

            <div className="absolute right-0 top-full w-48 bg-white rounded-xl shadow-lg border border-[#E2E8F0] hidden group-hover:block z-50">
              <Link
                to="/admin/profile"
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
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
