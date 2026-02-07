import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-max flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">🍔</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline text-primary">FoodHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-dark hover:text-primary transition">
            Home
          </Link>
          <Link to="/about" className="text-dark hover:text-primary transition">
            About Us
          </Link>
          <Link to="/contact" className="text-dark hover:text-primary transition">
            Contact
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Dashboard Link for Restaurant Owners */}
          {isAuthenticated && user?.role === 'restaurant' && (
            <Link to="/dashboard" className="text-dark hover:text-primary transition font-medium hidden sm:block">
              📊 Dashboard
            </Link>
          )}

          {/* Cart */}
          <Link to="/checkout" className="relative text-dark hover:text-primary transition">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-dark">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-dark hover:text-primary transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Link to="/login" className="btn-outline text-sm">
                Login
              </Link>
              <Link to="/signup" className="btn-primary text-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-light border-t border-gray-200 p-4">
          <nav className="flex flex-col gap-4">
            <Link to="/" className="text-dark hover:text-primary transition">
              Home
            </Link>
            <Link to="/about" className="text-dark hover:text-primary transition">
              About Us
            </Link>
            <Link to="/contact" className="text-dark hover:text-primary transition">
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'restaurant' && (
                  <Link to="/dashboard" className="text-dark hover:text-primary transition font-medium">
                    📊 Dashboard
                  </Link>
                )}
                <Link to="/profile" className="text-dark hover:text-primary transition flex items-center gap-2">
                  <User size={16} />
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-left text-dark hover:text-primary transition">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="btn-outline text-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
