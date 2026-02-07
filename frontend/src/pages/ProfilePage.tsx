import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-max max-w-2xl">
        {/* Header */}
        <div className="card p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-dark">{user?.name}</h1>
              <p className="text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="btn-outline text-red-600 border-red-600 flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Profile Info */}
        <div className="card p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark">Personal Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2 flex items-center gap-2">
                  <User size={18} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2 flex items-center gap-2">
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="input-field bg-gray-100"
                />
                <p className="text-sm text-gray-600 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2 flex items-center gap-2">
                  <Phone size={18} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
                  <MapPin size={18} />
                  Address
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="text-dark">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <p className="text-dark">{user?.phone || 'Not provided'}</p>
              </div>

              {user?.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">Address</label>
                  <p className="text-dark">
                    {user.address.street}, {user.address.city}, {user.address.state} {user.address.zipCode}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-dark mb-6">Account Settings</h2>
          <div className="space-y-4">
            <button className="w-full text-left p-4 border rounded-lg hover:bg-light transition">
              <p className="font-semibold text-dark">Change Password</p>
              <p className="text-sm text-gray-600">Update your password</p>
            </button>

            <button className="w-full text-left p-4 border rounded-lg hover:bg-light transition">
              <p className="font-semibold text-dark">Payment Methods</p>
              <p className="text-sm text-gray-600">Manage your saved cards</p>
            </button>

            <button className="w-full text-left p-4 border rounded-lg hover:bg-light transition">
              <p className="font-semibold text-dark">Notifications</p>
              <p className="text-sm text-gray-600">Control notification preferences</p>
            </button>

            <button className="w-full text-left p-4 border rounded-lg hover:bg-light transition">
              <p className="font-semibold text-dark">Privacy & Security</p>
              <p className="text-sm text-gray-600">Manage your privacy settings</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
