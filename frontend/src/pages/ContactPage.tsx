import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-orange-500 text-white py-16 px-4">
        <div className="container-max">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl opacity-90">We'd love to hear from you. Get in touch with us today!</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Email</h3>
              <p className="text-gray-600">support@foodhub.com</p>
              <p className="text-gray-600">business@foodhub.com</p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Phone size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-gray-600">Available 24/7</p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Location</h3>
              <p className="text-gray-600">123 Food Street</p>
              <p className="text-gray-600">San Francisco, CA 94102</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-dark mb-6">Send us a Message</h2>
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <div className="text-green-600 flex-shrink-0">✅</div>
                  <div>
                    <p className="text-green-700 font-semibold">Message Sent!</p>
                    <p className="text-green-600 text-sm">Thanks for reaching out. We'll get back to you soon.</p>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more..."
                    rows={5}
                    required
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>

            {/* FAQs */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-dark mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-dark mb-2">How do I place an order?</h3>
                  <p className="text-gray-600 text-sm">
                    Simply browse our restaurant listings, select your favorite restaurant, choose items from their menu, and proceed to checkout.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-dark mb-2">How long does delivery take?</h3>
                  <p className="text-gray-600 text-sm">
                    Delivery times vary by restaurant but typically range from 25-50 minutes. You can see the estimated delivery time before placing your order.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-dark mb-2">Do you offer refunds?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes, we offer refunds for orders that aren't prepared correctly or don't meet our quality standards. Contact support for assistance.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-dark mb-2">How can I become a restaurant partner?</h3>
                  <p className="text-gray-600 text-sm">
                    Interested in partnering with FoodHub? Email us at business@foodhub.com and our team will be in touch within 24 hours.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-dark mb-2">Are there delivery fees?</h3>
                  <p className="text-gray-600 text-sm">
                    Delivery fees vary by restaurant and location. You'll see the total cost, including delivery fees, before checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold mb-6">Can't find what you're looking for?</h2>
          <p className="text-xl mb-8 opacity-90">Check our knowledge base or email us directly at support@foodhub.com</p>
          <a href="/" className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-block">
            Back to Home
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
