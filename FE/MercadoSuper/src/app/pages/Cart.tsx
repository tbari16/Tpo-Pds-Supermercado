import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxes = subtotal * 0.1;
  const total = subtotal + taxes;

  const handleRemoveFromCart = async (productId: string) => {
    try {
      setIsUpdating(true);
      await removeFromCart(productId);
      toast.success('Producto removido del carrito');
    } catch (error) {
      toast.error('Error al remover producto');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateCartQuantity = async (productId: string, quantity: number) => {
    try {
      setIsUpdating(true);
      await updateCartQuantity(productId, quantity);
    } catch (error) {
      toast.error('Error al actualizar cantidad');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      return;
    }
    try {
      setIsUpdating(true);
      await clearCart();
      toast.success('Carrito vaciado');
    } catch (error) {
      toast.error('Error al vaciar carrito');
    } finally {
      setIsUpdating(false);
    }
  };

  //const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  //const taxes = subtotal * 0.1;
  //const total = subtotal + taxes;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-[#EFF6FF] to-[#F0FDF4] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-[#2563EB]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Tu carrito está vacío</h2>
          <p className="text-[#64748B] mb-6">
            Agrega algunos productos para comenzar tu pedido
          </p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
          >
            Ir a Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[#1E293B] mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 hover:shadow-lg hover:border-[#2563EB] transition-all"
            >
              <div className="flex gap-4">
                <Link
                  to={`/products/${item.product.id}`}
                  className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0]"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link
                        to={`/products/${item.product.id}`}
                        className="font-bold text-[#1E293B] hover:text-[#2563EB] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-[#64748B]">{item.product.categoryName}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50"
                      disabled={isUpdating}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                        disabled={isUpdating}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          handleUpdateCartQuantity(
                            item.product.id,
                            Math.max(1, Math.min(item.product.stock, val))
                          );
                        }}
                        className="w-14 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        disabled={isUpdating}
                      />
                      <button
                        onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock || isUpdating}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        ${item.product.price.toFixed(2)} / {item.product.unit}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {item.quantity >= item.product.stock && (
                    <p className="text-xs text-orange-600 mt-2">
                      Cantidad máxima disponible
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleClearCart}
            disabled={isUpdating}
            className="w-full sm:w-auto px-6 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Vaciar Carrito
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sticky top-24 shadow-lg">
            <h2 className="text-xl font-bold text-[#1E293B] mb-4">Resumen del Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Impuestos (10%)</span>
                <span className="font-medium">${taxes.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-lg font-bold text-[#1E293B]">Total</span>
                <span className="text-2xl font-bold text-[#2563EB]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full block text-center bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium mb-3"
            >
              Proceder al Pago
            </Link>

            <Link
              to="/products"
              className="w-full block text-center text-[#2563EB] py-2 rounded-xl hover:bg-[#EFF6FF] transition-colors font-medium"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
