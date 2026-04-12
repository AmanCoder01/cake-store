const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/productModel');
const User = require('../models/userModel');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const products = [
  {
    name: 'Strawberry Velvet Fantasy',
    description: 'A moist strawberry sponge layered with cream cheese frosting and topped with fresh organic strawberries.',
    price: 45.00,
    category: 'Birthday',
    stock: 15,
    ratingsAverage: 4.8,
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=600' }]
  },
  {
    name: 'Midnight Chocolate Truffle',
    description: 'Rich dark chocolate cake with smooth chocolate ganache and truffle decorations.',
    price: 55.00,
    category: 'Anniversary',
    stock: 10,
    ratingsAverage: 4.9,
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600' }]
  },
  {
    name: 'Vanilla Sky Wedding Cake',
    description: 'Three-tiered classic vanilla cake with elegant buttercream floral designs.',
    price: 180.00,
    category: 'Wedding',
    stock: 5,
    ratingsAverage: 4.7,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-15a3151419747-081642225d3a?auto=format&fit=crop&q=80&w=600' }]
  },
  {
    name: 'Caramel Macchiato Cupcakes',
    description: 'Set of 6 coffee-infused cupcakes with salted caramel drizzle.',
    price: 24.00,
    category: 'Cupcake',
    stock: 30,
    ratingsAverage: 4.6,
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600' }]
  },
  {
    name: 'Rainbow Birthday Surprise',
    description: 'Colorful multi-layered cake with vanilla frosting and rainbow sprinkles.',
    price: 65.00,
    category: 'Birthday',
    stock: 12,
    ratingsAverage: 4.5,
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=600' }]
  }
];

const seedDB = async () => {
  try {
    const DB = process.env.MONGODB_URI;
    console.log("DB", DB);

    await mongoose.connect(DB);

    // Delete existing data
    await Product.deleteMany();
    console.log('Products deleted');

    // Check if admin exists, if not create
    const adminExists = await User.findOne({ email: 'admin@cakestore.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@cakestore.com',
        password: 'password123', // Will be hashed by pre-save
        role: 'admin'
      });
      console.log('Admin user created');
    }

    // Insert new data
    await Product.insertMany(products);
    console.log('Products seeded');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
