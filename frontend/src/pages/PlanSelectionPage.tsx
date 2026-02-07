import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface SelectedPlan {
  id: 'classic' | 'pro' | 'silver';
  name: string;
  price: number;
}

const PlanSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const plans: SelectedPlan[] = [
    {
      id: 'classic',
      name: 'Classic',
      price: 9.99,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29.99,
    },
    {
      id: 'silver',
      name: 'Silver',
      price: 49.99,
    },
  ];

  const features = {
    classic: [
      'Up to 50 menu items',
      'Basic analytics',
      'Email support',
      'Standard commission rate (30%)',
      'Mobile app access',
    ],
    pro: [
      'Up to 200 menu items',
      'Advanced analytics & insights',
      'Priority email & chat support',
      'Reduced commission rate (25%)',
      'Mobile app + API access',
      'Promotional tools',
      'Custom branding',
    ],
    silver: [
      'Unlimited menu items',
      'Real-time advanced analytics',
      '24/7 Phone + priority support',
      'Lowest commission rate (20%)',
      'Mobile app + API access',
      'Promotional tools & campaigns',
      'Custom branding & white-label',
      'Dedicated account manager',
      'Integration with POS systems',
    ],
  };

  const handleSelectPlan = (plan: SelectedPlan) => {
    navigate('/signup', {
      state: {
        selectedPlan: plan,
        initialRole: 'restaurant',
      },
    });
  };

  return (
    <div className="min-h-screen bg-light py-16 px-4">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-dark mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Select the perfect plan for your restaurant. You can upgrade or downgrade anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card p-8 flex flex-col ${
                plan.id === 'pro'
                  ? 'ring-2 ring-primary md:scale-105 relative'
                  : ''
              }`}
            >
              {plan.id === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-dark mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-primary">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>

              {/* Features List */}
              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {features[plan.id].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check
                        size={20}
                        className="text-green-500 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                  plan.id === 'pro'
                    ? 'bg-primary text-white hover:bg-orange-600'
                    : 'bg-gray-200 text-dark hover:bg-gray-300'
                }`}
              >
                Get Started
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="card p-8 mb-12">
          <h3 className="text-2xl font-bold text-dark mb-6">Plan Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-dark">Feature</th>
                  <th className="text-center py-3 px-4 font-bold text-dark">Classic</th>
                  <th className="text-center py-3 px-4 font-bold text-dark">Pro</th>
                  <th className="text-center py-3 px-4 font-bold text-dark">Silver</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Menu Items</td>
                  <td className="text-center py-3 px-4">50</td>
                  <td className="text-center py-3 px-4">200</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Commission Rate</td>
                  <td className="text-center py-3 px-4">30%</td>
                  <td className="text-center py-3 px-4">25%</td>
                  <td className="text-center py-3 px-4">20%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Analytics</td>
                  <td className="text-center py-3 px-4">Basic</td>
                  <td className="text-center py-3 px-4">Advanced</td>
                  <td className="text-center py-3 px-4">Real-time</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Support</td>
                  <td className="text-center py-3 px-4">Email</td>
                  <td className="text-center py-3 px-4">Email & Chat</td>
                  <td className="text-center py-3 px-4">24/7 Phone</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Custom Branding</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Account Manager</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="card p-8">
          <h3 className="text-2xl font-bold text-dark mb-6">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-dark mb-2">Can I change plans later?</h4>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-dark mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and digital payment methods.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-dark mb-2">Is there a setup fee?</h4>
              <p className="text-gray-600">
                No! There are no hidden fees or setup costs. You only pay the monthly subscription rate.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-dark mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600">
                Yes, you can cancel your plan anytime. No questions asked, no cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionPage;
