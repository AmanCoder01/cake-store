import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Clock, Award, Star, MapPin } from 'lucide-react';
import Meta from '../../components/layout/Meta';
import Button from '../../components/ui/Button';

const AboutUs = () => {
  // Rich Varanasi-localized Schema.org markup for Local Business
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "Cake Baker's Varanasi - Premium Handcrafted Cakes",
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    "description": "Premium cake shop in Varanasi offering 100% fresh, eggless handcrafted cakes. Specializing in customized birthday, wedding and anniversary cakes with fast delivery across Varanasi.",
    "telephone": "+91 98765 43210",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Near Assi Ghat, Shivala",
      "addressLocality": "Varanasi",
      "postalCode": "221005",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.2997,
      "longitude": 83.0076
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "23:00"
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#FFF7F5] to-white min-h-screen py-8">
      <Meta 
        title="About Us - Best Cake Shop in Varanasi" 
        description="Learn more about Cake Baker's, the best cake shop in Varanasi. Located near Assi Ghat, we bake 100% fresh, eggless custom cakes with love. Fast delivery in Varanasi."
        keywords="best cake shop in varanasi, about cake bakers varanasi, nearby cake shop, cake delivery in varanasi, fresh eggless cakes varanasi"
        schema={aboutSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold text-sm tracking-widest uppercase bg-primary/10 px-4 py-1.5 rounded-full"
          >
            Our Sacred Story
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-text mt-4 mb-6 leading-tight"
          >
            Crafting Sweet Memories in the Heart of <span className="text-primary">Varanasi</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-lg sm:text-xl leading-relaxed"
          >
            Since 2022, we have been baking delicious happiness near the divine Ghats of Kashi. Discover how we became Varanasi's favorite destination for celebratory masterpieces.
          </motion.p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-3xl transform rotate-3 scale-102 filter blur-sm"></div>
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80" 
              alt="Baking with passion in Kashi" 
              className="relative rounded-3xl object-cover w-full h-[450px] shadow-2xl border-4 border-white"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 hidden sm:flex">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-xl">10k+</div>
              <div>
                <p className="font-bold text-text text-sm">Cakes Handcrafted</p>
                <p className="text-secondary text-xs">For Varanasi Celebrations</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-extrabold text-text leading-tight">
              Baking Fresh and Pure Near the Ganges
            </h2>
            <p className="text-secondary leading-relaxed">
              Nestled near the vibrant <strong>Assi Ghat in Varanasi</strong>, Cake Baker's was born out of a simple passion: to serve pure, scrumptious, and aesthetic cakes to the people of Kashi. Varanasi is a city of celebrations, faith, and joy. We believe every divine celebration here deserves a cake that is equally extraordinary.
            </p>
            <p className="text-secondary leading-relaxed">
              That's why all our products are <strong>100% vegetarian and eggless</strong>, ensuring that everyone in our holy city can relish our creations without hesitation. From classic Butterscotch and rich Chocolate Truffle to custom-designed Wedding cakes, our skilled pastry chefs curate every detail with precision.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-text font-bold text-sm bg-white border border-gray-100 px-4 py-2.5 rounded-xl shadow-sm">
                <MapPin size={18} className="text-primary" />
                Assi Ghat, Varanasi
              </div>
              <div className="flex items-center gap-2 text-text font-bold text-sm bg-white border border-gray-100 px-4 py-2.5 rounded-xl shadow-sm">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                4.9/5 Google Rated
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights (SEO terms inside grid items) */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-text mb-4">Why Cake Baker's is Varanasi's Favorite</h2>
            <p className="text-secondary text-sm sm:text-base">We stand out because we prioritize purity, visual artistry, and prompt delivery in every corner of the city.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart size={24} className="text-red-500" />,
                title: "100% Eggless & Pure",
                desc: "Baked in an entirely vegetarian facility near Assi, respecting Varanasi's cultural preferences perfectly."
              },
              {
                icon: <ShieldCheck size={24} className="text-green-500" />,
                title: "Premium Ingredients",
                desc: "We use only top-tier Belgian chocolate, organic fruits, and premium whipped cream for that heavenly taste."
              },
              {
                icon: <Clock size={24} className="text-blue-500" />,
                title: "Instant Nearby Delivery",
                desc: "Prompt delivery in Lanka, Shivala, Sigra, Bhelupur, Godowlia, and other regions of Varanasi within 2 hours."
              },
              {
                icon: <Award size={24} className="text-yellow-500" />,
                title: "Artisanal Design",
                desc: "Our customized theme cakes and designer pieces are visual marvels that look as good as they taste."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-text text-lg mb-2">{feature.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Local Area Delivery SEO Callout */}
        <div className="bg-primary/5 rounded-3xl p-8 sm:p-12 mb-24 border border-primary/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-text mb-4">
                Serving Sweetness Across All Varanasi Neighborhoods
              </h3>
              <p className="text-secondary text-sm sm:text-base leading-relaxed">
                Looking for a <strong>cake shop near me</strong> in Varanasi? We offer lightning-fast, secure online cake delivery across Varanasi, including key areas like:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {["Lanka & BHU", "Assi Ghat", "Sigra & Cantonment", "Bhelupur", "Godowlia & Dashashwamedh", "Mahmoorganj", "Sarnath", "Pandeypur"].map((area, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs font-bold text-secondary bg-white py-2 px-3 rounded-lg shadow-sm border border-gray-100">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    {area}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center lg:text-right">
              <Link to="/products">
                <Button size="lg" className="rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all w-full lg:w-auto">
                  Order Now Near You
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
