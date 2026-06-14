import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp, type OrderStatus } from '../../context/AppContext';
import { Search, Package } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  PENDIENTE: { bg: 'bg-orange-100', text: 'text-orange-700' },
  CONFIRMADO: { bg: 'bg-blue-100', text: 'text-blue-700' },
  ENVIADO: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  ENTREGADO: { bg: 'bg-green-100', text: 'text-green-700' },
  CANCELADO: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'total-desc' | 'total-asc'>('date-desc');

  const filteredOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || order.status === statusFilter;
      const matchesPayment = !paymentFilter || order.paymentMethod === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'date-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'total-desc') {
        return b.total - a.total;
      } else {
        return a.total - b.total;
      }
    });

    return filtered;
  }, [orders, searchQuery, statusFilter, paymentFilter, sortBy]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (confirm(`¿Cambiar el estado del pedido a ${newStatus}?`)) {
      updateOrderStatus(orderId, newStatus);
      toast.success('Estado actualizado');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600">Gestiona todos los pedidos de la tienda</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por # o cliente..."
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
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los métodos</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="EFECTIVO">Efectivo</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date-desc">Más reciente</option>
            <option value="date-asc">Más antiguo</option>
            <option value="total-desc">Mayor monto</option>
            <option value="total-asc">Menor monto</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900"># Pedido</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Pago</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.userName}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Package className="w-3 h-3" />
                        <span>{order.items.length} productos</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{order.paymentMethod}</span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                        STATUS_COLORS[order.status].bg
                      } ${STATUS_COLORS[order.status].text}`}
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="CONFIRMADO">CONFIRMADO</option>
                      <option value="ENVIADO">ENVIADO</option>
                      <option value="ENTREGADO">ENTREGADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded text-sm"
                    >
                      Ver Detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">No se encontraron pedidos</div>
          )}
        </div>
      </div>
    </div>
  );
}
