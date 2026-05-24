import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ShieldCheck, Flame, Award, Truck } from 'lucide-react';
import Meta from '../../components/layout/Meta';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const BakingProcess = () => {
  const bakingSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How We Bake Varanasi's Best Cakes",
    "description": "Step-by-step overview of our artisanal baking process at Cake Baker's Varanasi. From sourcing 100% vegetarian ingredients to flawless cake decorations.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Sourcing Pure & Organic Ingredients",
        "text": "We source high-quality premium organic flour, Belgian chocolates, and fresh seasonal fruits for our cakes."
      },
      {
        "@type": "HowToStep",
        "name": "Eggless Blending & Purity Check",
        "text": "Every batter is prepared in a 100% pure vegetarian, egg-free zone with utmost care."
      },
      {
        "@type": "HowToStep",
        "name": "Precision Baking & Temperature Control",
        "text": "Cakes are baked in specialized modern convection ovens to maintain soft texture and perfect rise."
      },
      {
        "@type": "HowToStep",
        "name": "Artisanal Hand-Frosted Decoration",
        "text": "Our expert chefs design and decorate the cakes by hand, ensuring visual elegance."
      }
    ]
  };

  const steps = [
    {
      num: "01",
      icon: <Sparkles className="text-pink-500" size={24} />,
      title: "Selecting Premium Ingredients",
      desc: "Our journey begins with sourcing the absolute best. We use fine Belgian cocoa, top-grade Madagascar vanilla extract, organic local flour, and fresh seasonal fruits. No compromise on quality ever.",
      badge: "Pure Sourcing"
    },
    {
      num: "02",
      icon: <Heart className="text-red-500" size={24} />,
      title: "100% Eggless Pure Batter",
      desc: "We run a strict 100% vegetarian bakery. Our kitchens are completely egg-free, utilizing organic milk solids and fruit starches to achieve a fluffy, moist cake structure that melts in your mouth.",
      badge: "Eggless Special"
    },
    {
      num: "03",
      icon: <Flame className="text-amber-500" size={24} />,
      title: "Precision Oven Baking",
      desc: "Our convection ovens are maintained at calibrated temperatures to ensure uniform heat distribution. This produces incredibly soft sponges that form the perfect foundation for frosting.",
      badge: "Slow Baked"
    },
    {
      num: "04",
      icon: <Award className="text-yellow-500" size={24} />,
      title: "Artisanal Hand Decoration",
      desc: "This is where magic happens. Our Varanasi-trained pastry decorators meticulously ice each layer with delicate whipped cream or rich fondant, creating bespoke patterns customized just for you.",
      badge: "Bespoke Art"
    },
    {
      num: "05",
      icon: <ShieldCheck className="text-green-500" size={24} />,
      title: "Hygiene & Purity Verification",
      desc: "Before any cake leaves our counter, it undergoes strict hygiene inspects. Our chefs operate with full sanitization, gloves, and hairnets in a dust-proof kitchen near Assi Ghat.",
      badge: "Certified Clean"
    },
    {
      num: "06",
      icon: <Truck className="text-blue-500" size={24} />,
      title: "Refrigerated Safe Delivery",
      desc: "Cakes are packaged in sturdy, premium insulated boxes and delivered immediately in customized temperature-controlled bags to keep the frosting fresh and cool during transit.",
      badge: "Chilled Shipping"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-[#FFF7F5] to-white min-h-screen py-8">
      <Meta 
        title="Our Baking Process - Freshly Baked Eggless Cakes" 
        description="Explore how Cake Baker's Varanasi crafts the fluffiest, 100% eggless cakes in Varanasi. Step-by-step guide to our premium ingredients, hygiene, and decoration process."
        keywords="how we bake cakes, eggless cake baking process, fresh bakery varanasi, hygienic cake shop varanasi, customized cakes varanasi"
        schema={bakingSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold text-sm tracking-widest uppercase bg-primary/10 px-4 py-1.5 rounded-full"
          >
            Behind the Scenes
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-text mt-4 mb-6"
          >
            How We Bake Varanasi's <span className="text-primary">Best Cakes</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-lg leading-relaxed"
          >
            We believe that baking is a beautiful blend of art, science, and absolute devotion. Here is a step-by-step look at how we transform premium raw ingredients into pure sweet happiness.
          </motion.p>
        </div>

        {/* Process Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: 0.6 }}
              className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col group relative overflow-hidden"
            >
              {/* Decorative Step Number in Background */}
              <div className="absolute -top-4 -right-2 text-8xl font-black text-primary/5 select-none transition-transform group-hover:scale-105">
                {step.num}
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{step.badge}</span>
              </div>
              
              <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              
              <p className="text-secondary text-sm leading-relaxed flex-grow">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quote Banner */}
        <div className="bg-[#FFF7F5] border border-primary/10 rounded-3xl p-8 sm:p-16 text-center max-w-4xl mx-auto mb-24">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <span className="text-4xl text-primary font-serif">“</span>
            <p className="text-xl sm:text-2xl font-bold italic text-text leading-relaxed mb-6">
              Our kitchen operates near the holy Ganga, where we maintain the standard of spiritual purity and physical hygiene. Every cake we deliver to your home is baked with standard ingredients and love.
            </p>
            <h4 className="font-extrabold text-primary text-sm uppercase tracking-widest">— Chief Pastry Chef, Cake Baker's Varanasi</h4>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-text mb-6">Taste the Purity of Handcrafted Cakes</h3>
          <p className="text-secondary max-w-xl mx-auto mb-8 text-sm sm:text-base">Ready to enjoy Varanasi's freshest, most delightful cakes? Customize your favorite design or browse our list now.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products">
              <Button size="lg" className="rounded-2xl px-10 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                Explore All Cakes
              </Button>
            </Link>
            <a href="https://wa.me/919876543210?text=Hi,%20I'm%20interested%20in%20ordering%20a%20customized%20cake%20in%20Varanasi" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="rounded-2xl px-10 w-full sm:w-auto bg-white hover:bg-gray-50 border-gray-200">
                Order Customized Cake
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BakingProcess;
