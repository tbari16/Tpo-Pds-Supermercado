import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp, type OrderStatus } from '../../context/AppContext';
import { ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  PENDIENTE: { bg: 'bg-orange-100', text: 'text-orange-700' },
  CONFIRMADO: { bg: 'bg-blue-100', text: 'text-blue-700' },
  ENVIADO: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  ENTREGADO: { bg: 'bg-green-100', text: 'text-green-700' },
  CANCELADO: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrderStatus } = useApp();
  const [newStatus, setNewStatus] = useState<OrderStatus>('PENDIENTE');

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido no encontrado</h1>
        <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700">
          Volver a pedidos
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = () => {
    if (newStatus === order.status) {
      toast.error('Selecciona un estado diferente');
      return;
    }
    if (confirm(`¿Cambiar el estado del pedido a ${newStatus}?`)) {
      updateOrderStatus(order.id, newStatus);
      toast.success('Estado actualizado correctamente');
    }
  };

  return (
    <div>
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a pedidos
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedido {order.id}</h1>
            <p className="text-gray-600">
              Realizado el{' '}
              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <span
            className={`px-6 py-3 rounded-full font-medium text-lg ${
              STATUS_COLORS[order.status].bg
            } ${STATUS_COLORS[order.status].text}`}
          >
            {order.status}
          </span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Actualizar Estado del Pedido</h3>
          <div className="flex gap-4">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="CONFIRMADO">CONFIRMADO</option>
              <option value="ENVIADO">ENVIADO</option>
              <option value="ENTREGADO">ENTREGADO</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
            <button
              onClick={handleUpdateStatus}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Actualizar Estado
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Información del Cliente</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900 mb-1">{order.userName}</p>
              <p className="text-sm text-gray-600">ID: {order.userId}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Información de Pago</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Método</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              {order.paymentReference && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Referencia</span>
                  <span className="font-medium text-gray-900">{order.paymentReference}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Dirección de Envío</h3>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.notes && (
              <p className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-200">
                Notas: {order.shippingAddress.notes}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Productos</h3>
          </div>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-20 h-20 rounded bg-white overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.product.name}</p>
                  <p className="text-sm text-gray-600">{item.product.categoryName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Cantidad: {item.quantity} × ${item.product.price.toFixed(2)} /{' '}
                    {item.product.unit}
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">Total del Pedido</span>
            <span className="text-2xl font-bold text-blue-600">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
