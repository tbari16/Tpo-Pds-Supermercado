import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp, type OrderStatus } from '../context/AppContext';
import { Package, Search, ShoppingBag } from 'lucide-react';

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  PENDIENTE: { bg: 'bg-orange-100', text: 'text-orange-700' },
  CONFIRMADO: { bg: 'bg-blue-100', text: 'text-blue-700' },
  ENVIADO: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  ENTREGADO: { bg: 'bg-green-100', text: 'text-green-700' },
  CANCELADO: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export default function Orders() {
  const { orders, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc'>('date-desc');

  const userOrders = orders.filter((order) => order.userId === user?.id);

  const filteredOrders = useMemo(() => {
    let filtered = userOrders.filter((order) => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [userOrders, searchQuery, statusFilter, sortBy]);

  if (userOrders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No tienes pedidos</h2>
          <p className="text-gray-600 mb-6">
            Realiza tu primer pedido para verlo aquí
          </p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Ir a Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número de pedido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="CONFIRMADO">Confirmado</option>
            <option value="ENVIADO">Enviado</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date-desc' | 'date-asc')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date-desc">Más reciente</option>
            <option value="date-asc">Más antiguo</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No se encontraron pedidos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-xl font-bold text-gray-900 hover:text-blue-600"
                  >
                    {order.id}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      STATUS_COLORS[order.status].bg
                    } ${STATUS_COLORS[order.status].text}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Package className="w-5 h-5 text-gray-400" />
                <p className="text-gray-600">
                  {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                </p>
                <span className="text-gray-400">•</span>
                <p className="text-xl font-bold text-gray-900">
                  ${order.total.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <Link
                  to={`/orders/${order.id}`}
                  className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                >
                  Ver Detalles
                </Link>
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Volver a Pedir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
