import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { menuService } from '@/services/menuService';
import { restaurantService } from '@/services/restaurantService';
import { useToast } from '@/hooks/useToast';
import type { MenuItem, Restaurant } from '@/types';

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main',
    image: '',
    available: true,
  });

  // Load restaurant and menu items on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user's restaurant
        const restaurantData = await restaurantService.getUserRestaurant();
        if (!restaurantData) {
          addToast('Restaurant not found', 'error');
          navigate('/dashboard');
          return;
        }
        
        setRestaurant(restaurantData);
        
        // Fetch menu items for the restaurant
        const items = await menuService.getMenuItems(restaurantData.id);
        setMenuItems(items);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        addToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addToast, navigate]);

  const handleAddItem = async () => {
    if (!formData.name || !formData.price) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    if (!restaurant) {
      addToast('Restaurant not found', 'error');
      return;
    }

    try {
      const newItem = await menuService.createMenuItem(restaurant.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || undefined,
        available: formData.available,
      });
      
      setMenuItems([...menuItems, newItem]);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Main',
        image: '',
        available: true,
      });
      setIsAddingItem(false);
      addToast('Menu item created successfully!', 'success');
    } catch (error) {
      console.error('Create menu item error:', error);
      addToast('Failed to create menu item', 'error');
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image || '',
      available: item.available,
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const updatedItem = await menuService.updateMenuItem(id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        available: formData.available,
      });

      setMenuItems(
        menuItems.map((item) =>
          item.id === id ? updatedItem : item
        )
      );
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Main',
        image: '',
        available: true,
      });
      addToast('Menu item updated successfully!', 'success');
    } catch (error) {
      addToast('Failed to update menu item', 'error');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await menuService.deleteMenuItem(id);
      setMenuItems(menuItems.filter((item) => item.id !== id));
      addToast('Menu item deleted successfully!', 'success');
    } catch (error) {
      addToast('Failed to delete menu item', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-max">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-dark">Menu Management</h1>
          </div>
          {!isAddingItem && !editingId && (
            <button
              onClick={() => setIsAddingItem(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Menu Item
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAddingItem || editingId) && (
          <div className="card p-6 mb-8 bg-white border-2 border-primary">
            <h2 className="text-xl font-bold text-dark mb-4">
              {editingId ? 'Edit Item' : 'Add New Menu Item'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Item Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />

              <input
                type="number"
                placeholder="Price"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input-field"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field md:col-span-2"
                rows={3}
              />

              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                <option>Main</option>
                <option>Pizza</option>
                <option>Appetizers</option>
                <option>Salads</option>
                <option>Desserts</option>
                <option>Beverages</option>
              </select>

              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="input-field"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Available</span>
              </label>
            </div>

            <div className="flex gap-4 mt-6">
              {editingId ? (
                <>
                  <button
                    onClick={() => handleSaveEdit(editingId)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        name: '',
                        description: '',
                        price: '',
                        category: 'Main',
                        image: '',
                        available: true,
                      });
                    }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleAddItem} className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    Add Item
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingItem(false);
                      setFormData({
                        name: '',
                        description: '',
                        price: '',
                        category: 'Main',
                        image: '',
                        available: true,
                      });
                    }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="card overflow-hidden hover:shadow-lg transition">
              {/* Image */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
              )}

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-dark">{item.name}</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={() => {
                        setMenuItems(
                          menuItems.map((i) =>
                            i.id === item.id ? { ...i, available: !i.available } : i
                          )
                        );
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">Available</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-2 text-primary hover:bg-primary/10 rounded transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {menuItems.length === 0 && !isAddingItem && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No menu items yet</p>
            <button
              onClick={() => setIsAddingItem(true)}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Add First Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
