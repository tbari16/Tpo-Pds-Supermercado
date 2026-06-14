import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, type Address, type PaymentMethod } from '../context/AppContext';
import { CheckCircle, CreditCard, Banknote, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const { cart, createOrder } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'México',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TARJETA');
  const [paymentReference, setPaymentReference] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxes = subtotal * 0.1;
  const total = subtotal + taxes;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.postalCode || !address.country) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder(address, paymentMethod, paymentReference || undefined);
      toast.success('Pedido realizado con éxito');
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast.error('Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-4">Finalizar Compra</h1>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${step >= 1 ? 'bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-lg' : 'bg-[#F1F5F9]'}`}>
              {step > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
            </div>
            <span className="font-semibold">Dirección de Envío</span>
          </div>
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-[#2563EB] to-[#22C55E]' : 'bg-[#E2E8F0]'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${step >= 2 ? 'bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-lg' : 'bg-[#F1F5F9]'}`}>
              2
            </div>
            <span className="font-semibold">Pago y Revisión</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-lg">
              <h2 className="text-xl font-bold text-[#1E293B] mb-6">Dirección de Envío</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calle y Número *
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Av. Principal 123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ciudad de México"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="CDMX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="06000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País *
                    </label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales (Opcional)
                  </label>
                  <textarea
                    value={address.notes}
                    onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Instrucciones de entrega..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/cart')}
                    className="px-6 py-2 border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] font-medium"
                  >
                    Volver al Carrito
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white py-2 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
                  >
                    Continuar al Pago
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-lg">
                <h2 className="text-xl font-bold text-[#1E293B] mb-6">Método de Pago</h2>
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-[#F8FAFC] transition-all border-[#E2E8F0] has-[:checked]:border-[#2563EB] has-[:checked]:bg-[#EFF6FF]">
                      <input
                        type="radio"
                        name="payment"
                        value="TARJETA"
                        checked={paymentMethod === 'TARJETA'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4 text-[#2563EB]"
                      />
                      <CreditCard className="w-6 h-6 text-[#2563EB]" />
                      <div className="flex-1">
                        <p className="font-semibold text-[#1E293B]">Tarjeta de Crédito/Débito</p>
                        <p className="text-sm text-[#64748B]">Pago seguro con tarjeta</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="TRANSFERENCIA"
                        checked={paymentMethod === 'TRANSFERENCIA'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <Banknote className="w-6 h-6 text-gray-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Transferencia Bancaria</p>
                        <p className="text-sm text-gray-500">Transferencia o depósito bancario</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="EFECTIVO"
                        checked={paymentMethod === 'EFECTIVO'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <Wallet className="w-6 h-6 text-gray-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Efectivo</p>
                        <p className="text-sm text-gray-500">Pago al recibir</p>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'TRANSFERENCIA' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Referencia de Pago
                      </label>
                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Número de referencia"
                      />
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? 'Procesando...' : 'Realizar Pedido'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Dirección de Envío</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p>{address.country}</p>
                  {address.notes && <p className="pt-2 text-gray-500">Notas: {address.notes}</p>}
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Editar dirección
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sticky top-24 shadow-lg">
            <h2 className="text-xl font-bold text-[#1E293B] mb-4">Resumen del Pedido</h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Impuestos</span>
                <span className="font-medium">${taxes.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="font-bold text-[#1E293B]">Total</span>
                <span className="text-2xl font-bold text-[#2563EB]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
