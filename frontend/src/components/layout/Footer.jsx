import { Link } from 'react-router-dom';
import { Cake, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 sm:pt-16 pb-8">
      <div className="max-w-[1536px] mx-auto px-4 md:px-8 lg:px-16 xl:px-24 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <Cake className="text-primary w-6 h-6" />
            <span className="text-xl font-bold text-primary">{APP_CONFIG.APP_NAME}</span>
          </Link>
          <p className="text-secondary text-sm leading-relaxed mb-6">
            Spreading happiness, one slice at a time. We bake with love and quality ingredients.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-text mb-4 sm:mb-6">Quick Links</h4>
          <ul className="space-y-3 sm:space-y-4">
            <li><Link to="/" className="text-secondary hover:text-primary text-sm transition-colors">Home</Link></li>
            <li><Link to="/products" className="text-secondary hover:text-primary text-sm transition-colors">All Cakes</Link></li>
            <li><Link to="/cart" className="text-secondary hover:text-primary text-sm transition-colors">My Cart</Link></li>
            <li><Link to="/orders" className="text-secondary hover:text-primary text-sm transition-colors">Order History</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-text mb-4 sm:mb-6">Information</h4>
          <ul className="space-y-3 sm:space-y-4">
            <li><Link to="/about" className="text-secondary hover:text-primary text-sm transition-colors">About Us</Link></li>
            <li><Link to="/terms" className="text-secondary hover:text-primary text-sm transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" className="text-secondary hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
            <li><Link to="/baking-process" className="text-secondary hover:text-primary text-sm transition-colors">Baking Process</Link></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h4 className="font-bold text-text mb-4 sm:mb-6">Contact Us</h4>
          <ul className="space-y-3 sm:space-y-4">
            <li className="flex items-start gap-3 text-secondary text-sm">
              <MapPin size={18} className="text-primary shrink-0" />
              <span>Near Assi Ghat, Shivala, Varanasi, UP 221005</span>
            </li>
            <li className="flex items-center gap-3 text-secondary text-sm">
              <Phone size={18} className="text-primary shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3 text-secondary text-sm">
              <Mail size={18} className="text-primary shrink-0" />
              <span>hello@cakebakersvaranasi.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1536px] mx-auto px-4 md:px-8 lg:px-16 xl:px-24 mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-secondary text-xs">
        <p>© 2026 {APP_CONFIG.APP_NAME}. All rights reserved.</p>
        <span>Designed & Developed by <span className="text-primary font-bold">Aman</span> ❤️</span>
      </div>
    </footer>
  );
};

export default Footer;
