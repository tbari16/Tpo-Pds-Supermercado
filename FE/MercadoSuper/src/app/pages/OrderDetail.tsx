import { useParams, Link } from 'react-router-dom';
import { useApp, type OrderStatus } from '../context/AppContext';
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle } from 'lucide-react';

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  PENDIENTE: { bg: 'bg-orange-100', text: 'text-orange-700' },
  CONFIRMADO: { bg: 'bg-blue-100', text: 'text-blue-700' },
  ENVIADO: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  ENTREGADO: { bg: 'bg-green-100', text: 'text-green-700' },
  CANCELADO: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const STATUS_ORDER: OrderStatus[] = ['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO'];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { orders, user } = useApp();

  const order = orders.find((o) => o.id === id && o.userId === user?.id);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido no encontrado</h1>
        <Link to="/orders" className="text-blue-600 hover:text-blue-700">
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'CANCELADO';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a mis pedidos
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

        {!isCancelled && (
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Estado del Pedido</h3>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${(currentStatusIndex / (STATUS_ORDER.length - 1)) * 100}%`,
                  }}
                />
              </div>
              <div className="relative flex justify-between">
                {STATUS_ORDER.map((status, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  return (
                    <div key={status} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                      <p
                        className={`text-xs mt-2 ${
                          isCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'
                        }`}
                      >
                        {status}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Productos</h3>
            </div>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
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
                      Cantidad: {item.quantity} × ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
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
                <p className="text-sm text-gray-500 mt-2">
                  Notas: {order.shippingAddress.notes}
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Información de Pago</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Método de Pago</span>
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
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
          Volver a Pedir
        </button>
        {(order.status === 'PENDIENTE' || order.status === 'CONFIRMADO') && (
          <button className="flex-1 px-6 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-50">
            Cancelar Pedido
          </button>
        )}
      </div>
    </div>
  );
}
