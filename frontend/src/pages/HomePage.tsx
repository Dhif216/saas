import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import RestaurantCard from '@/components/RestaurantCard';
import { restaurantService } from '@/services/restaurantService';
import type { Restaurant } from '@/types';

const HomePage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getRestaurants();
        console.log('Raw fetched restaurants:', data);
        console.log('Mapped cuisines:', data?.map(r => ({ name: r.name, cuisine: r.cuisine })));
        if (Array.isArray(data)) {
          setRestaurants(data);
          setFilteredRestaurants(data);
        } else {
          console.error('Data is not an array:', data);
          setRestaurants([]);
          setFilteredRestaurants([]);
        }
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        setRestaurants([]);
        setFilteredRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    let filtered = restaurants;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Cuisine filter
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter((r) =>
        (r.cuisine || []).includes(selectedCuisine)
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedCuisine, restaurants]);

  const cuisines = Array.from(
    new Set(restaurants.flatMap((r) => r.cuisine || []))
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-orange-500 text-white py-12">
        <div className="container-max">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Order Food Online
          </h1>
          <p className="text-lg mb-6 opacity-90">
            Discover the best food from your favorite restaurants
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-4 text-dark">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search restaurants or food..."
                className="input-field border-0 flex-1 focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 text-dark">
              <MapPin size={20} />
              <input
                type="text"
                placeholder="Your location"
                className="input-field border-0 flex-1 focus:ring-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container-max py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCuisine('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition ${
                selectedCuisine === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition ${
                  selectedCuisine === cuisine
                    ? 'bg-primary text-white'
                    : 'bg-light text-dark hover:bg-gray-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="py-12">
        <div className="container-max">
          {loading ? (
            <div className="flex items-center justify-center min-h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-dark">
                Available Restaurants
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No restaurants found</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-light py-12">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FoodHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your food delivered in 30 minutes or less
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-bold text-xl mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Your payment information is safe and secure
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="font-bold text-xl mb-2">Best Quality</h3>
              <p className="text-gray-600">
                Food from trusted and verified restaurants
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
