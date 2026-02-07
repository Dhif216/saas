import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { restaurantService } from '@/services/restaurantService';

interface RestaurantData {
  id: string;
  name: string;
  plan: 'basic' | 'pro' | 'premium';
}

const PLAN_FEATURES: {
  [key: string]: {
    name: string;
    color: string;
    features: string[];
    locked: boolean;
  };
} = {
  basic: {
    name: 'Basic',
    color: '#6B7280',
    features: ['Simple menu display', 'Basic ordering', 'Email support'],
    locked: false,
  },
  pro: {
    name: 'Pro',
    color: '#3B82F6',
    features: [
      'Beautiful widget design',
      'Advanced menu filters',
      'Item ratings & reviews',
      'Promo badges',
      'Priority email support',
      'Basic analytics',
    ],
    locked: false,
  },
  premium: {
    name: 'Premium',
    color: '#8B5CF6',
    features: [
      'Dark mode widget',
      'Premium animations',
      'Full analytics dashboard',
      'AI recommendations',
      'Custom branding',
      '24/7 phone support',
      'API access',
      'Advanced customization',
    ],
    locked: false,
  },
};

const PLAN_PRICING: {
  [key: string]: { price: number; billing: string };
} = {
  basic: { price: 0, billing: 'Free' },
  pro: { price: 29, billing: 'per month' },
  premium: { price: 79, billing: 'per month' },
};

