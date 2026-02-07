import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onSubmit: (paymentData: PaymentFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface PaymentFormData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  email: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.cardName.trim()) {
      setError('Cardholder name is required');
      return false;
    }
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits');
      return false;
    }
    if (formData.expiry.length !== 5) {
      setError('Expiry date must be in MM/YY format');
      return false;
    }
    if (formData.cvc.length < 3) {
      setError('CVC must be 3-4 digits');
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
        <CreditCard size={28} className="text-primary" />
        Payment Details
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold">✅ Payment processed successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            placeholder="John Doe"
            className="input-field"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="input-field"
            required
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="input-field font-mono"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Test: 4242 4242 4242 4242</p>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength={5}
              className="input-field font-mono"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Test: 12/25</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              CVC
            </label>
            <input
              type="text"
              name="cvc"
              value={formData.cvc}
              onChange={handleChange}
              placeholder="123"
              maxLength={4}
              className="input-field font-mono"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Test: 123</p>
          </div>
        </div>

        {/* Security Info */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <Lock size={16} />
          <span>Your payment is secure and encrypted</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>

        {/* Test Info */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
          <strong>Demo Mode:</strong> Use test card 4242 4242 4242 4242 with any future date
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
