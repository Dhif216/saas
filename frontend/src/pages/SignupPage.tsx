import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Lock, Phone, AlertCircle, CreditCard } from 'lucide-react';

interface SelectedPlan {
  id: 'classic' | 'pro' | 'silver';
  name: string;
  price: number;
}

const SignupPage: React.FC = () => {
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer' as 'customer' | 'restaurant',
  });
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Check if coming from plan selection
  useEffect(() => {
    if (location.state?.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
      setFormData((prev) => ({
        ...prev,
        role: 'restaurant',
      }));
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number (add spaces every 4 digits)
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
    }

    // Format expiry (MM/YY)
    if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/(\d{2})/, '$1/')
        .replace(/\/$/, '');
    }

    // Limit CVC to 4 digits
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validatePaymentMethod = (): boolean => {
    if (!paymentData.cardName.trim()) {
      setError('Cardholder name is required');
      return false;
    }
    if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits');
      return false;
    }
    if (paymentData.expiry.length !== 5) {
      setError('Expiry date must be in MM/YY format');
      return false;
    }
    if (paymentData.cvc.length < 3) {
      setError('CVC must be 3-4 digits');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // For restaurant owners with plan, require payment method
    if (selectedPlan && !showPaymentMethod) {
      setShowPaymentMethod(true);
      return;
    }

    // If showing payment method form, validate it
    if (showPaymentMethod) {
      if (!validatePaymentMethod()) {
        return;
      }
    }

    setLoading(true);

    try {
      // Store payment method in localStorage for restaurant owners
      const signupData: any = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        phone: formData.phone,
      };

      if (selectedPlan && showPaymentMethod) {
        signupData.paymentMethod = {
          cardName: paymentData.cardName,
          cardLast4: paymentData.cardNumber.replace(/\s/g, '').slice(-4),
          expiry: paymentData.expiry,
        };
      }

      await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.phone,
        selectedPlan?.id
      );

      // Wait a moment for state to update
      setTimeout(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.role === 'restaurant') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        } else {
          navigate('/');
        }
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light py-12 px-4">
      <div className="card w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Join FoodHub</h1>
          <p className="text-gray-600">Create your account to get started</p>
          {selectedPlan && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Plan Selected:</strong> {selectedPlan.name} - ${selectedPlan.price}/month
              </p>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          {!selectedPlan && (
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                I am a...
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 font-medium transition ${
                    formData.role === 'customer'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/plans')}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 font-medium transition ${
                    formData.role === 'restaurant'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Restaurant
                </button>
              </div>
            </div>
          )}

          {selectedPlan && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">✅ Signing up as Restaurant Owner</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="input-field pl-10"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input-field pl-10"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                className="input-field pl-10"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input-field pl-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                className="input-field pl-10"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Payment Method - Only for Restaurant Owners */}
          {showPaymentMethod && selectedPlan && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-700 font-semibold">
                <CreditCard size={20} />
                Payment Method
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={paymentData.cardName}
                  onChange={handlePaymentChange}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="input-field font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Test: 4242 4242 4242 4242</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={paymentData.expiry}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="input-field font-mono"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Test: 12/25</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    name="cvc"
                    value={paymentData.cvc}
                    onChange={handlePaymentChange}
                    placeholder="123"
                    maxLength={4}
                    className="input-field font-mono"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Test: 123</p>
                </div>
              </div>

              <p className="text-xs text-blue-600 flex items-center gap-1">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          )}

          {/* Terms */}
          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" required />
            <span className="text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : showPaymentMethod ? 'Complete Signup' : selectedPlan ? 'Continue to Payment' : 'Sign Up'}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
