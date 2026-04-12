const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');
const Banner = require('./models/bannerModel');

dotenv.config();

const categories = [
  {
    name: 'Birthday',
    description: 'Make their special day even more sweet with our custom birthday cakes.',
    image: { url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Wedding',
    description: 'Elegant multi-tier cakes for your most unforgettable moment.',
    image: { url: 'https://images.unsplash.com/photo-15a3151419747-081642225d3a?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Anniversary',
    description: 'Celebrate your journey together with a romantic cake.',
    image: { url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Custom',
    description: 'You dream it, we bake it. Fully personalized designs.',
    image: { url: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Cupcake',
    description: 'Bite-sized delights for every mood.',
    image: { url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800' }
  }
];

const banners = [
  {
    title: 'Freshly Baked Happiness',
    subtitle: 'Handcrafted masterpieces delivered to your doorstep. Every bite is a celebration.',
    image: { url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1200' },
    link: '/products',
    order: 1
  },
  {
    title: 'Anniversary Special',
    subtitle: 'Save 20% on all chocolate and velvet collections this weekend.',
    image: { url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=1200' },
    link: '/products',
    order: 2
  }
];

const seedDB = async () => {
  try {
    const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/cake-store';
    await mongoose.connect(DB);
    console.log('DB Connection successful for seeding');

    // Clear existing data
    await Category.deleteMany({});
    await Banner.deleteMany({});

    // Insert new data
    await Category.insertMany(categories);
    await Banner.insertMany(banners);

    console.log('Seeding successful!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
