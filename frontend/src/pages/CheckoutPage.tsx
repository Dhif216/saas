import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/services/orderService';
import CartItemComponent from '@/components/CartItem';
import PaymentForm, { PaymentFormData } from '@/components/PaymentForm';
import { ArrowLeft, MapPin, Phone, AlertCircle } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    phone: user?.phone || '',
    paymentMethod: 'card' as 'card' | 'cash',
    specialInstructions: '',
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="container-max text-center">
          <h1 className="text-3xl font-bold text-dark mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some items to get started</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = async (paymentData: PaymentFormData) => {
    setLoading(true);
    try {
      // Simulate payment processing (in real app, would call Stripe API)
      console.log('Processing payment:', paymentData);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order after payment
      const orderData = {
        restaurantId: cart.restaurantId,
        items: cart.items,
        deliveryAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        phone: formData.phone,
        paymentMethod: 'card',
        specialInstructions: formData.specialInstructions,
        paymentInfo: {
          status: 'completed',
          transactionId: `txn_${Date.now()}`,
          email: paymentData.email,
        },
      };

      const order = await orderService.createOrder(orderData);
      clearCart();
      setOrderPlaced(true);
      setTimeout(() => navigate(`/orders/${order.id}`), 2000);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Validate form
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
        setError('Please fill in all address fields');
        return;
      }

      // If paying by card, show payment form
      if (formData.paymentMethod === 'card') {
        setShowPaymentForm(true);
        return;
      }

      // If paying by cash, create order directly
      setLoading(true);
      const orderData = {
        restaurantId: cart.restaurantId,
        items: cart.items,
        deliveryAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        phone: formData.phone,
        paymentMethod: 'cash',
        specialInstructions: formData.specialInstructions,
      };

      const order = await orderService.createOrder(orderData);
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totals = cart;

  if (showPaymentForm) {
    return (
      <div className="min-h-screen bg-light py-12">
        <div className="container-max">
          <button
            onClick={() => setShowPaymentForm(false)}
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft size={20} />
            Back to Order
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <PaymentForm
                amount={totals.total}
                onSubmit={handlePaymentSubmit}
                isLoading={loading}
              />
            </div>

            {/* Order Summary */}
            <div>
              <div className="card p-6 sticky top-20">
                <h2 className="text-xl font-bold text-dark mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                  {cart.items.map((item) => (
                    <CartItemComponent
                      key={item.menuItemId}
                      item={item}
                      onRemove={removeItem}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">${totals.deliveryFee.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-dark">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-dark mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your order has been placed. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-max">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          Continue Shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder}>
              {/* Delivery Address */}
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <MapPin size={24} />
                  Delivery Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2 flex items-center gap-2">
                      <Phone size={16} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold text-dark mb-4">Payment Method</h2>

                <div className="space-y-3">
                  {(['card', 'cash'] as const).map((method) => (
                    <label key={method} className="flex items-center p-3 border rounded-lg hover:bg-light cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <span className="font-medium text-dark">
                        {method === 'card' && '💳 Credit/Debit Card'}
                        {method === 'cash' && '💵 Cash on Delivery'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dark mb-4">Special Instructions</h2>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Add any special requests or dietary requirements..."
                  className="input-field resize-none"
                  rows={4}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-20">
              <h2 className="text-xl font-bold text-dark mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <CartItemComponent
                    key={item.menuItemId}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">${totals.deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-dark">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={(e) => handlePlaceOrder(e as any)}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
