/**
 * FoodHub Restaurant Widget
 * Embed this on your restaurant website to take orders
 * 
 * Usage:
 * <script src="https://foodhub.com/widget.js"></script>
 * <div id="foodhub-widget" data-restaurant-id="your_restaurant_id"></div>
 */

(function() {
  'use strict';

  const FOODHUB_URL = 'http://localhost:3000'; // Production: https://foodhub.com
  const FOODHUB_API = 'http://localhost:5000'; // Production: https://api.foodhub.com

  class FoodHubWidget {
    constructor() {
      this.widget = document.getElementById('foodhub-widget');
      
      if (!this.widget) {
        console.error('FoodHub Widget: #foodhub-widget element not found');
        return;
      }

      this.restaurantId = this.widget.getAttribute('data-restaurant-id');
      
      if (!this.restaurantId) {
        console.error('FoodHub Widget: data-restaurant-id not provided');
        return;
      }

      this.init();
    }

    init() {
      // Create container
      this.container = document.createElement('div');
      this.container.id = 'foodhub-widget-container';
      this.container.style.cssText = `
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;

      // Create button to open modal
      const btn = document.createElement('button');
      btn.id = 'foodhub-order-btn';
      btn.textContent = '🍔 Order Now';
      btn.style.cssText = `
        background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
      `;

      btn.onmouseover = () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.4)';
      };

      btn.onmouseout = () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.3)';
      };

      btn.onclick = () => this.openModal();

      this.container.appendChild(btn);
      this.widget.appendChild(this.container);

      // Load restaurant info
      this.loadRestaurantInfo();
    }

    async loadRestaurantInfo() {
      try {
        const response = await fetch(`${FOODHUB_API}/api/restaurants/${this.restaurantId}`);
        const data = await response.json();
        
        if (data.restaurant) {
          this.restaurant = data.restaurant;
          this.updateButton();
        }
      } catch (error) {
        console.error('FoodHub Widget: Error loading restaurant', error);
      }
    }

    updateButton() {
      const btn = document.getElementById('foodhub-order-btn');
      if (btn && this.restaurant) {
        btn.textContent = `🍔 Order from ${this.restaurant.name}`;
      }
    }

    openModal() {
      // Create modal
      const modal = document.createElement('div');
      modal.id = 'foodhub-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;

      // Create modal content
      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 800px;
        height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      `;

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = `
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        z-index: 10001;
      `;
      closeBtn.onclick = () => this.closeModal();

      content.appendChild(closeBtn);

      // Iframe with FoodHub ordering page
      const iframe = document.createElement('iframe');
      iframe.src = `${FOODHUB_URL}?restaurant=${this.restaurantId}&widget=true`;
      iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 12px;
      `;

      content.appendChild(iframe);
      modal.appendChild(content);
      document.body.appendChild(modal);

      this.currentModal = modal;
    }

    closeModal() {
      if (this.currentModal) {
        this.currentModal.remove();
        this.currentModal = null;
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new FoodHubWidget();
    });
  } else {
    new FoodHubWidget();
  }
})();
