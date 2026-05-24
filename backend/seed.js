// Force Node.js to use public DNS resolvers (Google & Cloudflare) to prevent ECONNREFUSED DNS lookup issues on some networks
require('node:dns/promises').setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');
const Banner = require('./models/bannerModel');
const Product = require('./models/productModel');

dotenv.config();

const categories = [
  {
    name: 'Cakes',
    slug: 'cakes',
    description: 'Savor our delightful range of freshly baked, standard daily cakes.',
    image: { url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Pastries',
    slug: 'pastries',
    description: 'Flaky, creamy, and perfectly baked pastries for your daily treats.',
    image: { url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Cupcakes',
    slug: 'cupcakes',
    description: 'Bite-sized delights available in a variety of gourmet flavors.',
    image: { url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Choco Lava Cakes',
    slug: 'choco-lava-cakes',
    description: 'Gooey, molten chocolate centers that melt in your mouth.',
    image: { url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Custom Cakes',
    slug: 'custom-cakes',
    description: 'You dream it, we bake it. Fully personalized designs for unique celebrations.',
    image: { url: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Birthday Cakes',
    slug: 'birthday-cakes',
    description: 'Make every birthday magical with our delightful range of handcrafted cakes.',
    image: { url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Anniversary Cakes',
    slug: 'anniversary-cakes',
    description: 'Celebrate your journey of love with our romantic and premium cake collections.',
    image: { url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Chocolate Cakes',
    slug: 'chocolate-cakes',
    description: 'Rich, dark, and sinful chocolate cakes for the ultimate indulgence.',
    image: { url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Eggless Cakes',
    slug: 'eggless-cakes',
    description: 'Deliciously moist and 100% vegetarian cakes for everyone to enjoy.',
    image: { url: 'https://images.unsplash.com/photo-1606913084603-3e75bb77f9e2?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Designer Cakes',
    slug: 'designer-cakes',
    description: 'Exquisite, artfully crafted modern cakes for aesthetic and upscale events.',
    image: { url: 'https://images.unsplash.com/photo-1519340333755-cf6a57882322?auto=format&fit=crop&q=80&w=800' }
  },
  {
    name: 'Truffle cakes',
    slug: 'truffle-cakes',
    description: 'Velvety truffle-filled premium cakes designed to satisfy heavy cocoa cravings.',
    image: { url: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&q=80&w=800' }
  }
];

const products = [
  // 1. Cakes
  {
    name: 'Classic Vanilla Sparkler',
    description: 'Indulge in our classic moist vanilla sponge layered with silky sweet cream and colorful fun confetti.',
    price: 350,
    category: 'Cakes',
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800' }],
    isFeatured: true
  },
  {
    name: 'Fresh Strawberry Cream Cake',
    description: 'Vanilla sponge layered with fresh strawberries and sweet vanilla whipped cream.',
    price: 420,
    category: 'Cakes',
    stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Mango Mousse Delight',
    description: 'A delicious tropical seasonal blend of sweet mango mousse and light vanilla sponge.',
    price: 450,
    category: 'Cakes',
    stock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1534432182912-63863115e106?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Pineapple Sunshine Gateau',
    description: 'The absolute favorite traditional sweet pineapple layered cake with juicy cherry accents.',
    price: 380,
    category: 'Cakes',
    stock: 18,
    images: [{ url: 'https://images.unsplash.com/photo-1557925923-33b27f891f88?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Butterscotch Crunch Cake',
    description: 'Velvety butterscotch cream infused with golden caramelized sugar crystals for a beautiful crunch.',
    price: 400,
    category: 'Cakes',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1557925923-33b27f891f88?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Premium Mixed Fruit Forest',
    description: 'Rich sponge topped and filled with a fresh forest of kiwi, apple, pomegranate, and seasonal fruits.',
    price: 480,
    category: 'Cakes',
    stock: 14,
    images: [{ url: 'https://images.unsplash.com/photo-1519340333755-cf6a57882322?auto=format&fit=crop&q=80&w=800' }]
  },

  // 2. Pastries
  {
    name: 'French Butter Croissant',
    description: 'Buttery, flaky, multi-layered golden pastry freshly baked to absolute perfection.',
    price: 75,
    category: 'Pastries',
    stock: 35,
    images: [{ url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Chocolate Ganache Eclair',
    description: 'Choux pastry filled with premium cream and glazed with rich dark chocolate ganache.',
    price: 90,
    category: 'Pastries',
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Almond Cream Horn',
    description: 'Crispy rolled puff pastry horn filled with dense almond-infused premium cream.',
    price: 85,
    category: 'Pastries',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Blueberry Galette Slice',
    description: 'A beautiful rustic freeform pastry filled with tangy fresh blueberries.',
    price: 95,
    category: 'Pastries',
    stock: 18,
    images: [{ url: 'https://images.unsplash.com/photo-1464305795204-6f5bbee7bb61?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Pistachio Baklava Slice',
    description: 'Layers of paper-thin phyllo pastry filled with chopped pistachios and sweetened with syrup.',
    price: 110,
    category: 'Pastries',
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Strawberry Custard Tart',
    description: 'A crisp buttery tart shell filled with vanilla pastry cream and topped with glazed fresh strawberries.',
    price: 120,
    category: 'Pastries',
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1516739656515-aa4070fb9076?auto=format&fit=crop&q=80&w=800' }]
  },

  // 3. Cupcakes
  {
    name: 'Red Velvet Swirl Cupcake',
    description: 'Light cocoa cupcake topped with a classic velvety smooth cream cheese frosting swirl.',
    price: 60,
    category: 'Cupcakes',
    stock: 45,
    images: [{ url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800' }],
    isTrending: true
  },
  {
    name: 'Belgian Chocolate Duo Cupcake',
    description: 'Rich dark chocolate cupcake topped with a decadent whipped double chocolate buttercream.',
    price: 70,
    category: 'Cupcakes',
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Zesty Lemon Meringue Cupcake',
    description: 'Tangy lemon-infused cupcake topped with a sweet, perfectly toasted fluffy meringue cloud.',
    price: 65,
    category: 'Cupcakes',
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Salted Caramel Drizzle Cupcake',
    description: 'Fluffy vanilla cupcake filled with salted caramel and topped with caramel buttercream.',
    price: 75,
    category: 'Cupcakes',
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Matcha Green Tea Cupcake',
    description: 'Infused with high-quality authentic Japanese matcha, topped with light green tea cream.',
    price: 80,
    category: 'Cupcakes',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Peanut Butter Cupcake',
    description: 'Rich chocolate cupcake topped with a smooth and salty whipped peanut butter frosting.',
    price: 85,
    category: 'Cupcakes',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800' }]
  },

  // 4. Choco Lava Cakes
  {
    name: 'Classic Molten Lava Cake',
    description: 'Indulgent warm chocolate cake with a rich and gooey liquid chocolate center.',
    price: 99,
    category: 'Choco Lava Cakes',
    stock: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800' }],
    isFeatured: true
  },
  {
    name: 'Dark Chocolate Lava Extreme',
    description: 'An intense cacao experience with a bitter-sweet molten chocolate lava explosion.',
    price: 120,
    category: 'Choco Lava Cakes',
    stock: 35,
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Hazelnut Fudge Lava Surprise',
    description: 'Gooey chocolate lava cake infused with roasted hazelnut paste and hazelnut drizzle.',
    price: 130,
    category: 'Choco Lava Cakes',
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'White Chocolate Molten Lava',
    description: 'A sweet twist with a rich molten white chocolate center inside a vanilla cake shell.',
    price: 110,
    category: 'Choco Lava Cakes',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Salted Caramel Lava Explosion',
    description: 'Molten core of sweet and salty golden caramel inside a delicious chocolate cake.',
    price: 140,
    category: 'Choco Lava Cakes',
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Nutella Lava Heart Cake',
    description: 'Molten Nutella center that oozes out beautifully from a rich chocolate cake sponge.',
    price: 150,
    category: 'Choco Lava Cakes',
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }]
  },

  // 5. Custom Cakes
  {
    name: 'Photographer Camera Cake',
    description: 'A stunning fondant masterpiece shaped like a high-end DSLR camera, perfect for photographers.',
    price: 1800,
    category: 'Custom Cakes',
    stock: 3,
    images: [{ url: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Vintage Suitcase Travel Cake',
    description: 'Travel-themed cake designed like a stack of vintage suitcases with hand-painted map details.',
    price: 2200,
    category: 'Custom Cakes',
    stock: 2,
    images: [{ url: 'https://images.unsplash.com/photo-1519340333755-cf6a57882322?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Retro Game Console Cake',
    description: 'A highly nostalgic cake shaped like a classic gaming console with controller accessories.',
    price: 1950,
    category: 'Custom Cakes',
    stock: 4,
    images: [{ url: 'https://images.unsplash.com/photo-1499195333224-3ce974eecfb4?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Enchanted Fairy Garden Cake',
    description: 'A whimsical multi-tier cake adorned with sugar flowers, fairies, and edible moss.',
    price: 2500,
    category: 'Custom Cakes',
    stock: 2,
    images: [{ url: 'https://images.unsplash.com/photo-1606913084603-3e75bb77f9e2?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Galaxy Space Exploration Cake',
    description: 'Airbrushed cosmic background with edible planets and a custom sugar-sculpted rocket.',
    price: 2100,
    category: 'Custom Cakes',
    stock: 3,
    images: [{ url: 'https://images.unsplash.com/photo-1516739656515-aa4070fb9076?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Makeup Box Glamour Cake',
    description: 'Elegant cake designed like a luxury cosmetics box with edible lipsticks, shadows, and brushes.',
    price: 2000,
    category: 'Custom Cakes',
    stock: 4,
    images: [{ url: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&q=80&w=800' }]
  },

  // 6. Birthday Cakes
  {
    name: 'Rainbow Confetti Blast Birthday',
    description: 'A colorful surprise inside and out, perfect for kids and the young at heart.',
    price: 450,
    category: 'Birthday Cakes',
    stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800' }],
    isFeatured: true
  },
  {
    name: 'Golden Glow Birthday Special',
    description: 'Elegant vanilla birthday cake with metallic gold accents for a touch of luxury.',
    price: 550,
    category: 'Birthday Cakes',
    stock: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Superhero Adventure Cake',
    description: 'Fuel their imagination with our custom-themed superhero birthday cake.',
    price: 650,
    category: 'Birthday Cakes',
    stock: 9,
    images: [{ url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Princess Tiara Birthday Cake',
    description: 'A beautiful pink and white princess cake topped with a sparkling edible tiara.',
    price: 700,
    category: 'Birthday Cakes',
    stock: 6,
    images: [{ url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Chocolate Overload Birthday',
    description: 'Layers of rich Belgian chocolate because one can never have enough chocolate.',
    price: 500,
    category: 'Birthday Cakes',
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Oreo Cookies & Cream Birthday',
    description: 'Vanilla sponge layered with crushed Oreos and cookies & cream frosting.',
    price: 480,
    category: 'Birthday Cakes',
    stock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800' }]
  },

  // 7. Anniversary Cakes
  {
    name: 'Rose Gold Romance Anniversary',
    description: 'A bouquet of beautiful edible rose gold roses on a delicate vanilla anniversary base.',
    price: 650,
    category: 'Anniversary Cakes',
    stock: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800' }],
    isTrending: true
  },
  {
    name: 'Sweetheart Red Velvet Special',
    description: 'Iconic heart-shaped deep red velvet cake with creamy cream cheese frosting.',
    price: 700,
    category: 'Anniversary Cakes',
    stock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Two-Tier Golden Jubilee Special',
    description: 'Sparkling metallic gold details to celebrate fifty years of lasting love.',
    price: 1200,
    category: 'Anniversary Cakes',
    stock: 4,
    images: [{ url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Together Forever Strawberry Peak',
    description: 'Light strawberry layers symbolizing the heights of your beautiful journey together.',
    price: 600,
    category: 'Anniversary Cakes',
    stock: 7,
    images: [{ url: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Silver Metallic Elegance Cake',
    description: 'Sleek modern silver leaf accents on a smooth white vanilla bean canvas.',
    price: 850,
    category: 'Anniversary Cakes',
    stock: 5,
    images: [{ url: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Midnight Truffle Rose Cake',
    description: 'Deep chocolate truffle cake decorated with dark roses for romantic celebrations.',
    price: 750,
    category: 'Anniversary Cakes',
    stock: 9,
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }]
  },

  // 8. Chocolate Cakes
  {
    name: 'Triple Chocolate Hazard Cake',
    description: 'Dark, milk, and white chocolate layered for the ultimate chocolate lovers dream.',
    price: 550,
    category: 'Chocolate Cakes',
    stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }],
    isFeatured: true
  },
  {
    name: 'Black Forest Intense Cake',
    description: 'Traditional German recipe with dark cherries, chocolate shavings, and fresh cream.',
    price: 480,
    category: 'Chocolate Cakes',
    stock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Nutella Hazelnut Praline Cake',
    description: 'Lush hazelnut chocolate sponge layered with creamy Nutella and crunchy pralines.',
    price: 620,
    category: 'Chocolate Cakes',
    stock: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Dark Chocolate Fudge Silk Cake',
    description: 'Super smooth, melt-in-the-mouth chocolate fudge cake with premium dark cocoa.',
    price: 580,
    category: 'Chocolate Cakes',
    stock: 11,
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Belgian Dark Cacao Masterpiece',
    description: 'Dense, rich chocolate sponge covered in a luxurious glaze of imported Belgian cacao.',
    price: 700,
    category: 'Chocolate Cakes',
    stock: 6,
    images: [{ url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'German Chocolate Layer Cake',
    description: 'Decadent chocolate cake loaded with a sweet coconut-pecan filling and icing.',
    price: 650,
    category: 'Chocolate Cakes',
    stock: 7,
    images: [{ url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800' }]
  },

  // 9. Eggless Cakes
  {
    name: 'Eggless Fruit Medley Delight',
    description: 'Packed with fresh tropical fruits, vanilla sponge, and completely eggless.',
    price: 420,
    category: 'Eggless Cakes',
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1519340333755-cf6a57882322?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Eggless Butterscotch Bliss',
    description: 'Crunchy caramel butterscotch bits in a velvety smooth 100% vegetarian cake.',
    price: 440,
    category: 'Eggless Cakes',
    stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1557925923-33b27f891f88?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Eggless Choco Chip Loaded Cake',
    description: 'A vegetarian favorite! Loaded with premium semi-sweet Belgian chocolate chips.',
    price: 460,
    category: 'Eggless Cakes',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Eggless Pistachio Cloud Cake',
    description: 'Delicately infused with real ground pistachios and a sweet hint of rose water.',
    price: 520,
    category: 'Eggless Cakes',
    stock: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1516739656515-aa4070fb9076?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Eggless Mango Cream Harmony',
    description: 'Smooth seasonal mango puree and fresh cream in a vegetarian sponge cake.',
    price: 480,
    category: 'Eggless Cakes',
    stock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1534432182912-63863115e106?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Eggless Rich Velvet Cream Cake',
    description: '100% eggless red velvet sponge layered with sweet vanilla cream cheese frosting.',
    price: 500,
    category: 'Eggless Cakes',
    stock: 14,
    images: [{ url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800' }]
  },

  // 10. Designer Cakes
  {
    name: 'Geometric Marble Gold Cake',
    description: 'A sleek modern designer cake with a grey marble fondant finish and gold leaf accents.',
    price: 1250,
    category: 'Designer Cakes',
    stock: 4,
    images: [{ url: 'https://images.unsplash.com/photo-1519340333755-cf6a57882322?auto=format&fit=crop&q=80&w=800' }],
    isFeatured: true
  },
  {
    name: 'Botanical Eucalyptus Cake',
    description: 'Intricately detailed watercolor cake decorated with organic sugar eucalyptus leaves.',
    price: 1400,
    category: 'Designer Cakes',
    stock: 3,
    images: [{ url: 'https://images.unsplash.com/photo-1606913084603-3e75bb77f9e2?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Watercolor Pastel Dream',
    description: 'A beautiful hand-painted abstract watercolor style cake in soft pastel hues.',
    price: 1100,
    category: 'Designer Cakes',
    stock: 5,
    images: [{ url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Royal Ivory Lace Elegance',
    description: 'A classic design featuring royal edible lace wraps on a smooth ivory fondant tier.',
    price: 1650,
    category: 'Designer Cakes',
    stock: 2,
    images: [{ url: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Modern Concrete Style Cake',
    description: 'Industrial-chic design featuring textured stone-look icing and vibrant dried flowers.',
    price: 1300,
    category: 'Designer Cakes',
    stock: 4,
    images: [{ url: 'https://images.unsplash.com/photo-1519340333755-cf6a57882322?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Floating Flower Tiered Design',
    description: 'Multi-tiered masterpiece featuring suspended transparent separators and edible florals.',
    price: 2200,
    category: 'Designer Cakes',
    stock: 2,
    images: [{ url: 'https://images.unsplash.com/photo-1606913084603-3e75bb77f9e2?auto=format&fit=crop&q=80&w=800' }]
  },

  // 11. Truffle cakes
  {
    name: 'Belgian Chocolate Truffle Cake',
    description: 'Dense chocolate cake with a rich and velvety Belgian chocolate truffle filling.',
    price: 550,
    category: 'Truffle cakes',
    stock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&q=80&w=800' }],
    isTrending: true
  },
  {
    name: 'Hazelnut Truffle Cream Cake',
    description: 'Truffle cake infused with roasted hazelnut paste and topped with truffle swirls.',
    price: 580,
    category: 'Truffle cakes',
    stock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Dark Chocolate Truffle Decadence',
    description: 'Deep dark chocolate cake layered with heavy chocolate truffle ganache.',
    price: 600,
    category: 'Truffle cakes',
    stock: 11,
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'White Chocolate Truffle Harmony',
    description: 'Creamy white chocolate truffle ganache layered inside a fluffy white sponge.',
    price: 520,
    category: 'Truffle cakes',
    stock: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Raspberry Chocolate Truffle Fusion',
    description: 'Rich chocolate truffle layers balanced with a tart and tangy raspberry compote.',
    price: 620,
    category: 'Truffle cakes',
    stock: 9,
    images: [{ url: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    name: 'Caramel Truffle Crunch Cake',
    description: 'Chocolate truffle cake layered with butter caramel swirls and crunchy toffee bits.',
    price: 640,
    category: 'Truffle cakes',
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&q=80&w=800' }]
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

    console.log(`Seeding successful! Added ${categories.length} categories, ${banners.length} banners, and ${products.length} products.`);
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
