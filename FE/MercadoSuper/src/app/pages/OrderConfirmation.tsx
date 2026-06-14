import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, Package, MapPin } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useApp();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido no encontrado</h1>
        <Link to="/orders" className="text-blue-600 hover:text-blue-700">
          Ver mis pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pedido Realizado!</h1>
        <p className="text-gray-600">Tu pedido ha sido recibido y está siendo procesado</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500 mb-1">Número de Pedido</p>
            <p className="text-2xl font-bold text-gray-900">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Fecha</p>
            <p className="font-medium text-gray-900">
              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Productos</h3>
            </div>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Cantidad: {item.quantity} × ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Dirección de Envío</h3>
            </div>
            <div className="text-gray-600">
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
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-600">
                <span>Método de Pago</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              {order.paymentReference && (
                <div className="flex items-center justify-between text-gray-600">
                  <span>Referencia</span>
                  <span className="font-medium">{order.paymentReference}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-xl">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-blue-600">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to={`/orders/${order.id}`}
          className="flex-1 text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Ver Detalles del Pedido
        </Link>
        <Link
          to="/products"
          className="flex-1 text-center border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
        >
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
}
