const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');
const Banner = require('./models/bannerModel');
const Product = require('./models/productModel');

dotenv.config();

const categories = [
  {
    name: 'Birthday Cakes',
    slug: 'birthday-cakes',
    description: 'Make every birthday magical with our delightful range of handcrafted cakes.',
    image: { url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Wedding Cakes',
    slug: 'wedding-cakes',
    description: 'Elegant multi-tier masterpieces designed for your most unforgettable moment.',
    image: { url: 'https://images.unsplash.com/photo-15a3151419747-081642225d3a?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Anniversary Cakes',
    slug: 'anniversary-cakes',
    description: 'Celebrate your journey of love with our romantic and premium cake collections.',
    image: { url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Eggless Special',
    slug: 'eggless-special',
    description: 'Deliciously moist and 100% vegetarian cakes for everyone to enjoy.',
    image: { url: 'https://images.unsplash.com/photo-1606913084603-3e75bb77f9e2?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Custom Creations',
    slug: 'custom-creations',
    description: 'You dream it, we bake it. Fully personalized designs for unique celebrations.',
    image: { url: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Exquisite Cupcakes',
    slug: 'exquisite-cupcakes',
    description: 'Bite-sized delights available in a variety of gourmet flavors.',
    image: { url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Artisan Pastries',
    slug: 'artisan-pastries',
    description: 'Flaky, creamy, and perfectly baked pastries for your daily treats.',
    image: { url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Chocolate Decadence',
    slug: 'chocolate-decadence',
    description: 'Rich, dark, and sinful chocolate cakes for the ultimate indulgence.',
    image: { url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }
  }
];

const products = [
  // Birthday Cakes
  {
    name: 'Rainbow Confetti Blast',
    description: 'A colorful surprise inside and out, perfect for kids and the young at heart.',
    price: 35,
    category: 'Birthday Cakes',
    stock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800' }],
    isFeatured: true
  },
  {
    name: 'Golden Glow Birthday',
    description: 'Elegant vanilla cake with metallic gold accents for a touch of luxury.',
    price: 45,
    category: 'Birthday Cakes',
    stock: 5,
    images: [{ url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Superhero Adventure Cake',
    description: 'Fuel their imagination with our custom-themed superhero birthday cake.',
    price: 55,
    category: 'Birthday Cakes',
    stock: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Strawberry Dream Tower',
    description: 'Layers of fresh strawberries and cream, light and refreshing.',
    price: 32,
    category: 'Birthday Cakes',
    stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Chocolate Overload Birthday',
    description: 'Six layers of rich chocolate because one can never have enough chocolate.',
    price: 40,
    category: 'Birthday Cakes',
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }],
    isTrending: true
  },

  // Wedding Cakes
  {
    name: 'White Lace Elegance',
    description: 'Traditional 3-tier wedding cake with intricate lace-pattern icing.',
    price: 250,
    category: 'Wedding Cakes',
    stock: 2,
    images: [{ url: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Modern Marble Tiers',
    description: 'Sleek geometric design with a stunning grey and white marble finish.',
    price: 280,
    category: 'Wedding Cakes',
    stock: 2,
    images: [{ url: 'https://images.unsplash.com/photo-1522765181514-4aedaf6264f1?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Rustic Floral Cascade',
    description: 'Boho-chic naked cake adorned with fresh seasonal flowers.',
    price: 180,
    category: 'Wedding Cakes',
    stock: 3,
    images: [{ url: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Royal Gold & Ivory',
    description: 'Majestic cake with hand-painted gold leaf details.',
    price: 350,
    category: 'Wedding Cakes',
    stock: 1,
    images: [{ url: 'https://images.unsplash.com/photo-1510344426-5b487da5a706?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Pure Orchid Serenity',
    description: 'Minimalist white cake featuring sugar-crafted exotic orchids.',
    price: 220,
    category: 'Wedding Cakes',
    stock: 4,
    images: [{ url: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800' }]
  },

  // Anniversary Cakes
  {
    name: 'Heartfelt Red Velvet',
    description: 'Iconic heart-shaped cake with creamy cream cheese frosting.',
    price: 38,
    category: 'Anniversary Cakes',
    stock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Rose Romance Cake',
    description: 'A bouquet of edible roses on a delicate vanilla base.',
    price: 42,
    category: 'Anniversary Cakes',
    stock: 7,
    images: [{ url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Together Forever Peak',
    description: 'Two-tier cake symbolized the heights of your journey together.',
    price: 65,
    category: 'Anniversary Cakes',
    stock: 5,
    images: [{ url: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Midnight Love Chocolate',
    description: 'Deep dark chocolate for the intense moments you share.',
    price: 48,
    category: 'Anniversary Cakes',
    stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Golden Jubilee Special',
    description: 'Sparkling metallic gold details to celebrate lasting bonds.',
    price: 55,
    category: 'Anniversary Cakes',
    stock: 6,
    images: [{ url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800' }]
  },

  // Eggless Special
  {
    name: 'Eggless Fruit Medley',
    description: 'Packed with fresh tropical fruits and light sponge.',
    price: 34,
    category: 'Eggless Special',
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1519340333755-cf6a57882322?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Eggless Butterscotch Joy',
    description: 'Crunchy caramel bits in a velvet-smooth eggless base.',
    price: 36,
    category: 'Eggless Special',
    stock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1557925923-33b27f891f88?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Eggless Choco Chips',
    description: 'Our bestseller! Loaded with premium Belgian chocolate chips.',
    price: 38,
    category: 'Eggless Special',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Eggless Pistachio Cloud',
    description: 'Infused with real pistachios and a hint of rose water.',
    price: 45,
    category: 'Eggless Special',
    stock: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1516739656515-aa4070fb9076?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Eggless Mango Mousse',
    description: 'Seasonal mango perfection in every bite.',
    price: 40,
    category: 'Eggless Special',
    stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1534432182912-63863115e106?auto=format&fit=crop&q=80&w=800' }]
  },

  // Custom Creations
  {
    name: 'The Photographer Cake',
    description: 'Hyper-realistic camera design for the lens lovers.',
    price: 95,
    category: 'Custom Creations',
    stock: 3,
    images: [{ url: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Aviation Enthusiast Globe',
    description: 'Hand-painted globe cake with a miniature aircraft.',
    price: 110,
    category: 'Custom Creations',
    stock: 2,
    images: [{ url: 'https://images.unsplash.com/photo-1519340333755-cf6a57882322?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Gamer Nirvana Console',
    description: 'Your favorite console brought to life in chocolate and fondant.',
    price: 85,
    category: 'Custom Creations',
    stock: 5,
    images: [{ url: 'https://images.unsplash.com/photo-1499195333224-3ce974eecfb4?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Botanical Garden Theme',
    description: 'Intricate sugar flowers and greenery for nature lovers.',
    price: 120,
    category: 'Custom Creations',
    stock: 3,
    images: [{ url: 'https://images.unsplash.com/photo-1606913084603-3e75bb77f9e2?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Space Explorer Rocket',
    description: 'Reach for the stars with this vibrant cosmic cake.',
    price: 105,
    category: 'Custom Creations',
    stock: 4,
    images: [{ url: 'https://images.unsplash.com/photo-1516739656515-aa4070fb9076?auto=format&fit=crop&q=80&w=800' }]
  },

  // Exquisite Cupcakes
  {
    name: 'Red Velvet Swirl',
    description: 'Classic red velvet with a silky smooth frosting.',
    price: 4,
    category: 'Exquisite Cupcakes',
    stock: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Belgian Choco Duo',
    description: 'Double chocolate bliss in a compact package.',
    price: 5,
    category: 'Exquisite Cupcakes',
    stock: 45,
    images: [{ url: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Zesty Lemon Peak',
    description: 'Refreshing citrus punch with high-quality meringue.',
    price: 4.5,
    category: 'Exquisite Cupcakes',
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Salted Caramel Bliss',
    description: 'Perfect balance of sweet and salty flavors.',
    price: 5.5,
    category: 'Exquisite Cupcakes',
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Matcha Green Zen',
    description: 'Authentic Japanese matcha infused cupcake.',
    price: 6,
    category: 'Exquisite Cupcakes',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800' }]
  },

  // Artisan Pastries
  {
    name: 'French Butter Croissant',
    description: 'Baked to golden perfection with 100% grass-fed butter.',
    price: 3.5,
    category: 'Artisan Pastries',
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Almond Cream Horn',
    description: 'Crispy pastry filled with rich almond-infused cream.',
    price: 4.8,
    category: 'Artisan Pastries',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Blueberry Galette',
    description: 'Rustic pastry filled with fresh, bursting blueberries.',
    price: 5.5,
    category: 'Artisan Pastries',
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1464305795204-6f5bbee7bb61?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Chocolate Ganache Eclair',
    description: 'Light choux pastry filled with dark chocolate ganache.',
    price: 4.2,
    category: 'Artisan Pastries',
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Pistachio Baklava',
    description: 'Layers of thin pastry and premium Iranian pistachios.',
    price: 6.5,
    category: 'Artisan Pastries',
    stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=800' }]
  },

  // Chocolate Decadence
  {
    name: 'Triple Chocolate Hazard',
    description: 'Dark, milk, and white chocolate layered for the brave.',
    price: 50,
    category: 'Chocolate Decadence',
    stock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }],
    isFeatured: true
  },
  {
    name: 'Black Forest Intense',
    description: 'Traditional German recipe with soaked cherries and deep cacao.',
    price: 45,
    category: 'Chocolate Decadence',
    stock: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Choco-Lava Extreme',
    description: 'Gooey, molten chocolate center that melts in your mouth.',
    price: 12,
    category: 'Chocolate Decadence',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Hazelnut Truffle Peak',
    description: 'Infused with roasted hazelnuts and creamy truffle filling.',
    price: 55,
    category: 'Chocolate Decadence',
    stock: 6,
    images: [{ url: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'White Chocolate Symphony',
    description: 'Pure, velvety white chocolate for a lighter cocoa experience.',
    price: 42,
    category: 'Chocolate Decadence',
    stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800' }]
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
    await Product.deleteMany({});

    // Insert new data
    await Category.insertMany(categories);
    await Banner.insertMany(banners);
    await Product.insertMany(products);

    console.log('Seeding successful! Added 8 categories, 2 banners, and 40 products.');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
