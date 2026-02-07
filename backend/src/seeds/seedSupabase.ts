import bcrypt from 'bcryptjs';
import { supabase } from '../db/supabase';

export async function seedSupabase() {
  try {
    console.log('📌 Starting database initialization...');
    
    // Note: Cuisine mapping is handled in frontend restaurantService.ts
    // Database schema doesn't have cuisine column - using frontend workaround
    
    console.log('✨ Database ready!');

    // Hash passwords
    const customerPassword = await bcrypt.hash('Test@12345', 10);
    const restaurantPassword = await bcrypt.hash('Test@12345', 10);

    // Check if users already exist
    let customerUser, restaurant1User, restaurant2User;
    
    const { data: existingCustomer } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'customer@test.com')
      .single();
    
    if (existingCustomer) {
      console.log('✅ User already exists: customer@test.com');
      customerUser = existingCustomer;
    } else {
      // Create customer user
      const { data, error: customerError } = await supabase
        .from('users')
        .insert([
          {
            email: 'customer@test.com',
            password_hash: customerPassword,
            role: 'customer',
            name: 'Test Customer',
            phone: '555-0001',
          },
        ])
        .select()
        .single();

      if (customerError) throw customerError;
      customerUser = data;
      console.log('✅ Added user: customer@test.com (customer)');
    }

    const { data: existingRest1 } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'restaurant@test.com')
      .single();
    
    if (existingRest1) {
      console.log('✅ User already exists: restaurant@test.com');
      restaurant1User = existingRest1;
    } else {
      const { data, error: rest1Error } = await supabase
        .from('users')
        .insert([
          {
            email: 'restaurant@test.com',
            password_hash: restaurantPassword,
            role: 'restaurant',
            name: 'Restaurant Owner 1',
            phone: '555-1001',
          },
        ])
        .select()
        .single();

      if (rest1Error) throw rest1Error;
      restaurant1User = data;
      console.log('✅ Added user: restaurant@test.com (restaurant)');
    }

    const { data: existingRest2 } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'burger@test.com')
      .single();
    
    if (existingRest2) {
      console.log('✅ User already exists: burger@test.com');
      restaurant2User = existingRest2;
    } else {
      const { data, error: rest2Error } = await supabase
        .from('users')
        .insert([
          {
            email: 'burger@test.com',
            password_hash: restaurantPassword,
            role: 'restaurant',
            name: 'Burger Owner',
            phone: '555-1002',
          },
        ])
        .select()
        .single();

      if (rest2Error) throw rest2Error;
      restaurant2User = data;
      console.log('✅ Added user: burger@test.com (restaurant)');
    }

    // Create restaurants
    const restaurants = [
      {
        user_id: restaurant1User.id,
        name: 'Pizza Palace',
        description: 'Authentic Italian pizza',
        image_url: 'https://images.unsplash.com/photo-1614707267537-b85faf00021c?w=400',
        plan: 'pro',
      },
      {
        user_id: restaurant2User.id,
        name: 'Burger Barn',
        description: 'Juicy burgers and fries',
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        plan: 'classic',
      },
      {
        user_id: null,
        name: 'Sushi Express',
        description: 'Fresh sushi daily',
        image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        plan: 'pro',
      },
      {
        user_id: null,
        name: 'Taco Fiesta',
        description: 'Authentic Mexican tacos',
        image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
        plan: 'classic',
      },
      {
        user_id: null,
        name: 'Curry House',
        description: 'Spicy Indian cuisine',
        image_url: 'https://images.unsplash.com/photo-1585238341710-4dd83c28db47?w=400',
        plan: 'silver',
      },
    ];

    // Check if restaurants already exist
    const { data: existingRestaurants } = await supabase
      .from('restaurants')
      .select('*');

    let createdRestaurants = existingRestaurants || [];

    if (!existingRestaurants || existingRestaurants.length === 0) {
      const { data, error: restaurantError } = await supabase
        .from('restaurants')
        .insert(restaurants)
        .select();

      if (restaurantError) throw restaurantError;
      createdRestaurants = data || [];
    }

    createdRestaurants?.forEach((r) => {
      console.log(`✅ Restaurant: ${r.name}`);
    });

    // Create menu items
    const menuItems = [
      // Pizza Palace
      {
        restaurant_id: createdRestaurants?.[0]?.id,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato, mozzarella, and basil',
        price: 12.99,
        category: 'Pizza',
        image_url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[0]?.id,
        name: 'Pepperoni Pizza',
        description: 'Pizza with pepperoni and cheese',
        price: 13.99,
        category: 'Pizza',
        image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[0]?.id,
        name: 'Caesar Salad',
        description: 'Fresh greens with parmesan and croutons',
        price: 8.99,
        category: 'Salads',
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[0]?.id,
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter',
        price: 4.99,
        category: 'Appetizers',
        image_url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64bed?w=400',
      },
      // Burger Barn
      {
        restaurant_id: createdRestaurants?.[1]?.id,
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and onion',
        price: 9.99,
        category: 'Burgers',
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[1]?.id,
        name: 'Bacon Burger',
        description: 'Burger with crispy bacon and cheddar',
        price: 11.99,
        category: 'Burgers',
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[1]?.id,
        name: 'French Fries',
        description: 'Crispy golden fries',
        price: 3.99,
        category: 'Sides',
        image_url: 'https://images.unsplash.com/photo-1585238341710-4dd83c28db47?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[1]?.id,
        name: 'Milkshake',
        description: 'Creamy vanilla milkshake',
        price: 4.99,
        category: 'Beverages',
        image_url: 'https://images.unsplash.com/photo-1553530666-ba2a8e36cd12?w=400',
      },
      // Sushi Express
      {
        restaurant_id: createdRestaurants?.[2]?.id,
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber',
        price: 8.99,
        category: 'Rolls',
        image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[2]?.id,
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over rice (6 pieces)',
        price: 9.99,
        category: 'Nigiri',
        image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[2]?.id,
        name: 'Spicy Tuna Roll',
        description: 'Tuna with spicy mayo',
        price: 8.49,
        category: 'Rolls',
        image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[2]?.id,
        name: 'Edamame',
        description: 'Steamed soybeans with salt',
        price: 4.99,
        category: 'Appetizers',
        image_url: 'https://images.unsplash.com/photo-1582054594407-e3a3ed1e6e84?w=400',
      },
      // Taco Fiesta
      {
        restaurant_id: createdRestaurants?.[3]?.id,
        name: 'Beef Tacos',
        description: 'Two soft tacos with seasoned beef (3)',
        price: 7.99,
        category: 'Tacos',
        image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[3]?.id,
        name: 'Chicken Tacos',
        description: 'Two soft tacos with grilled chicken (3)',
        price: 7.99,
        category: 'Tacos',
        image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[3]?.id,
        name: 'Fish Tacos',
        description: 'Two battered fish tacos with cabbage slaw',
        price: 8.99,
        category: 'Tacos',
        image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[3]?.id,
        name: 'Guacamole & Chips',
        description: 'Fresh guacamole with crispy tortilla chips',
        price: 5.99,
        category: 'Appetizers',
        image_url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64bed?w=400',
      },
      // Curry House
      {
        restaurant_id: createdRestaurants?.[4]?.id,
        name: 'Chicken Tikka Masala',
        description: 'Tender chicken in creamy tomato sauce',
        price: 13.99,
        category: 'Curries',
        image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[4]?.id,
        name: 'Butter Chicken',
        description: 'Chicken in a rich buttery sauce',
        price: 12.99,
        category: 'Curries',
        image_url: 'https://images.unsplash.com/photo-1585238341710-4dd83c28db47?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[4]?.id,
        name: 'Lamb Biryani',
        description: 'Fragrant rice with tender lamb',
        price: 14.99,
        category: 'Rice Dishes',
        image_url: 'https://images.unsplash.com/photo-1585238341710-4dd83c28db47?w=400',
      },
      {
        restaurant_id: createdRestaurants?.[4]?.id,
        name: 'Naan Bread',
        description: 'Traditional Indian flatbread',
        price: 2.99,
        category: 'Breads',
        image_url: 'https://images.unsplash.com/photo-1585238341710-4dd83c28db47?w=400',
      },
    ];

    const { error: menuError } = await supabase
      .from('menu_items')
      .insert(menuItems);

    if (menuError) throw menuError;

    // Group by restaurant and log
    createdRestaurants?.forEach((restaurant) => {
      const count = menuItems.filter((m) => m.restaurant_id === restaurant.id).length;
      console.log(`✅ Added ${count} menu items for ${restaurant.name}`);
    });

    console.log('');
    console.log('📝 TEST LOGIN CREDENTIALS:');
    console.log('   Customer:');
    console.log('   - Email: customer@test.com');
    console.log('   - Password: Test@12345');
    console.log('');
    console.log('   Restaurant Owner (Pizza Palace):');
    console.log('   - Email: restaurant@test.com');
    console.log('   - Password: Test@12345');
    console.log('');
    console.log('   Restaurant Owner (Burger Barn):');
    console.log('   - Email: burger@test.com');
    console.log('   - Password: Test@12345');
    console.log('');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
