import React, { useState, useEffect, useRef } from 'react';
import { Bell, Volume2, Pause, Play, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { notificationService } from '@/services/notificationService';
import type { Order } from '@/types';

const OrderAlertDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [dismissedOrders, setDismissedOrders] = useState<Set<string>>(new Set());
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckedRef = useRef<Date>(new Date());

  // Request notification permission on mount
  useEffect(() => {
    const requestPermissions = async () => {
      await notificationService.requestPermission();
      // Keep screen awake
      await notificationService.keepScreenAwake();
    };
    requestPermissions();
  }, []);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const restaurantId = (user as any)?.restaurant_id || (user as any)?.restaurantId;
      if (!restaurantId) {
        navigate('/login');
        return;
      }

      const data = await orderService.getOrdersByRestaurant(restaurantId);
      const ordersArray = Array.isArray(data) ? data : (Array.isArray((data as any)?.data) ? (data as any).data : []);
      
      // Find new orders (placed after last check)
      const newOrdersDetected = ordersArray.filter((order: Order) => {
        const orderTime = new Date(order.createdAt || '');
        return orderTime > lastCheckedRef.current && order.status === 'pending';
      });

      // Play sound and show notification for new orders
      if (newOrdersDetected.length > 0) {
        newOrdersDetected.forEach((order: Order) => {
          if (soundEnabled) {
            notificationService.playSound('order');
          }
          
          const items = (order as any).items;
          notificationService.sendNotification(`🚨 New Order #${order.id?.slice(0, 8)}`, {
            body: `${items?.length || 0} items - ${(order as any).customer_name || 'Customer'}`,
            tag: `order-${order.id}`,
          });
        });

        // Add to new orders queue
        setNewOrders(prev => [...newOrdersDetected, ...prev].slice(0, 10));
      }

      setOrders(ordersArray);
      lastCheckedRef.current = new Date();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // Start polling for new orders
  useEffect(() => {
    if (!isMonitoring) return;

    fetchOrders();

    pollingIntervalRef.current = setInterval(() => {
      if (isMonitoring) {
        fetchOrders();
      }
    }, 3000); // Check every 3 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isMonitoring, soundEnabled, user]);

  const handleDismissOrder = (orderId: string) => {
    setNewOrders(prev => prev.filter(o => o.id !== orderId));
    setDismissedOrders(prev => new Set([...prev, orderId]));
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      // Update order status
      // await orderService.updateOrder(orderId, { status: 'completed' });
      handleDismissOrder(orderId);
      if (soundEnabled) {
        notificationService.playSound('completed');
      }
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 animate-bounce" />
            <div>
              <h1 className="text-3xl font-bold">Order Alert Dashboard</h1>
              <p className="text-red-100 text-sm">Real-time order monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-full transition ${
                soundEnabled
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
              title={soundEnabled ? 'Sound On' : 'Sound Off'}
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* Monitoring Toggle */}
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`p-3 rounded-full transition ${
                isMonitoring
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              title={isMonitoring ? 'Monitoring On' : 'Monitoring Off'}
            >
              {isMonitoring ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>

            {/* Status */}
            <div className="text-sm">
              <div className="font-semibold">
                {isMonitoring ? '🟢 MONITORING' : '🔴 PAUSED'}
              </div>
              <div className="text-red-100">Sound {soundEnabled ? 'ON' : 'OFF'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* New Orders Alert Section */}
      {newOrders.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newOrders.map((order) =>
              !dismissedOrders.has(order.id) ? (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-xl border-4 border-red-500 p-5 animate-pulse hover:animate-none"
                >
                  {/* Alert Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-red-600 animate-bounce" />
                      <span className="text-sm font-bold text-red-600">NEW ORDER</span>
                    </div>
                    <button
                      onClick={() => handleDismissOrder(order.id)}
                      className="p-1 hover:bg-gray-200 rounded text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">ORDER ID</p>
                      <p className="text-lg font-bold text-gray-900">#{order.id?.slice(0, 8)}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">CUSTOMER</p>
                      <p className="text-base font-semibold text-gray-900">
                        {(order as any).customer_name || 'Guest'}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500 mb-2">ITEMS ({(order as any).items?.length || 0})</p>
                      <div className="space-y-1">
                        {(order as any).items?.slice(0, 3).map((item: any, idx: number) => (
                          <p key={idx} className="text-sm text-gray-700">
                            • {item.name} x{item.quantity}
                          </p>
                        ))}
                        {(order as any).items && (order as any).items.length > 3 && (
                          <p className="text-sm text-gray-500 italic">
                            +{(order as any).items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
                      <span className="text-xs text-gray-600">TOTAL</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${(order as any).total_amount?.toFixed(2) || '0.00'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded flex items-center justify-center gap-2 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleDismissOrder(order.id)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded flex items-center justify-center gap-2 transition"
                      >
                        <X className="w-4 h-4" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">All Orders</h2>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No orders yet</p>
            <p className="text-gray-500">New orders will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-lg shadow p-5 border-l-4 ${
                  String(order.status) === 'completed' || String(order.status) === 'accepted'
                    ? 'border-green-500'
                    : String(order.status) === 'pending'
                      ? 'border-yellow-500'
                      : 'border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">#{order.id?.slice(0, 8)}</h3>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      String(order.status) === 'completed' || String(order.status) === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : String(order.status) === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {String(order.status).toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">{(order as any).customer_name}</p>
                <p className="text-lg font-semibold text-gray-900 mb-3">
                  ${(order as any).total_amount?.toFixed(2) || '0.00'}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {new Date(order.createdAt || '').toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <p className="font-semibold mb-2">💡 Keep this page open on a restaurant display</p>
          <p>The app will automatically alert you with sound and notifications for every new order.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderAlertDashboard;