export default function SubscriptionManagement() {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        if (restaurantId) {
          const data = await restaurantService.getRestaurantById(restaurantId);
          if (data) {
            setRestaurant({ id: data.id, name: data.name, plan: data.plan || 'basic' } as RestaurantData);
          }
        }
      } catch (error) {
        console.error('Failed to load restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [restaurantId]);

  const handleUpgradePlan = async (planKey: string) => {
    if (!restaurant) return;
    
    setProcessingPlan(planKey);
    
    try {
      // Call backend to update plan
      const response = await restaurantService.updateRestaurantPlan(restaurant.id, planKey as 'basic' | 'pro' | 'premium');
      
      if (response.success) {
        // Update local state
        setRestaurant({ ...restaurant, plan: planKey as 'basic' | 'pro' | 'premium' });
        
        // Show success message
        alert(`Successfully upgraded to ${PLAN_FEATURES[planKey].name} plan!`);
      }
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      alert('Failed to process upgrade. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleDowngradePlan = async () => {
    if (!restaurant) return;
    
    setProcessingPlan('basic');
    
    try {
      const response = await restaurantService.updateRestaurantPlan(restaurant.id, 'basic');
      
      if (response.success) {
        setRestaurant({ ...restaurant, plan: 'basic' });
        alert('Successfully downgraded to Basic plan!');
      }
    } catch (error) {
      console.error('Failed to downgrade plan:', error);
      alert('Failed to process downgrade. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #E5E7EB',
          borderTop: '4px solid #3B82F6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{ marginTop: '20px', color: '#6B7280' }}>Loading subscription details...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: '#EF4444', fontSize: '18px' }}>Failed to load restaurant data</p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '24px' }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#3B82F6',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '16px',
          }}
        >
          <ChevronLeft size={18} />
          Back to Dashboard
        </button>

        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 8px 0' }}>
            Subscription Management
          </h1>
          <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
            Manage your {restaurant.name} subscription plan
          </p>
        </div>
      </div>

      {/* Current Plan Info */}
      <div style={{
        backgroundColor: '#E0F2FE',
        border: '1px solid #0284C7',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '18px' }}>📋</span>
          <span style={{ fontSize: '14px', color: '#0C4A6E', fontWeight: '500' }}>
            Current Plan
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#0C4A6E' }}>
          {PLAN_FEATURES[restaurant.plan].name} Plan
          {restaurant.plan === 'basic' && ' (Free)'}
          {restaurant.plan === 'pro' && ' - $29/month'}
          {restaurant.plan === 'premium' && ' - $79/month'}
        </p>
      </div>

      {/* Plan Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
      }}>
        {['basic', 'pro', 'premium'].map((planKey) => {
          const planInfo = PLAN_FEATURES[planKey];
          const pricing = PLAN_PRICING[planKey];
          const isCurrentPlan = planKey === restaurant.plan;
          const icon = planKey === 'basic' ? '✨' : planKey === 'pro' ? '⚡' : '👑';

          return (
            <div
              key={planKey}
              style={{
                backgroundColor: '#FFFFFF',
                border: isCurrentPlan ? `3px solid ${planInfo.color}` : '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '28px',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: isCurrentPlan ? `0 10px 25px ${planInfo.color}20` : '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              {isCurrentPlan && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '20px',
                  backgroundColor: planInfo.color,
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>
                  ✓ CURRENT PLAN
                </div>
              )}

              {/* Plan Header */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: planInfo.color,
                  margin: '0 0 8px 0',
                }}>
                  {planInfo.name}
                </h3>
              </div>

              {/* Pricing */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 'bold', color: planInfo.color }}>
                    ${pricing.price}
                  </span>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>
                    {pricing.billing}
                  </span>
                </div>
                {planKey === 'basic' && (
                  <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
                    Forever free
                  </p>
                )}
              </div>

              {/* Features */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 24px 0',
              }}>
                {planInfo.features.map((feature, idx) => (
                  <li key={idx} style={{
                    fontSize: '14px',
                    color: '#374151',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}>
                    <span style={{ color: planInfo.color, fontWeight: 'bold', marginTop: '2px' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (isCurrentPlan) {
                    // Do nothing if current plan
                  } else if (planKey === 'basic') {
                    handleDowngradePlan();
                  } else {
                    handleUpgradePlan(planKey);
                  }
                }}
                disabled={isCurrentPlan || processingPlan === planKey}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  backgroundColor: isCurrentPlan ? '#E5E7EB' : planInfo.color,
                  color: isCurrentPlan ? '#9CA3AF' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isCurrentPlan ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  opacity: processingPlan === planKey ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  if (!isCurrentPlan && processingPlan !== planKey) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.transform = 'translateY(-2px)';
                    el.style.boxShadow = `0 10px 20px ${planInfo.color}40`;
                  }
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                {processingPlan === planKey ? (
                  <>
                    <span>Processing...</span>
                  </>
                ) : isCurrentPlan ? (
                  'Current Plan'
                ) : planKey === 'basic' ? (
                  'Downgrade to Basic'
                ) : (
                  `Upgrade to ${planInfo.name}`
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '28px',
        border: '1px solid #E5E7EB',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '20px' }}>
          Feature Comparison
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                <th style={{
                  textAlign: 'left',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1F2937',
                }}>
                  Feature
                </th>
                {['basic', 'pro', 'premium'].map((planKey) => {
                  const isCurrentPlan = planKey === restaurant.plan;
                  return (
                    <th key={planKey} style={{
                      textAlign: 'center',
                      padding: '16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1F2937',
                      backgroundColor: isCurrentPlan ? 'rgba(139, 92, 246, 0.05)' : 'transparent',
                    }}>
                      {PLAN_FEATURES[planKey].name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Menu Display', basic: true, pro: true, premium: true },
                { name: 'Beautiful Design', basic: false, pro: true, premium: true },
                { name: 'Advanced Filters', basic: false, pro: true, premium: true },
                { name: 'Item Ratings', basic: false, pro: true, premium: true },
                { name: 'Dark Mode', basic: false, pro: false, premium: true },
                { name: 'Premium Animations', basic: false, pro: false, premium: true },
                { name: 'Analytics Dashboard', basic: false, pro: false, premium: true },
                { name: 'AI Recommendations', basic: false, pro: false, premium: true },
                { name: 'Custom Branding', basic: false, pro: false, premium: true },
                { name: 'API Access', basic: false, pro: false, premium: true },
                { name: '24/7 Support', basic: false, pro: false, premium: true },
              ].map((feature, idx) => (
                <tr key={idx} style={{
                  borderBottom: '1px solid #E5E7EB',
                  backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                }}>
                  <td style={{
                    padding: '16px',
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500',
                  }}>
                    {feature.name}
                  </td>
                  {['basic', 'pro', 'premium'].map((planKey) => {
                    const hasFeature = feature[planKey as keyof typeof feature] as boolean;
                    const isCurrentPlan = planKey === restaurant.plan;
                    return (
                      <td key={planKey} style={{
                        padding: '16px',
                        textAlign: 'center',
                        fontSize: '18px',
                        backgroundColor: isCurrentPlan ? 'rgba(139, 92, 246, 0.05)' : 'transparent',
                      }}>
                        {hasFeature ? '✅' : '❌'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
