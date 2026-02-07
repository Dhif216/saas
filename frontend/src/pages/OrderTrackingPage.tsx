import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, MapPin, Package, CheckCircle, X } from 'lucide-react';
import { orderService } from '@/services/orderService';
import type { Order, OrderStatus } from '@/types';

const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Order not found</p>
      </div>
    );
  }

  const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return '📋';
      case 'confirmed':
        return '✓';
      case 'preparing':
        return '👨‍🍳';
      case 'ready':
        return '✓';
      case 'out_for_delivery':
        return '🚗';
      case 'delivered':
        return '✓';
      case 'cancelled':
        return '✗';
      default:
        return '?';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-max max-w-2xl">
        {/* Order Header */}
        <div className="card p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark mb-2">Order Tracking</h1>
              <p className="text-gray-600">Order #{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            {order.status === 'delivered' && (
              <div className="text-5xl">🎉</div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="relative">
            <div className="flex justify-between mb-8">
              {statusSteps.map((step, index) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  {/* Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-2 transition-all ${
                      index <= currentStepIndex
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {getStatusIcon(step)}
                  </div>

                  {/* Label */}
                  <span className="text-xs text-center font-medium text-gray-600 line-clamp-2">
                    {step.replace(/_/g, ' ')}
                  </span>

                  {/* Line */}
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`absolute top-6 w-full h-1 ${
                        index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                      }`}
                      style={{
                        left: `calc(50% + 24px)`,
                        right: 'calc(-50%)',
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-light p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Current Status</p>
            <p className="text-xl font-bold text-primary">
              {getStatusLabel(order.status)}
            </p>
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <p className="text-sm text-gray-600 mt-2">
                Estimated delivery in {order.estimatedDeliveryTime} minutes
              </p>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Items */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-dark mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start pb-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-dark">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Delivery Address
            </h2>
            <div className="text-gray-600 space-y-2">
              <p>{order.deliveryAddress.street}</p>
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
                {order.deliveryAddress.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-6 mt-8">
          <h2 className="text-xl font-bold text-dark mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="font-bold text-dark">Total</span>
            <span className="text-2xl font-bold text-primary">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Status */}
        <div className="card p-6 mt-8 bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-3">
            {order.paymentStatus === 'completed' ? (
              <CheckCircle size={24} className="text-green-600" />
            ) : (
              <Clock size={24} className="text-yellow-600" />
            )}
            <div>
              <p className="font-semibold text-dark">
                Payment {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </p>
              <p className="text-sm text-gray-600">
                {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
