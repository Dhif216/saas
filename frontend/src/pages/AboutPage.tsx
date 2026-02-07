import React from 'react';
import { Heart, Users, Zap, TrendingUp } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-orange-500 text-white py-16 px-4">
        <div className="container-max">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About FoodHub</h1>
          <p className="text-xl opacity-90">Connecting hungry customers with amazing restaurants</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-dark mb-8 text-center">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-700 text-lg mb-4">
                FoodHub is revolutionizing the way people discover and order food. We believe that great food should be accessible to everyone, and restaurants should have the tools to reach more customers.
              </p>
              <p className="text-gray-700 text-lg mb-4">
                Founded in 2024, FoodHub has grown to serve thousands of customers and hundreds of restaurants across the region. Our platform makes it easy for diners to find their favorite cuisines and for restaurants to manage their orders efficiently.
              </p>
              <p className="text-gray-700 text-lg">
                We're committed to excellence, innovation, and creating value for both our customers and restaurant partners.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=400&fit=crop"
              alt="FoodHub Mission"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-dark mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Quality</h3>
              <p className="text-gray-600">We partner only with high-quality restaurants that meet our standards</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Community</h3>
              <p className="text-gray-600">We build a community of food lovers and supportive restaurant partners</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Innovation</h3>
              <p className="text-gray-600">We continuously improve our platform with cutting-edge technology</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Growth</h3>
              <p className="text-gray-600">We help restaurants grow their business and reach new customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-dark mb-12 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-gray-600">Restaurants</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <p className="text-gray-600">Orders Delivered</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience FoodHub?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers discovering great food every day</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/" className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
              Order Now
            </a>
            <a href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-primary transition">
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
