import React, { useState } from 'react';
import { CreditCard, Check, AlertCircle } from 'lucide-react';

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState('plus');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = {
    basic: {
      name: 'Starter',
      monthlyFee: 0,
      commissionPerOrder: 0.15, // $0.15 per order
      description: 'Perfect for testing',
      features: [
        'Unlimited menu items',
        'Order management',
        'Email notifications',
        'Basic analytics',
        'Mobile responsive',
      ],
      limits: [
        'Up to 100 orders/month',
        'No phone support',
      ],
      color: 'blue',
    },
    plus: {
      name: 'Plus',
      monthlyFee: 29,
      commissionPerOrder: 0.10, // $0.10 per order
      description: 'Most popular',
      features: [
        'Everything in Starter',
        'Unlimited orders',
        'Priority email support',
        'Advanced analytics',
        'Custom branding',
        'Widget customization',
      ],
      limits: [],
      color: 'purple',
      popular: true,
    },
    pro: {
      name: 'Professional',
      monthlyFee: 99,
      commissionPerOrder: 0.05, // $0.05 per order
      description: 'For growing restaurants',
      features: [
        'Everything in Plus',
        'Phone support (24/5)',
        'Multi-location support',
        'Advanced integrations',
        'Staff management',
        'API access',
        'Custom reports',
      ],
      limits: [],
      color: 'amber',
    },
    enterprise: {
      name: 'Enterprise',
      monthlyFee: null,
      commissionPerOrder: 0.02, // $0.02 per order + custom
      description: 'For large operations',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'White-label option',
        'SLA guarantee',
      ],
      limits: [],
      color: 'green',
    },
  };

  const calculateExample = (orders = 100) => {
    const plan = plans[selectedPlan];
    const stripePercentage = 0.029 * 30 * orders; // 2.9% on $30 average
    const stripeFee = 0.30 * orders; // $0.30 per order
    const totalStripe = stripePercentage + stripeFee;
    const foodhubCommission = plan.commissionPerOrder * orders;
    const restaurantProfit = 30 * orders - totalStripe - plan.monthlyFee - foodhubCommission;
    
    return {
      revenue: 30 * orders,
      stripeFee: Math.round(totalStripe * 100) / 100,
      subscriptionFee: plan.monthlyFee || 0,
      commissionFee: Math.round(foodhubCommission * 100) / 100,
      profit: Math.round(restaurantProfit * 100) / 100,
    };
  };

  const currentExample = calculateExample(50); // 50 orders/month average

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            💰 Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Choose the plan that works best for your restaurant
          </p>

          {/* Current Plan Info */}
          <div className="inline-block bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Check size={20} />
              <span className="font-semibold">Current Plan</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {plans[selectedPlan].name}
            </div>
            <div className="text-gray-600 text-sm">
              Your monthly cost based on ~50 orders:
            </div>
            <div className="text-xl font-bold text-gray-900 mt-2">
              ${(currentExample.subscriptionFee + currentExample.commissionFee).toFixed(2)}/month
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`rounded-lg shadow-md overflow-hidden cursor-pointer transition transform hover:scale-105 ${
                selectedPlan === key
                  ? `ring-4 ring-${plan.color}-500 bg-white`
                  : 'bg-white hover:shadow-lg'
              } ${plan.popular ? 'ring-4 ring-purple-500 relative' : ''}`}
            >
              {plan.popular && (
                <div className="bg-purple-600 text-white text-xs font-bold py-1 text-center">
                  MOST POPULAR
                </div>
              )}

              <div className={`bg-gradient-to-br from-${plan.color}-50 to-${plan.color}-100 p-6 border-b border-${plan.color}-200`}>
                <h3 className={`text-xl font-bold text-${plan.color}-900 mb-1`}>
                  {plan.name}
                </h3>
                <p className={`text-sm text-${plan.color}-700 mb-3`}>
                  {plan.description}
                </p>

                <div className="space-y-1 text-sm">
                  {plan.monthlyFee === null ? (
                    <div className="text-lg font-bold text-gray-900">Custom</div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        ${plan.monthlyFee}/mo
                      </div>
                      <div className="text-gray-600">
                        + ${plan.commissionPerOrder.toFixed(2)}/order
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6">
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition mb-4 ${
                    selectedPlan === key
                      ? `bg-${plan.color}-600 text-white hover:bg-${plan.color}-700`
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {key === 'enterprise' ? 'Contact Sales' : 'Select'}
                </button>

                <ul className="space-y-2 text-sm">
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-gray-500 text-xs font-semibold">
                      +{plan.features.length - 4} more
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Calculator */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💹 Revenue Calculator</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calculator */}
            <div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estimated Orders/Month
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    defaultValue="50"
                    onChange={(e) => {
                      // Update calculations (for demo)
                    }}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600 mt-1">~50 orders/month</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Average Order Value
                  </label>
                  <div className="text-2xl font-bold text-gray-900">$30</div>
                  <div className="text-sm text-gray-600">Market average</div>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Total Revenue (50 orders × $30)</span>
                <span className="font-bold text-gray-900">${currentExample.revenue}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-l-4 border-red-200">
                <span className="text-gray-700">Stripe Fee (2.9% + $0.30)</span>
                <span className="font-bold text-red-600">-${currentExample.stripeFee}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-200">
                <span className="text-gray-700">Monthly Subscription</span>
                <span className="font-bold text-orange-600">
                  -${currentExample.subscriptionFee}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-l-4 border-purple-200">
                <span className="text-gray-700">FoodHub Commission</span>
                <span className="font-bold text-purple-600">-${currentExample.commissionFee}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-300 mt-4">
                <span className="font-semibold text-gray-900">Your Profit</span>
                <span className="text-2xl font-bold text-green-600">
                  ${currentExample.profit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">📊 Feature Comparison</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    Starter
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    Plus
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    Professional
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Menu Items', starter: '✓', plus: '✓', pro: '✓', enterprise: '✓' },
                  { name: 'Order Management', starter: '✓', plus: '✓', pro: '✓', enterprise: '✓' },
                  { name: 'Delivery Fee Configuration', starter: '✓', plus: '✓', pro: '✓', enterprise: '✓' },
                  { name: 'Email Notifications', starter: '✓', plus: '✓', pro: '✓', enterprise: '✓' },
                  { name: 'SMS Notifications', starter: '-', plus: '✓', pro: '✓', enterprise: '✓' },
                  { name: 'Priority Support', starter: '-', plus: '✓', pro: '✓', enterprise: '✓' },
                  { name: 'Phone Support', starter: '-', plus: '-', pro: '✓', enterprise: '✓' },
                  { name: 'API Access', starter: '-', plus: '-', pro: '✓', enterprise: '✓' },
                  { name: 'Multi-location', starter: '-', plus: '-', pro: '✓', enterprise: '✓' },
                  { name: 'Dedicated Manager', starter: '-', plus: '-', pro: '-', enterprise: '✓' },
                ].map((feature, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {feature.name}
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-600">
                      {feature.starter}
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-600">
                      {feature.plus}
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-600">
                      {feature.pro}
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-600">
                      {feature.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">❓ FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes! Upgrade or downgrade your plan anytime. Changes take effect on your next billing cycle.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, Amex) and bank transfers for annual plans.',
              },
              {
                q: 'Is there a setup fee?',
                a: 'No setup fees! You only pay the monthly subscription and per-order commission.',
              },
              {
                q: 'What if I exceed my plan limits?',
                a: 'Starter plan orders beyond 100/month automatically upgrade to Plus pricing.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
