import { useApp } from '../../context/AppContext';
import { Package, ShoppingBag, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { orders, products } = useApp();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'PENDIENTE').length;
  const activeProducts = products.filter((p) => p.active).length;

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general de tu tienda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#2563EB]" />
            </div>
            <span className="text-[#22C55E] text-sm font-bold flex items-center gap-1 bg-[#F0FDF4] px-2 py-1 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-[#1E293B] mb-1">{totalOrders}</h3>
          <p className="text-[#64748B] text-sm font-medium">Total de Pedidos</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#22C55E]" />
            </div>
            <span className="text-[#22C55E] text-sm font-bold flex items-center gap-1 bg-[#F0FDF4] px-2 py-1 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              +8%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-[#1E293B] mb-1">
            ${totalRevenue.toFixed(2)}
          </h3>
          <p className="text-[#64748B] text-sm font-medium">Ingresos Totales</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-[#F97316]" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1E293B] mb-1">{pendingOrders}</h3>
          <p className="text-[#64748B] text-sm font-medium">Pedidos Pendientes</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FEFCE8] to-[#FEF9C3] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#FACC15]" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#1E293B] mb-1">{activeProducts}</h3>
          <p className="text-[#64748B] text-sm font-medium">Productos Activos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-lg">
          <h2 className="text-xl font-bold text-[#1E293B] mb-4">Pedidos por Estado</h2>
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = (count / totalOrders) * 100;
              const colors: Record<string, string> = {
                PENDIENTE: 'bg-orange-500',
                CONFIRMADO: 'bg-blue-500',
                ENVIADO: 'bg-cyan-500',
                ENTREGADO: 'bg-green-500',
                CANCELADO: 'bg-gray-500',
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                    <span className="text-sm text-gray-600">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${colors[status]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1E293B]">Pedidos Recientes</h2>
            <Link to="/admin/orders" className="text-[#2563EB] hover:text-[#1D4ED8] text-sm font-medium">
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay pedidos</p>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.userName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'PENDIENTE'
                          ? 'bg-orange-100 text-orange-700'
                          : order.status === 'CONFIRMADO'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'ENVIADO'
                          ? 'bg-cyan-100 text-cyan-700'
                          : order.status === 'ENTREGADO'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
