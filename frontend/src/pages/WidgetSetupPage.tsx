import { useState } from 'react';
import { Copy, Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WidgetSetupPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const restaurantId = 'rest_demo_123'; // Would come from auth context
  const restaurantName = 'Pizza Palace';

  const embedCode = `<!-- FoodHub Ordering Widget -->
<script src="https://foodhub.com/widget.js"></script>
<div id="foodhub-widget" data-restaurant-id="${restaurantId}"></div>`;

  const iframeCode = `<!-- Alternative: Full Page Iframe -->
<iframe 
  src="https://foodhub.com/?restaurant=${restaurantId}&widget=true"
  width="100%"
  height="600"
  style="border: none; border-radius: 8px;"
></iframe>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔗 Widget Setup
          </h1>
          <p className="text-gray-600">
            Embed the FoodHub ordering system on your restaurant website
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold mb-1">Restaurant ID</h3>
            <p className="text-sm text-gray-600">{restaurantId}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-2">🛍️</div>
            <h3 className="font-semibold mb-1">Widget URL</h3>
            <p className="text-sm text-gray-600">https://foodhub.com/widget.js</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-2">⭐</div>
            <h3 className="font-semibold mb-1">Plan</h3>
            <p className="text-sm text-gray-600">Pro - $99/month</p>
          </div>
        </div>

        {/* Embed Options */}
        <div className="space-y-8">
          {/* Option 1: Button Widget */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200">
              <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <Settings size={24} />
                Option 1: Embed Button Widget (Recommended)
              </h2>
              <p className="text-blue-700 mt-2">
                Adds a beautiful "Order Now" button to your website. Clicking opens our ordering interface in a modal.
              </p>
            </div>

            <div className="p-6">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                <pre>{embedCode}</pre>
              </div>

              <button
                onClick={() => copyToClipboard(embedCode)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Copy size={18} />
                {copied ? 'Copied!' : 'Copy Code'}
              </button>

              {/* Preview */}
              <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold mb-3">Preview:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <button className="w-full md:w-72 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105">
                    🍔 Order from {restaurantName}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">📝 How to use:</h3>
                <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
                  <li>Copy the code above</li>
                  <li>Paste it into your website HTML (after the &lt;body&gt; tag)</li>
                  <li>The button will appear automatically</li>
                  <li>Clicking the button opens the ordering modal</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Option 2: Iframe */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-purple-200">
              <h2 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
                <Settings size={24} />
                Option 2: Full Page Iframe
              </h2>
              <p className="text-purple-700 mt-2">
                Embeds the full ordering page directly on your website.
              </p>
            </div>

            <div className="p-6">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                <pre>{iframeCode}</pre>
              </div>

              <button
                onClick={() => copyToClipboard(iframeCode)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Copy size={18} />
                {copied ? 'Copied!' : 'Copy Code'}
              </button>

              {/* Instructions */}
              <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">📝 How to use:</h3>
                <ol className="list-decimal list-inside text-purple-800 space-y-1 text-sm">
                  <li>Copy the code above</li>
                  <li>Paste it into your website HTML where you want the ordering page to appear</li>
                  <li>Adjust width/height as needed</li>
                  <li>The full ordering interface will load</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Widget Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold">Responsive Design</h3>
                  <p className="text-sm text-gray-600">Works perfectly on desktop, tablet, and mobile</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold">Secure Payments</h3>
                  <p className="text-sm text-gray-600">Stripe integration with PCI compliance</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold">Real-time Orders</h3>
                  <p className="text-sm text-gray-600">Orders appear instantly in your dashboard</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold">Custom Branding</h3>
                  <p className="text-sm text-gray-600">Match your restaurant's colors and style</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold">Easy Installation</h3>
                  <p className="text-sm text-gray-600">No coding required - just copy and paste</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold">Analytics</h3>
                  <p className="text-sm text-gray-600">Track orders, revenue, and customer data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Example Sites */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border border-green-200">
            <h2 className="text-2xl font-bold text-green-900 mb-4">🌐 Examples</h2>
            <div className="space-y-3 text-green-800">
              <p>
                <strong>WordPress:</strong> Paste code into a Custom HTML block
              </p>
              <p>
                <strong>Shopify:</strong> Add to your theme in the footer or custom section
              </p>
              <p>
                <strong>Wix:</strong> Add an Embed code element
              </p>
              <p>
                <strong>Squarespace:</strong> Insert as a Code block
              </p>
              <p>
                <strong>Custom HTML:</strong> Paste anywhere you want the widget to appear
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">📞 Need Help?</h3>
          <p className="text-yellow-800">
            Email us at <strong>support@foodhub.com</strong> or call <strong>1-800-FOODHUB</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
