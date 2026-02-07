import '@/styles/index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import PlanSelectionPage from '@/pages/PlanSelectionPage';
import RestaurantPage from '@/pages/RestaurantPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderTrackingPage from '@/pages/OrderTrackingPage';
import ProfilePage from '@/pages/ProfilePage';
import RestaurantDashboard from '@/pages/RestaurantDashboard';
import MenuManagement from '@/pages/MenuManagement';
import WidgetSetupPage from '@/pages/WidgetSetupPage';
import WidgetPage from '@/pages/WidgetPage';
import SubscriptionManagement from '@/pages/SubscriptionManagement';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Widget route - standalone, no layout wrapper */}
            <Route path="/widget/:restaurantId" element={<WidgetPage />} />
            
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/plans" element={<PlanSelectionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute requiredRole="customer">
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute requiredRole="customer">
                    <OrderTrackingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="restaurant">
                    <RestaurantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/menu"
                element={
                  <ProtectedRoute requiredRole="restaurant">
                    <MenuManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/widget"
                element={
                  <ProtectedRoute requiredRole="restaurant">
                    <WidgetSetupPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription/:restaurantId"
                element={
                  <ProtectedRoute requiredRole="restaurant">
                    <SubscriptionManagement />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
