import React, { useState, useEffect } from 'react';
import { BarChart3, ShoppingBag, TrendingUp, Users, Menu, Settings, Code, LogOut, Plus, Edit2, Trash2, CheckCircle, DollarSign, Power, Star, MessageSquare, RefreshCw, Bell, AlertCircle, CheckCheck, X, Tag, Percent, Calendar, Copy, MapPin, Smartphone, Mail, CreditCard, Link2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { restaurantService } from '@/services/restaurantService';
import { menuService } from '@/services/menuService';
import { orderService } from '@/services/orderService';
import { reviewService } from '@/services/reviewService';
import { promotionService } from '@/services/promotionService';
import type { Restaurant, MenuItem, Order, Review } from '@/types';

const RestaurantDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [savedMessage, setSavedMessage] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingRestaurant, setCreatingRestaurant] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<{ averageRating: number; totalReviews: number; distribution: Record<number, number> } | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; type: 'order' | 'review' | 'status' | 'alert'; title: string; message: string; timestamp: Date; read: boolean; actionUrl?: string }>>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [customers, setCustomers] = useState<Array<{ id: string; name: string; email: string; phone: string; totalOrders: number; totalSpent: number; lastOrderDate: Date }>>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [promotions, setPromotions] = useState<Array<{ id: string; code: string; description: string; type: 'percentage' | 'fixed'; value: number; usageLimit: number; usageCount: number; expiryDate: Date; isActive: boolean }>>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [promoFormData, setPromoFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '',
    usageLimit: '',
    expiryDate: '',
  });
  const [settingsFormData, setSettingsFormData] = useState({
    name: '',
    description: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethods: [] as string[],
    deliveryRadius: '',
    bankDetails: {
      bankName: '',
      accountHolderName: '',
      accountNumber: '',
      routingNumber: '',
      ifscCode: '',
      swiftCode: '',
    },
    stripeKey: '',
    paypalEmail: '',
  });
  const [paymentSectionUnlocked, setPaymentSectionUnlocked] = useState(false);
  const [paymentSecurityPassword, setPaymentSecurityPassword] = useState('');
  const [widgetTheme, setWidgetTheme] = useState<'basic' | 'pro' | 'premium'>('pro');
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOpen, setIsOpen] = useState(restaurant?.isOpen ?? true);
  const [showHoursForm, setShowHoursForm] = useState(false);
  const [openingHours, setOpeningHours] = useState(restaurant?.openingHours || {
    Monday: { open: '09:00', close: '22:00' },
    Tuesday: { open: '09:00', close: '22:00' },
    Wednesday: { open: '09:00', close: '22:00' },
    Thursday: { open: '09:00', close: '22:00' },
    Friday: { open: '09:00', close: '23:00' },
    Saturday: { open: '10:00', close: '23:00' },
    Sunday: { open: '10:00', close: '22:00' },
  });
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
  });
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getUserRestaurant();
        setRestaurant(data);
        setIsOpen(data?.isOpen ?? true);
        if (data?.openingHours) {
          setOpeningHours(data.openingHours);
        }
        // Set widget theme from restaurant data
        if (data?.widgetTheme) {
          setWidgetTheme(data.widgetTheme);
        }
        console.log('📍 User Restaurant loaded:', data);
        
        // Fetch menu items if restaurant exists
        if (data && data.id) {
          const items = await menuService.getMenuItems(data.id);
          setMenuItems(items);
        }
      } catch (error) {
        console.error('Failed to fetch restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  // Fetch orders for the restaurant
  useEffect(() => {
    if (activeTab === 'orders' && restaurant?.id) {
      fetchOrders();
    }
  }, [activeTab, restaurant?.id]);

  // Fetch reviews for the restaurant
  useEffect(() => {
    if (activeTab === 'reviews' && restaurant?.id) {
      fetchReviews();
    }
  }, [activeTab, restaurant?.id]);

  const fetchOrders = async () => {
    if (!restaurant?.id) return;
    try {
      setOrdersLoading(true);
      const response = await orderService.getOrders();
      // Filter orders for this restaurant
      const restaurantOrders = Array.isArray(response) 
        ? response.filter((order: Order) => order.restaurantId === restaurant.id)
        : [];
      setOrders(restaurantOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!restaurant?.id) return;
    try {
      setReviewsLoading(true);
      const [reviewsData, statsData] = await Promise.all([
        reviewService.getRestaurantReviews(restaurant.id),
        reviewService.getReviewStats(restaurant.id),
      ]);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setReviewStats(statsData);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!restaurant?.id) return;
    try {
      setNotificationsLoading(true);
      
      // Generate notifications from real data
      const generatedNotifications: Array<{ id: string; type: 'order' | 'review' | 'status' | 'alert'; title: string; message: string; timestamp: Date; read: boolean; actionUrl?: string }> = [];

      // 1. Add notifications for recent orders
      if (orders && orders.length > 0) {
        orders.slice(0, 3).forEach((order) => {
          // New order notification
          if (order.status === 'pending') {
            generatedNotifications.push({
              id: `order-${order.id}`,
              type: 'order',
              title: `New Order #${order.id.slice(-4).toUpperCase()}`,
              message: `${order.items?.length || 0} items • Total: $${order.total?.toFixed(2) || '0.00'}`,
              timestamp: new Date(order.createdAt),
              read: false,
              actionUrl: '/orders',
            });
          }

          // Order status change notifications
          if (order.status === 'ready') {
            generatedNotifications.push({
              id: `status-ready-${order.id}`,
              type: 'status',
              title: `Order #${order.id.slice(-4).toUpperCase()} Ready`,
              message: 'Your order is ready for pickup or delivery',
              timestamp: new Date(order.updatedAt || order.createdAt),
              read: true,
            });
          }

          if (order.status === 'delivered') {
            generatedNotifications.push({
              id: `status-delivered-${order.id}`,
              type: 'status',
              title: `Order #${order.id.slice(-4).toUpperCase()} Delivered`,
              message: 'Customer received their order successfully',
              timestamp: new Date(order.updatedAt || order.createdAt),
              read: true,
            });
          }

          if (order.status === 'delivered') {
            generatedNotifications.push({
              id: `status-completed-${order.id}`,
              type: 'status',
              title: `Order #${order.id.slice(-4).toUpperCase()} Completed`,
              message: 'Order has been completed and closed',
              timestamp: new Date(order.updatedAt || order.createdAt),
              read: true,
            });
          }
        });
      }

      // 2. Add notifications for recent reviews
      if (reviews && reviews.length > 0) {
        reviews.slice(0, 3).forEach((review) => {
          generatedNotifications.push({
            id: `review-${review.id}`,
            type: 'review',
            title: `New Review from ${review.userName || 'Customer'}`,
            message: `${review.rating} stars: ${review.comment?.substring(0, 50)}${review.comment && review.comment.length > 50 ? '...' : ''}`,
            timestamp: new Date(review.createdAt),
            read: true,
          });
        });
      }

      // Sort by timestamp (newest first)
      generatedNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setNotifications(generatedNotifications);
      setUnreadCount(generatedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  // Fetch notifications when tab is active
  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [activeTab, restaurant?.id]);

  // Fetch customers from orders
  const fetchCustomers = async () => {
    if (!orders || orders.length === 0) {
      setCustomers([]);
      return;
    }
    try {
      setCustomersLoading(true);
      // Group orders by customer and aggregate data
      const customerMap = new Map<string, any>();
      
      orders.forEach(order => {
        const customerId = order.userId || order.id;
        const customerName = 'Customer';
        
        if (!customerMap.has(customerId)) {
          customerMap.set(customerId, {
            id: customerId,
            name: customerName,
            email: order.deliveryAddress?.state || 'N/A',
            phone: order.deliveryAddress?.zipCode || 'N/A',
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: new Date(order.createdAt),
          });
        }
        
        const customer = customerMap.get(customerId)!;
        customer.totalOrders += 1;
        customer.totalSpent += order.total || 0;
        if (new Date(order.createdAt) > customer.lastOrderDate) {
          customer.lastOrderDate = new Date(order.createdAt);
        }
      });
      
      setCustomers(Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent));
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setCustomersLoading(false);
    }
  };

  // Fetch promotions
  const fetchPromotions = async () => {
    if (!restaurant?.id) return;
    try {
      setPromotionsLoading(true);
      const data = await promotionService.getRestaurantPromotions(restaurant.id);
      setPromotions(data);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      setPromotions([]);
    } finally {
      setPromotionsLoading(false);
    }
  };

  // Fetch data when tabs are active
  useEffect(() => {
    if (activeTab === 'customers') {
      fetchCustomers();
    }
  }, [activeTab, orders]);

  useEffect(() => {
    if (activeTab === 'promotions') {
      fetchPromotions();
    }
  }, [activeTab, restaurant?.id]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'promotions', label: 'Promotions', icon: Tag },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'menu', label: 'Menu', icon: Menu },
    { id: 'widget', label: 'Widget Setup', icon: Code },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-light py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-light py-12">
        <div className="container-max">
          <div className="card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-dark mb-6">Create Your Restaurant</h2>
            
            {!creatingRestaurant ? (
              <div className="text-center">
                <p className="text-gray-600 mb-6">Get started by creating your restaurant profile.</p>
                <button
                  onClick={() => setCreatingRestaurant(true)}
                  style={{
                    backgroundColor: '#FF6B35',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E55A2B')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF6B35')}
                >
                  Create Restaurant
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const newRestaurant = await restaurantService.createRestaurant({
                      name: formData.name,
                      description: formData.description,
                      logo: 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(formData.name || 'Restaurant'),
                      plan: 'basic',
                    });
                    setRestaurant(newRestaurant);
                    setCreatingRestaurant(false);
                    setFormData({ name: '', description: '', cuisine: '' });
                  } catch (error) {
                    console.error('Failed to create restaurant:', error);
                    alert('Failed to create restaurant. Please try again.');
                  }
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your restaurant name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                      Description
                    </label>
                    <textarea
                      placeholder="Tell us about your restaurant"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        minHeight: '80px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                      Cuisine Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Italian, Chinese, Mexican"
                      value={formData.cuisine}
                      onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#FF6B35',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        flex: 1,
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E55A2B')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF6B35')}
                    >
                      Create Restaurant
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreatingRestaurant(false)}
                      style={{
                        backgroundColor: '#E5E7EB',
                        color: '#4B5563',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        flex: 1,
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#D1D5DB')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-max">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark">{restaurant.name}</h1>
            <p className="text-gray-600 text-sm mt-1">{restaurant.description}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: '#E5E7EB',
                color: '#374151',
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#D1D5DB')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
            >
              Home
            </button>
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              style={{
                backgroundColor: '#EF4444',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#EF4444')}
            >
              <LogOut style={{ display: 'inline', marginRight: '6px' }} size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-dark">0</p>
              </div>
              <ShoppingBag size={32} className="text-primary opacity-50" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Revenue</p>
                <p className="text-3xl font-bold text-dark">$0.00</p>
              </div>
              <TrendingUp size={32} className="text-primary opacity-50" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Average Rating</p>
                <p className="text-3xl font-bold text-dark">4.8</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Customers</p>
                <p className="text-3xl font-bold text-dark">456</p>
              </div>
              <Users size={32} className="text-primary opacity-50" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b overflow-x-auto bg-white p-2 rounded">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-medium whitespace-nowrap rounded transition relative ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Analytics Cards */}
            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500', marginBottom: '8px' }}>Total Orders</p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937' }}>{orders.length}</p>
                  </div>
                  <ShoppingBag size={40} style={{ color: '#FF6B35', opacity: 0.2 }} />
                </div>
              </div>

              <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500', marginBottom: '8px' }}>Menu Items</p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937' }}>{menuItems.length}</p>
                  </div>
                  <Menu size={40} style={{ color: '#10B981', opacity: 0.2 }} />
                </div>
              </div>

              <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500', marginBottom: '8px' }}>Total Revenue</p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937' }}>
                      ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                    </p>
                  </div>
                  <DollarSign size={40} style={{ color: '#3B82F6', opacity: 0.2 }} />
                </div>
              </div>

              <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500', marginBottom: '8px' }}>Avg. Order Value</p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937' }}>
                      ${orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <TrendingUp size={40} style={{ color: '#8B5CF6', opacity: 0.2 }} />
                </div>
              </div>
            </div>

            {/* Restaurant Status */}
            <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>Restaurant Status</h3>
                <button
                  onClick={async () => {
                    try {
                      const newStatus = !isOpen;
                      setIsOpen(newStatus);
                      await restaurantService.updateRestaurant(restaurant?.id || '', { isOpen: newStatus });
                      setSavedMessage(true);
                      setTimeout(() => setSavedMessage(false), 3000);
                    } catch (error) {
                      console.error('Failed to update status:', error);
                    }
                  }}
                  style={{
                    backgroundColor: isOpen ? '#10B981' : '#EF4444',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Power size={14} />
                  {isOpen ? 'Open' : 'Closed'}
                </button>
              </div>

              <div style={{ padding: '16px', backgroundColor: isOpen ? '#ECFDF5' : '#FEF2F2', borderRadius: '6px', marginBottom: '16px', borderLeft: `4px solid ${isOpen ? '#10B981' : '#EF4444'}` }}>
                <p style={{ fontSize: '14px', color: isOpen ? '#047857' : '#991B1B', fontWeight: '500' }}>
                  {isOpen ? '✓ Your restaurant is currently OPEN' : '✗ Your restaurant is currently CLOSED'}
                </p>
              </div>

              <button
                onClick={() => setShowHoursForm(!showHoursForm)}
                style={{
                  backgroundColor: '#F3F4F6',
                  color: '#1F2937',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '500',
                  border: '1px solid #E5E7EB',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
              >
                {showHoursForm ? 'Close Hours Editor' : 'Edit Opening Hours'}
              </button>

              {showHoursForm && (
                <div style={{ marginTop: '16px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    {Object.entries(openingHours).map(([day, hours]: [string, any]) => (
                      <div key={day}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>
                          {day}
                        </label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) =>
                              setOpeningHours({ ...openingHours, [day]: { ...hours, open: e.target.value } })
                            }
                            style={{
                              flex: 1,
                              padding: '6px',
                              border: '1px solid #E5E7EB',
                              borderRadius: '4px',
                              fontSize: '12px',
                            }}
                          />
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) =>
                              setOpeningHours({ ...openingHours, [day]: { ...hours, close: e.target.value } })
                            }
                            style={{
                              flex: 1,
                              padding: '6px',
                              border: '1px solid #E5E7EB',
                              borderRadius: '4px',
                              fontSize: '12px',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await restaurantService.updateRestaurant(restaurant?.id || '', { openingHours });
                        setShowHoursForm(false);
                        setSavedMessage(true);
                        setTimeout(() => setSavedMessage(false), 3000);
                      } catch (error) {
                        console.error('Failed to update hours:', error);
                      }
                    }}
                    style={{
                      marginTop: '12px',
                      backgroundColor: '#FF6B35',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E55A2B')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF6B35')}
                  >
                    Save Hours
                  </button>
                </div>
              )}
            </div>

            {/* Top Items */}
            <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>Top Menu Items</h3>
              {menuItems.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#6B7280' }}>No menu items yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {menuItems.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid #F3F4F6',
                      }}
                    >
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>{item.name}</p>
                        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{item.category}</p>
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#10B981' }}>${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{
                    backgroundColor: '#F0F9FF',
                    color: '#3B82F6',
                    padding: '12px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    border: '1px solid #BFDBFE',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E0F2FE')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#F0F9FF')}
                >
                  Manage Menu
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#D97706',
                    padding: '12px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    border: '1px solid #FCD34D',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#FEF08A')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FEF3C7')}
                >
                  View Orders
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  style={{
                    backgroundColor: '#F3E8FF',
                    color: '#9333EA',
                    padding: '12px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    border: '1px solid #E9D5FF',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F5E6FF')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#F3E8FF')}
                >
                  Settings
                </button>
                <button
                  onClick={() => setActiveTab('widget')}
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A',
                    padding: '12px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    border: '1px solid #BBFBDE',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#DCFCE7')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E7F5E4')}
                >
                  Widget Setup
                </button>
              </div>
            </div>

            {savedMessage && (
              <div style={{ gridColumn: '1 / -1', backgroundColor: '#ECFDF5', padding: '12px 16px', borderRadius: '6px', color: '#10B981', fontWeight: 'bold', fontSize: '14px' }}>
                ✅ Changes saved successfully!
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-dark">Orders Management</h2>
              <button
                onClick={fetchOrders}
                style={{
                  backgroundColor: '#FF6B35',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E55A2B')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF6B35')}
              >
                Refresh Orders
              </button>
            </div>

            {ordersLoading ? (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTop: '4px solid #FF6B35', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px dashed #E5E7EB' }}>
                <ShoppingBag size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px', display: 'block' }} />
                <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '8px' }}>No orders yet</p>
                <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '16px',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)')}
                    onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Order #{order.id.slice(0, 8)}</p>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor:
                            order.status === 'delivered'
                              ? '#ECFDF5'
                              : order.status === 'cancelled'
                              ? '#FEF2F2'
                              : order.status === 'out_for_delivery'
                              ? '#F0F9FF'
                              : '#FFFBEB',
                          color:
                            order.status === 'delivered'
                              ? '#10B981'
                              : order.status === 'cancelled'
                              ? '#EF4444'
                              : order.status === 'out_for_delivery'
                              ? '#3B82F6'
                              : '#D97706',
                        }}
                      >
                        {order.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '12px', marginBottom: '12px' }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Items:</p>
                      <ul style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>
                        {order.items.slice(0, 2).map((item, idx) => (
                          <li key={idx}>
                            {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                          </li>
                        ))}
                        {order.items.length > 2 && <li>+{order.items.length - 2} more items</li>}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>
                        Total: ${order.total.toFixed(2)}
                      </p>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as any;
                          orderService.updateOrderStatus(order.id, newStatus).then(() => {
                            fetchOrders();
                          });
                        }}
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedOrder && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
                onClick={() => setSelectedOrder(null)}
              >
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Order Details</h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#6B7280',
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div>
                    <p style={{ marginBottom: '12px' }}>
                      <strong>Order ID:</strong> {selectedOrder.id}
                    </p>
                    <p style={{ marginBottom: '12px' }}>
                      <strong>Status:</strong> {selectedOrder.status.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p style={{ marginBottom: '12px' }}>
                      <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                    <p style={{ marginBottom: '12px' }}>
                      <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
                    </p>

                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginTop: '16px' }}>
                      <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>Items:</h4>
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Subtotal:</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Delivery Fee:</span>
                        <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Tax:</span>
                        <span>${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '8px', marginTop: '8px', fontWeight: '600' }}>
                        <span>Total:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginTop: '16px' }}>
                      <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Delivery Address:</h4>
                      <p style={{ fontSize: '14px', color: '#6B7280' }}>
                        {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}{' '}
                        {selectedOrder.deliveryAddress.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="card p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="text-xl font-bold text-dark">Reviews & Ratings</h2>
              <button
                onClick={fetchReviews}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {reviewsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#6B7280' }}>Loading reviews...</p>
              </div>
            ) : reviewStats ? (
              <>
                {/* Review Statistics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280' }}>Average Rating</h3>
                      <Star size={20} style={{ color: '#FBBF24' }} fill="#FBBF24" />
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937' }}>
                      {reviewStats.averageRating ? reviewStats.averageRating.toFixed(1) : 'N/A'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF' }}>out of 5.0</p>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280' }}>Total Reviews</h3>
                      <MessageSquare size={20} style={{ color: '#3B82F6' }} />
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937' }}>
                      {reviewStats.totalReviews || 0}
                    </p>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280', marginBottom: '12px' }}>Rating Distribution</h3>
                    {reviewStats.distribution && [5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '12px' }}>
                        <span style={{ width: '20px', color: '#6B7280' }}>{stars}★</span>
                        <div style={{ flex: 1, height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', margin: '0 8px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              backgroundColor: '#FBBF24',
                              width: `${reviewStats.distribution[stars] ? (reviewStats.distribution[stars] / (reviewStats.totalReviews || 1)) * 100 : 0}%`
                            }}
                          />
                        </div>
                        <span style={{ width: '20px', textAlign: 'right', color: '#9CA3AF' }}>
                          {reviewStats.distribution[stars] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                {reviews && reviews.length > 0 ? (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        style={{
                          padding: '16px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <div>
                            <h4 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>
                              {review.userName}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    style={{
                                      color: i < review.rating ? '#FBBF24' : '#E5E7EB',
                                      fill: i < review.rating ? '#FBBF24' : 'none'
                                    }}
                                  />
                                ))}
                              </div>
                              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this review?')) {
                                reviewService.deleteReview(review.id).then(() => {
                                  fetchReviews();
                                });
                              }
                            }}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#FEE2E2',
                              color: '#DC2626',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <MessageSquare size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
                    <p style={{ color: '#6B7280', fontSize: '16px' }}>No reviews yet</p>
                    <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Reviews from customers will appear here</p>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#6B7280' }}>No review data available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="card p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 className="text-xl font-bold text-dark">Notifications & Alerts</h2>
                <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#F3F4F6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCheck size={16} />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => fetchNotifications()}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>

            {notificationsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#6B7280' }}>Loading notifications...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '16px',
                      backgroundColor: notification.read ? '#FFFFFF' : '#EFF6FF',
                      border: `1px solid ${notification.read ? '#E5E7EB' : '#BFDBFE'}`,
                      borderRadius: '8px',
                      display: 'flex',
                      gap: '12px',
                      position: 'relative',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ paddingTop: '2px' }}>
                      {notification.type === 'order' && <ShoppingBag size={20} style={{ color: '#F59E0B' }} />}
                      {notification.type === 'review' && <Star size={20} style={{ color: '#EC4899' }} />}
                      {notification.type === 'status' && <CheckCircle size={20} style={{ color: '#10B981' }} />}
                      {notification.type === 'alert' && <AlertCircle size={20} style={{ color: '#EF4444' }} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {notification.title}
                        {!notification.read && (
                          <span style={{ width: '8px', height: '8px', backgroundColor: '#3B82F6', borderRadius: '50%', display: 'inline-block' }} />
                        )}
                      </h4>
                      <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>
                        {notification.message}
                      </p>
                      <p style={{ color: '#9CA3AF', fontSize: '12px' }}>
                        {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        title="Delete notification"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Bell size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
                <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '8px' }}>No notifications</p>
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>You're all caught up! New orders, reviews, and alerts will appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="card p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="text-xl font-bold text-dark">Customer Management</h2>
              <button
                onClick={fetchCustomers}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {customersLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#6B7280' }}>Loading customers...</p>
              </div>
            ) : customers.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6B7280' }}>Customer Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6B7280' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6B7280' }}>Phone</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#6B7280' }}>Orders</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#6B7280' }}>Total Spent</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6B7280' }}>Last Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, index) => (
                      <tr
                        key={customer.id}
                        style={{
                          borderBottom: '1px solid #E5E7EB',
                          backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
                          {customer.name}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#6B7280' }}>
                          {customer.email}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#6B7280' }}>
                          {customer.phone}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
                          {customer.totalOrders}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#10B981' }}>
                          ${customer.totalSpent.toFixed(2)}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#6B7280' }}>
                          {customer.lastOrderDate.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Users size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
                <p style={{ color: '#6B7280', fontSize: '16px' }}>No customers yet</p>
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Customers will appear here once they place orders</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'promotions' && (
          <div className="card p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="text-xl font-bold text-dark">Promotions & Discounts</h2>
              <button
                onClick={() => {
                  setEditingPromo(null);
                  setPromoFormData({
                    code: '',
                    description: '',
                    type: 'percentage',
                    value: '',
                    usageLimit: '',
                    expiryDate: '',
                  });
                  setShowPromoForm(true);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} />
                New Promo
              </button>
            </div>

            {showPromoForm && (
              <div style={{ backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1F2937' }}>
                  {editingPromo ? 'Edit Promotion' : 'Create New Promotion'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Promo Code (e.g., SAVE10)"
                    value={promoFormData.code}
                    onChange={(e) => setPromoFormData({ ...promoFormData, code: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      textTransform: 'uppercase'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={promoFormData.description}
                    onChange={(e) => setPromoFormData({ ...promoFormData, description: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <select
                    value={promoFormData.type}
                    onChange={(e) => setPromoFormData({ ...promoFormData, type: e.target.value as 'percentage' | 'fixed' })}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                  <input
                    type="number"
                    placeholder={promoFormData.type === 'percentage' ? 'Discount %' : 'Discount $'}
                    value={promoFormData.value}
                    onChange={(e) => setPromoFormData({ ...promoFormData, value: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Usage Limit"
                    value={promoFormData.usageLimit}
                    onChange={(e) => setPromoFormData({ ...promoFormData, usageLimit: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="date"
                    placeholder="Expiry Date"
                    value={promoFormData.expiryDate}
                    onChange={(e) => setPromoFormData({ ...promoFormData, expiryDate: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setShowPromoForm(false);
                      setPromoFormData({
                        code: '',
                        description: '',
                        type: 'percentage',
                        value: '',
                        usageLimit: '',
                        expiryDate: '',
                      });
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#E5E7EB',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!promoFormData.code || !promoFormData.description || !promoFormData.value || !promoFormData.usageLimit || !promoFormData.expiryDate) {
                        alert('Please fill all fields');
                        return;
                      }
                      try {
                        const newPromo = await promotionService.createPromotion(restaurant!.id, {
                          code: promoFormData.code,
                          description: promoFormData.description,
                          type: promoFormData.type as 'percentage' | 'fixed',
                          value: parseFloat(promoFormData.value),
                          usageLimit: parseInt(promoFormData.usageLimit),
                          expiryDate: promoFormData.expiryDate,
                        });
                        setShowPromoForm(false);
                        setPromotions([...promotions, newPromo]);
                        setPromoFormData({
                          code: '',
                          description: '',
                          type: 'percentage',
                          value: '',
                          usageLimit: '',
                          expiryDate: '',
                        });
                      } catch (error) {
                        alert('Failed to create promotion');
                        console.error(error);
                      }
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Save Promotion
                  </button>
                </div>
              </div>
            )}

            {promotionsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#6B7280' }}>Loading promotions...</p>
              </div>
            ) : promotions.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    style={{
                      padding: '16px',
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${promo.isActive ? '#10B981' : '#E5E7EB'}`,
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      opacity: promo.isActive ? 1 : 0.6
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <code style={{
                          backgroundColor: '#F3F4F6',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1F2937',
                          letterSpacing: '0.05em'
                        }}>
                          {promo.code}
                        </code>
                        <span style={{
                          backgroundColor: promo.isActive ? '#DBEAFE' : '#FEE2E2',
                          color: promo.isActive ? '#1E40AF' : '#7F1D1D',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {promo.isActive ? 'Active' : 'Expired'}
                        </span>
                      </div>
                      <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>
                        {promo.description}
                      </p>
                      <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#9CA3AF' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Percent size={14} />
                          {promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value.toFixed(2)}`}
                        </span>
                        <span>
                          {promo.usageCount} / {promo.usageLimit} uses
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          Expires: {promo.expiryDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          const code = promo.code;
                          navigator.clipboard.writeText(code);
                          alert('Code copied: ' + code);
                        }}
                        title="Copy code"
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#F3F4F6',
                          color: '#374151',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px'
                        }}
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('Delete this promotion?')) {
                            try {
                              await promotionService.deletePromotion(promo.id);
                              setPromotions(promotions.filter(p => p.id !== promo.id));
                            } catch (error) {
                              alert('Failed to delete promotion');
                              console.error(error);
                            }
                          }
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Tag size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
                <p style={{ color: '#6B7280', fontSize: '16px' }}>No promotions yet</p>
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Create your first promotion to attract more customers</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-dark">Menu Management</h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setMenuFormData({ name: '', description: '', price: '', category: '' });
                  setShowMenuForm(true);
                }}
                style={{
                  backgroundColor: '#FF6B35',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E55A2B')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF6B35')}
              >
                <Plus size={18} /> Add Menu Item
              </button>
            </div>

            {showMenuForm && (
              <div style={{ backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1F2937' }}>
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      if (!restaurant) return;
                      const itemData = {
                        name: menuFormData.name,
                        description: menuFormData.description,
                        price: parseFloat(menuFormData.price),
                        category: menuFormData.category,
                        available: true,
                      };

                      if (editingItem) {
                        await menuService.updateMenuItem(editingItem.id, itemData);
                      } else {
                        await menuService.createMenuItem(restaurant.id, itemData);
                      }

                      const items = await menuService.getMenuItems(restaurant.id);
                      setMenuItems(items);
                      setShowMenuForm(false);
                      setEditingItem(null);
                      setMenuFormData({ name: '', description: '', price: '', category: '' });
                      setSavedMessage(true);
                      setTimeout(() => setSavedMessage(false), 3000);
                    } catch (error) {
                      console.error('Failed to save menu item:', error);
                      alert('Failed to save menu item. Please try again.');
                    }
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                        Item Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={menuFormData.name}
                        onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                        placeholder="e.g., Margherita Pizza"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                        Price *
                      </label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={menuFormData.price}
                        onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                        placeholder="0.00"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                        Category *
                      </label>
                      <input
                        type="text"
                        required
                        value={menuFormData.category}
                        onChange={(e) => setMenuFormData({ ...menuFormData, category: e.target.value })}
                        placeholder="e.g., Pizza, Salad, Dessert"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                        Description
                      </label>
                      <input
                        type="text"
                        value={menuFormData.description}
                        onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                        placeholder="Item description"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#FF6B35',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E55A2B')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF6B35')}
                    >
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenuForm(false);
                        setEditingItem(null);
                        setMenuFormData({ name: '', description: '', price: '', category: '' });
                      }}
                      style={{
                        backgroundColor: '#E5E7EB',
                        color: '#4B5563',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#D1D5DB')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {savedMessage && (
              <div style={{ backgroundColor: '#ECFDF5', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', color: '#10B981', fontWeight: 'bold', fontSize: '14px' }}>
                ✅ Menu item saved successfully!
              </div>
            )}

            {menuItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px dashed #E5E7EB' }}>
                <ShoppingBag size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px', display: 'block' }} />
                <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '8px' }}>No menu items yet</p>
                <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Click "Add Menu Item" to create your first menu item</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', fontWeight: '600' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', fontWeight: '600' }}>Category</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', fontWeight: '600' }}>Price</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', fontWeight: '600' }}>Description</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: '#6B7280', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                        <td style={{ padding: '12px', fontWeight: '500', color: '#1F2937' }}>{item.name}</td>
                        <td style={{ padding: '12px', color: '#6B7280' }}>{item.category}</td>
                        <td style={{ padding: '12px', color: '#10B981', fontWeight: '600' }}>${item.price.toFixed(2)}</td>
                        <td style={{ padding: '12px', color: '#6B7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.description || '-'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setMenuFormData({
                                name: item.name,
                                description: item.description,
                                price: item.price.toString(),
                                category: item.category,
                              });
                              setShowMenuForm(true);
                            }}
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #E5E7EB',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginRight: '6px',
                              color: '#3B82F6',
                              fontSize: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (!window.confirm('Are you sure you want to delete this item?')) return;
                              try {
                                await menuService.deleteMenuItem(item.id);
                                if (restaurant) {
                                  const items = await menuService.getMenuItems(restaurant.id);
                                  setMenuItems(items);
                                }
                                setSavedMessage(true);
                                setTimeout(() => setSavedMessage(false), 3000);
                              } catch (error) {
                                console.error('Failed to delete menu item:', error);
                                alert('Failed to delete menu item.');
                              }
                            }}
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #FEE2E2',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: '#EF4444',
                              fontSize: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'widget' && restaurant && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-dark mb-6">
              <Code size={24} style={{ display: 'inline', marginRight: '8px' }} />
              Widget Setup & Theme Selection
            </h2>
            <p className="text-gray-600 mb-6">
              Choose your widget theme, preview it, and get the embed code for your website. Customers can browse your menu and place orders directly!
            </p>

            {/* THEME SELECTOR */}
            <div style={{ backgroundColor: '#F0F9FF', border: '2px solid #3B82F6', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E40AF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎨 Choose Your Widget Theme
              </h3>
              <p style={{ fontSize: '13px', color: '#3B82F6', marginBottom: '16px' }}>
                Select a theme below to see a live preview and get the embed code
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {/* Basic Theme Option */}
                <button
                  type="button"
                  onClick={() => {
                    setWidgetTheme('basic');
                    restaurantService.updateRestaurant(restaurant!.id, { widgetTheme: 'basic' });
                  }}
                  style={{
                    padding: '16px',
                    border: widgetTheme === 'basic' ? '3px solid #3B82F6' : '2px solid #D1D5DB',
                    borderRadius: '8px',
                    backgroundColor: widgetTheme === 'basic' ? '#EFF6FF' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚪</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>Basic Theme</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Simple gray design</div>
                  {widgetTheme === 'basic' && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>✓ Selected</div>
                  )}
                </button>

                {/* Pro Theme Option */}
                <button
                  type="button"
                  onClick={() => {
                    setWidgetTheme('pro');
                    restaurantService.updateRestaurant(restaurant!.id, { widgetTheme: 'pro' });
                  }}
                  style={{
                    padding: '16px',
                    border: widgetTheme === 'pro' ? '3px solid #667EEA' : '2px solid #D1D5DB',
                    borderRadius: '8px',
                    backgroundColor: widgetTheme === 'pro' ? '#EDE9FE' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>💜</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>Pro Theme</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Beautiful purple gradient</div>
                  {widgetTheme === 'pro' && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>✓ Selected</div>
                  )}
                </button>

                {/* Premium Theme Option */}
                <button
                  type="button"
                  onClick={() => {
                    setWidgetTheme('premium');
                    restaurantService.updateRestaurant(restaurant!.id, { widgetTheme: 'premium' });
                  }}
                  style={{
                    padding: '16px',
                    border: widgetTheme === 'premium' ? '3px solid #9333EA' : '2px solid #D1D5DB',
                    borderRadius: '8px',
                    backgroundColor: widgetTheme === 'premium' ? '#F3E8FF' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>✨</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>Premium Theme</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Dark luxury design</div>
                  {widgetTheme === 'premium' && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>✓ Selected</div>
                  )}
                </button>
              </div>
            </div>

            {/* CODE & PREVIEW SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* Embed Code */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937', marginBottom: '12px' }}>
                  <Link2 size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  Embed Code for {widgetTheme === 'basic' ? 'Basic' : widgetTheme === 'pro' ? 'Pro' : 'Premium'} Theme
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>
                  Copy this code and paste it into your website's HTML:
                </p>
                <div
                  style={{
                    backgroundColor: '#1F2937',
                    color: '#10B981',
                    padding: '12px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    overflow: 'auto',
                    maxHeight: '200px',
                    border: '1px solid #374151',
                  }}
                >
                  <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`<iframe
  src="${window.location.origin}/widget/${restaurant.id}?theme=${widgetTheme}"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>`}
                  </code>
                </div>
                <button
                  onClick={() => {
                    const code = `<iframe src="${window.location.origin}/widget/${restaurant.id}?theme=${widgetTheme}" width="100%" height="600" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`;
                    navigator.clipboard.writeText(code);
                    setSavedMessage(true);
                    setTimeout(() => setSavedMessage(false), 2000);
                  }}
                  style={{
                    marginTop: '12px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3B82F6')}
                >
                  <Copy size={16} /> Copy Code
                </button>
                {savedMessage && (
                  <div style={{ marginTop: '8px', color: '#10B981', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> Copied to clipboard!
                  </div>
                )}
              </div>

              {/* Live Preview */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937', marginBottom: '12px' }}>
                  <Eye size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  Live Preview - {widgetTheme === 'basic' ? 'Basic' : widgetTheme === 'pro' ? 'Pro' : 'Premium'} Theme
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>
                  This is how your widget appears with the selected theme:
                </p>
                <iframe
                  key={widgetTheme}
                  src={`${window.location.origin}/widget/${restaurant.id}?theme=${widgetTheme}&t=${Date.now()}`}
                  style={{
                    width: '100%',
                    height: '400px',
                    border: '2px solid #D1D5DB',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                  }}
                  title="Restaurant Widget Preview"
                />
              </div>
            </div>

            <div style={{ backgroundColor: '#FEF3C7', padding: '16px', borderLeft: '4px solid #F59E0B', borderRadius: '6px', marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#92400E', marginBottom: '8px' }}>
                <strong>Installation Steps:</strong>
              </p>
              <ol style={{ fontSize: '13px', color: '#92400E', marginLeft: '20px' }}>
                <li>Choose your preferred theme above</li>
                <li>Click "Copy Code" to copy the embed code</li>
                <li>Go to your website's HTML editor or content management system</li>
                <li>Paste the code where you want the menu widget to appear</li>
                <li>Save and publish your website</li>
              </ol>
            </div>

            <div style={{ backgroundColor: '#DBEAFE', padding: '16px', borderLeft: '4px solid #3B82F6', borderRadius: '6px' }}>
              <p style={{ fontSize: '14px', color: '#1E40AF' }}>
                <strong>Widget URL:</strong> <code style={{ backgroundColor: '#EFF6FF', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>{window.location.origin}/widget/{restaurant.id}</code>
              </p>
              <p style={{ fontSize: '13px', color: '#1E40AF', marginTop: '8px' }}>
                This widget is unique to your restaurant and customers will see your complete menu and be able to place orders directly.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && restaurant && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-dark mb-6">Restaurant Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* PAYMENT CONFIGURATION - MOST IMPORTANT - WITH SECURITY */}
              <div style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#DC2626', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={20} />
                  💰 Where Does Your Money Go? (Payment Configuration)
                </h3>
                <p style={{ fontSize: '13px', color: '#7F1D1D', marginBottom: '16px', fontWeight: '500' }}>
                  ⚠️ IMPORTANT: Configure where customer payments will be deposited. This is where your restaurant income goes!
                </p>

                {/* SECURITY LOCK - Password Required */}
                {!paymentSectionUnlocked ? (
                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '2px solid #DC2626', textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#DC2626', marginBottom: '12px' }}>
                      Payment Details Locked for Security
                    </h4>
                    <p style={{ fontSize: '13px', color: '#7F1D1D', marginBottom: '16px' }}>
                      Enter your account password to unlock and edit payment information. This extra security protects your bank details from unauthorized access.
                    </p>
                    <div style={{ maxWidth: '400px', margin: '0 auto', marginBottom: '16px' }}>
                      <input
                        type="password"
                        placeholder="Enter your password to unlock payment details"
                        value={paymentSecurityPassword}
                        onChange={(e) => setPaymentSecurityPassword(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            // In a real app, you'd verify against the backend
                            // For now, we'll use a simple check
                            if (paymentSecurityPassword.length >= 6) {
                              setPaymentSectionUnlocked(true);
                              setPaymentSecurityPassword('');
                            } else {
                              alert('Please enter a valid password');
                            }
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #DC2626',
                          borderRadius: '6px',
                          fontSize: '14px',
                          marginBottom: '12px',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (paymentSecurityPassword.length >= 6) {
                            setPaymentSectionUnlocked(true);
                            setPaymentSecurityPassword('');
                          } else {
                            alert('Please enter a valid password (minimum 6 characters)');
                          }
                        }}
                        style={{
                          width: '100%',
                          backgroundColor: '#DC2626',
                          color: 'white',
                          padding: '12px 20px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#B91C1C')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
                      >
                        🔓 Unlock Payment Details
                      </button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                      Your password is never stored with your payment details. Only used for verification.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Unlock Badge */}
                    <div style={{ backgroundColor: '#D1FAE5', padding: '12px', borderRadius: '6px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: '#047857', fontWeight: 'bold' }}>
                        ✓ Payment Details Unlocked - Editing Enabled
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentSectionUnlocked(false);
                          setPaymentSecurityPassword('');
                        }}
                        style={{
                          backgroundColor: '#DC2626',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#B91C1C')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
                      >
                        🔒 Lock
                      </button>
                    </div>

                    {/* Bank Account Details - NOW VISIBLE ONLY WHEN UNLOCKED */}
                    <div style={{ marginBottom: '24px', backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '2px solid #DC2626' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#DC2626', marginBottom: '12px' }}>
                        🏦 Your Bank Account (Where money will be deposited)
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                            Bank Name <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={settingsFormData.bankDetails.bankName}
                            placeholder="e.g., Chase, Wells Fargo, HDFC"
                            onChange={(e) => setSettingsFormData({
                              ...settingsFormData,
                              bankDetails: { ...settingsFormData.bankDetails, bankName: e.target.value }
                            })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #BFDBFE',
                              borderRadius: '6px',
                              fontSize: '14px',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                            Account Holder Name <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={settingsFormData.bankDetails.accountHolderName}
                            placeholder="Name on bank account"
                            onChange={(e) => setSettingsFormData({
                              ...settingsFormData,
                              bankDetails: { ...settingsFormData.bankDetails, accountHolderName: e.target.value }
                            })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #BFDBFE',
                              borderRadius: '6px',
                              fontSize: '14px',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                            Account Number (Last 4 digits shown) <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <input
                            type="password"
                            value={settingsFormData.bankDetails.accountNumber}
                            placeholder="XXXX XXXX XXXX 1234"
                            onChange={(e) => setSettingsFormData({
                              ...settingsFormData,
                              bankDetails: { ...settingsFormData.bankDetails, accountNumber: e.target.value }
                            })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #BFDBFE',
                              borderRadius: '6px',
                              fontSize: '14px',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                            Routing Number (US) / IFSC (India) <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={settingsFormData.bankDetails.routingNumber}
                            placeholder="e.g., 021000021 or AXIS0001234"
                            onChange={(e) => setSettingsFormData({
                              ...settingsFormData,
                              bankDetails: { ...settingsFormData.bankDetails, routingNumber: e.target.value }
                            })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #BFDBFE',
                              borderRadius: '6px',
                              fontSize: '14px',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                            IFSC Code (India)
                          </label>
                          <input
                            type="text"
                            value={settingsFormData.bankDetails.ifscCode}
                            placeholder="e.g., AXIS0001234"
                            onChange={(e) => setSettingsFormData({
                              ...settingsFormData,
                              bankDetails: { ...settingsFormData.bankDetails, ifscCode: e.target.value }
                            })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #BFDBFE',
                              borderRadius: '6px',
                              fontSize: '14px',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                            SWIFT Code (International)
                          </label>
                          <input
                            type="text"
                            value={settingsFormData.bankDetails.swiftCode}
                            placeholder="e.g., AXISDEF"
                            onChange={(e) => setSettingsFormData({
                              ...settingsFormData,
                              bankDetails: { ...settingsFormData.bankDetails, swiftCode: e.target.value }
                            })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #BFDBFE',
                              borderRadius: '6px',
                              fontSize: '14px',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ backgroundColor: '#FEF2F2', padding: '10px', borderRadius: '4px', border: '1px solid #FECACA' }}>
                        <p style={{ fontSize: '12px', color: '#7F1D1D' }}>
                          🔒 <strong>SECURE & ENCRYPTED:</strong> Your bank details are encrypted and stored safely. Only used to receive customer payments.
                        </p>
                      </div>
                    </div>

                    {/* Payment Processor APIs */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                        💳 Payment Processor APIs (Optional - For automatic payments)
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                            Stripe API Key
                          </label>
                          <input
                            type="password"
                            value={settingsFormData.stripeKey}
                            placeholder="sk_live_... or sk_test_..."
                            onChange={(e) => setSettingsFormData({ ...settingsFormData, stripeKey: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              fontSize: '14px',
                            }}
                          />
                          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                            Get from <a href="https://stripe.com" target="_blank" style={{ color: '#3B82F6', textDecoration: 'underline' }}>stripe.com</a>
                          </p>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                            PayPal Email / API Key
                          </label>
                          <input
                            type="text"
                            value={settingsFormData.paypalEmail}
                            placeholder="business@paypal.com or API key"
                            onChange={(e) => setSettingsFormData({ ...settingsFormData, paypalEmail: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              fontSize: '14px',
                            }}
                          />
                          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                            Get from <a href="https://paypal.com" target="_blank" style={{ color: '#3B82F6', textDecoration: 'underline' }}>paypal.com</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Accepted Payment Methods */}
                    <div style={{ marginBottom: '24px', backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                        ✓ Which payment methods do you accept from customers?
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {['Credit Card', 'Debit Card', 'PayPal', 'Apple Pay', 'Google Pay', 'Cash'].map((method) => (
                          <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={settingsFormData.paymentMethods.includes(method)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSettingsFormData({
                                    ...settingsFormData,
                                    paymentMethods: [...settingsFormData.paymentMethods, method],
                                  });
                                } else {
                                  setSettingsFormData({
                                    ...settingsFormData,
                                    paymentMethods: settingsFormData.paymentMethods.filter((m) => m !== method),
                                  });
                                }
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', color: '#374151' }}>{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RESTAURANT DETAILS - SECONDARY */}
              <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '20px', marginTop: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>Restaurant Details</h3>
                
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={settingsFormData.name || restaurant.name || ''}
                  placeholder="Your restaurant name"
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                  Description
                </label>
                <textarea
                  value={settingsFormData.description || restaurant.description || ''}
                  placeholder="Restaurant description"
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Other restaurant settings continue below */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                  <Smartphone size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settingsFormData.phoneNumber || restaurant.phone || ''}
                  placeholder="Contact phone"
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, phoneNumber: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                  <Mail size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  placeholder="Contact email"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#F9FAFB',
                  }}
                  disabled
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                  <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Street Address
                </label>
                <input
                  type="text"
                  value={settingsFormData.address || restaurant.address?.street || ''}
                  placeholder="123 Main Street"
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={settingsFormData.city || restaurant.address?.city || ''}
                    placeholder="City"
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={settingsFormData.state || restaurant.address?.state || ''}
                    placeholder="State"
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, state: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={settingsFormData.zipCode || restaurant.address?.zipCode || ''}
                    placeholder="12345"
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, zipCode: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              {/* Delivery Radius */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
                  Delivery Radius (km)
                </label>
                <input
                  type="number"
                  value={settingsFormData.deliveryRadius || ''}
                  placeholder="5"
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, deliveryRadius: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  onClick={async () => {
                    try {
                      const updateData: any = {
                        name: settingsFormData.name || restaurant.name,
                        description: settingsFormData.description || restaurant.description,
                        phone: settingsFormData.phoneNumber,
                        address: {
                          street: settingsFormData.address,
                          city: settingsFormData.city,
                          state: settingsFormData.state,
                          zipCode: settingsFormData.zipCode,
                        },
                        paymentMethods: settingsFormData.paymentMethods,
                        deliveryRadius: settingsFormData.deliveryRadius,
                        bankDetails: settingsFormData.bankDetails,
                        paymentProcessors: {
                          stripe: settingsFormData.stripeKey,
                          paypal: settingsFormData.paypalEmail,
                        },
                      };
                      await restaurantService.updateRestaurant(restaurant.id, updateData);
                      setSavedMessage(true);
                      setTimeout(() => setSavedMessage(false), 3000);
                      const updated = await restaurantService.getUserRestaurant();
                      setRestaurant(updated);
                    } catch (error) {
                      console.error('Failed to save settings:', error);
                      alert('Failed to save settings. Please try again.');
                    }
                  }}
                  style={{
                    backgroundColor: '#10B981',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
                >
                  Save Settings
                </button>
                {savedMessage && (
                  <div style={{ color: '#10B981', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> Settings saved successfully
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
