import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, Star, Lock } from 'lucide-react';
import { restaurantService } from '@/services/restaurantService';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  plan?: string;
}

const PLAN_FEATURES = {
  basic: {
    name: 'Basic',
    color: '#6B7280',
    features: ['Simple menu display', 'Basic ordering'],
    locked: false,
  },
  pro: {
    name: 'Pro',
    color: '#3B82F6',
    features: ['Beautiful design', 'Advanced filters', 'Item ratings', 'Promo badges'],
    locked: false,
  },
  premium: {
    name: 'Premium',
    color: '#8B5CF6',
    features: ['Premium animations', 'Analytics', 'Recommendations', 'Custom branding'],
    locked: false,
  },
};

// BASIC WIDGET - Simple and clean
const BasicWidget = ({ restaurant, menuItems, cart, addToCart, removeFromCart, getTotalPrice, getTotalItems }: any) => (
  <div style={{
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
    padding: '16px',
  }}>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#F3F4F6', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0' }}>
          {restaurant.name}
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
          {restaurant.description}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {menuItems.map((item: MenuItem) => (
          <div key={item.id} style={{
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            padding: '12px',
            backgroundColor: '#FFFFFF',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#1F2937' }}>{item.name}</h3>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px 0' }}>${item.price.toFixed(2)}</p>
            <button
              onClick={() => addToCart(item.id)}
              style={{
                width: '100%',
                backgroundColor: '#3B82F6',
                color: 'white',
                padding: '6px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {Object.keys(cart).length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          backgroundColor: '#3B82F6',
          color: 'white',
          padding: '16px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <div style={{ fontSize: '12px', marginBottom: '4px' }}>
            {getTotalItems()} items - ${getTotalPrice().toFixed(2)}
          </div>
          <button style={{
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            Checkout
          </button>
        </div>
      )}
    </div>
  </div>
);

// PRO WIDGET - Beautiful with advanced features
const ProWidget = ({ restaurant, menuItems, cart, addToCart, removeFromCart, getTotalPrice, getTotalItems }: any) => (
  <div style={{
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
  }}>
    {/* Gradient Header */}
    <div style={{
      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      color: 'white',
      padding: '32px 24px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
        {restaurant.name}
      </h1>
      <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }}>
        {restaurant.description}
      </p>
    </div>

    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: menuItems.length > 0 ? '1fr 340px' : '1fr',
        gap: '24px',
      }}>
        {/* Menu */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
            ✨ Menu
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {menuItems.map((item: MenuItem) => (
              <div
                key={item.id}
                style={{
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
                onMouseOver={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = '0 8px 20px rgba(102,126,234,0.2)';
                  el.style.transform = 'translateY(-4px)';
                  el.style.borderColor = '#667EEA';
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  el.style.transform = 'translateY(0)';
                  el.style.borderColor = '#E5E7EB';
                }}
              >
                {item.image && (
                  <div style={{
                    width: '100%',
                    height: '180px',
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }} />
                )}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0' }}>
                    {item.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 12px 0', minHeight: '32px' }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(item.id)}
                      style={{
                        background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                        color: 'white',
                        padding: '8px 14px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        {menuItems.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '20px',
            height: 'fit-content',
            position: 'sticky',
            top: '24px',
            boxShadow: '0 8px 20px rgba(102,126,234,0.3)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              🛒 Your Cart
            </h3>

            {Object.keys(cart).length > 0 ? (
              <>
                {Object.keys(cart).map((itemId) => {
                  const item = menuItems.find((m: MenuItem) => m.id === itemId);
                  if (!item) return null;
                  return (
                    <div key={itemId} style={{
                      paddingBottom: '12px',
                      marginBottom: '12px',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#FFFFFF' }}>{item.name}</span>
                        <span style={{ fontSize: '12px', color: '#FFFFFF' }}>x{cart[itemId]}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#FFFFFF' }}>
                          ${(item.price * cart[itemId]).toFixed(2)}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => removeFromCart(itemId)}
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              border: 'none',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '11px',
                            }}
                          >
                            −
                          </button>
                          <button
                            onClick={() => addToCart(itemId)}
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              border: 'none',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '11px',
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '2px solid rgba(255,255,255,0.3)',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}>
                    <span style={{ fontSize: '14px' }}>Total:</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <button style={{
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    color: 'white',
                    padding: '12px',
                    border: '2px solid rgba(255,255,255,0.5)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            ) : (
              <p style={{ fontSize: '13px', opacity: 0.8, textAlign: 'center' }}>
                Cart is empty
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

// PREMIUM WIDGET - Ultra premium with all features
const PremiumWidget = ({ restaurant, menuItems, cart, addToCart, removeFromCart, getTotalPrice, getTotalItems }: any) => (
  <div style={{
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#0F172A',
    color: 'white',
    minHeight: '100vh',
  }}>
    {/* Dark Premium Header */}
    <div style={{
      background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
      borderBottom: '2px solid #8B5CF6',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <span style={{ fontSize: '24px' }}>👑</span>
        <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Premium Experience
        </span>
      </div>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
        {restaurant.name}
      </h1>
      <p style={{ fontSize: '16px', margin: 0, color: '#A1A1AA' }}>
        {restaurant.description}
      </p>
    </div>

    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: menuItems.length > 0 ? '1fr 360px' : '1fr',
        gap: '32px',
      }}>
        {/* Premium Menu */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>✨ Curated Menu</h2>
            <span style={{
              backgroundColor: '#8B5CF6',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 'bold',
            }}>
              {menuItems.length} Items
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {menuItems.map((item: MenuItem) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#1E293B',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                }}
                onMouseOver={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '#8B5CF6';
                  el.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.25)';
                  el.style.transform = 'translateY(-8px)';
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '#334155';
                  el.style.boxShadow = 'none';
                  el.style.transform = 'translateY(0)';
                }}
              >
                {item.image && (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#8B5CF6',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      ⭐ NEW
                    </div>
                  </div>
                )}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#FFFFFF' }}>
                    {item.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#A1A1AA', margin: '0 0 14px 0' }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '22px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(item.id)}
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
                        color: 'white',
                        padding: '10px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                      }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Cart */}
        {menuItems.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            border: '2px solid #8B5CF6',
            borderRadius: '16px',
            padding: '24px',
            height: 'fit-content',
            position: 'sticky',
            top: '24px',
            boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF' }}>
              🛒 Order Summary
              <span style={{
                backgroundColor: '#8B5CF6',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
              }}>
                {getTotalItems()}
              </span>
            </h3>

            {Object.keys(cart).length > 0 ? (
              <>
                <div style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  marginBottom: '16px',
                  paddingRight: '8px',
                }}>
                  {Object.keys(cart).map((itemId) => {
                    const item = menuItems.find((m: MenuItem) => m.id === itemId);
                    if (!item) return null;
                    return (
                      <div key={itemId} style={{
                        paddingBottom: '12px',
                        marginBottom: '12px',
                        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#FFFFFF' }}>{item.name}</span>
                          <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>x{cart[itemId]}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', color: '#A1A1AA' }}>
                            ${(item.price * cart[itemId]).toFixed(2)}
                          </span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => removeFromCart(itemId)}
                              style={{
                                backgroundColor: 'transparent',
                                color: '#8B5CF6',
                                border: '1px solid #8B5CF6',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              −
                            </button>
                            <button
                              onClick={() => addToCart(itemId)}
                              style={{
                                backgroundColor: 'transparent',
                                color: '#8B5CF6',
                                border: '1px solid #8B5CF6',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  borderLeft: '3px solid #8B5CF6',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#A1A1AA' }}>Subtotal:</span>
                    <span style={{ color: '#FFFFFF' }}>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#A1A1AA' }}>Total:</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', background: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
                  color: 'white',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '15px',
                }}>
                  Checkout Securely
                </button>
              </>
            ) : (
              <p style={{ fontSize: '14px', color: '#A1A1AA', textAlign: 'center' }}>
                Your cart is empty
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function WidgetPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeModalPlan, setUpgradeModalPlan] = useState<string | null>(null);
  const [themeOverride, setThemeOverride] = useState<'basic' | 'pro' | 'premium' | null>(null);

  // Get theme from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get('theme');
    if (urlTheme === 'basic' || urlTheme === 'pro' || urlTheme === 'premium') {
      setThemeOverride(urlTheme);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (restaurantId) {
          const restaurantData = await restaurantService.getRestaurantById(restaurantId);
          if (restaurantData) {
            setRestaurant(restaurantData);
          } else {
            setError('Restaurant not found');
            return;
          }

          const menuItemsData = await restaurantService.getMenuItems(restaurantId);
          setMenuItems(menuItemsData || []);
        }
      } catch (err) {
        console.error('Error loading widget:', err);
        setError('Failed to load restaurant widget. Please check the restaurant ID.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Re-fetch when restaurantId changes (theme changes come via URL param)
  }, [restaurantId]);

  const addToCart = (itemId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalPrice = () => {
    return menuItems.reduce((total, item) => {
      return total + (item.price * (cart[item.id] || 0));
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, qty) => total + qty, 0);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '600px',
        backgroundColor: '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size={40} style={{ color: '#3B82F6', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '14px' }}>Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '600px',
        backgroundColor: '#FEF2F2',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ textAlign: 'center', color: '#DC2626' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>⚠️ {error || 'Restaurant not found'}</p>
        </div>
      </div>
    );
  }

  const plan = (restaurant.plan || 'pro').toLowerCase();
  const currentPlan = PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.pro;

  // Render the appropriate widget based on widgetTheme preference
  // URL query parameter takes priority over database theme
  const theme = (themeOverride || restaurant.widgetTheme || 'pro').toLowerCase();
  let WidgetComponent: any;
  switch (theme) {
    case 'premium':
      WidgetComponent = PremiumWidget;
      break;
    case 'basic':
      WidgetComponent = BasicWidget;
      break;
    default:
      WidgetComponent = ProWidget;
  }

  return (
    <div>
      {/* MAIN WIDGET - Current Plan */}
      <WidgetComponent
        restaurant={restaurant}
        menuItems={menuItems}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
        getTotalItems={getTotalItems}
      />

      {/* Upgrade Modal - Removed from widget, only shown in dashboard */}
    </div>
  );
}
