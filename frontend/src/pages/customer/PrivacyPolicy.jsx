import React from 'react';
import { ShieldCheck, Mail, MapPin, Eye, FileText, Lock } from 'lucide-react';
import Meta from '../../components/layout/Meta';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-b from-[#FFF7F5] to-white min-h-screen py-8 sm:py-12">
      <Meta 
        title="Privacy Policy - Cake Baker's Varanasi" 
        description="Read the Privacy Policy of Cake Baker's Varanasi. We value your privacy and ensure secure transactions for online cake delivery in Varanasi."
        keywords="privacy policy cake bakers, secure online cake order varanasi, privacy guidelines cake shop"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center mb-12">
          <span className="text-primary font-bold text-xs tracking-widest uppercase bg-primary/10 px-4 py-1.5 rounded-full">
            Security & Trust
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-text mt-4 mb-4">
            Privacy Policy
          </h1>
          <p className="text-secondary text-sm">Last Updated: May 24, 2026</p>
        </div>

        {/* Premium Informational Cards */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-10 text-secondary leading-relaxed">
          
          {/* Summary Alert */}
          <div className="flex gap-4 p-5 bg-primary/5 border border-primary/10 rounded-2xl">
            <Lock className="text-primary shrink-0 w-6 h-6 mt-0.5" />
            <div>
              <h4 className="font-bold text-text mb-1">Your Privacy is Sacred to Us</h4>
              <p className="text-xs sm:text-sm">
                At Cake Baker's Varanasi, we prioritize your data security just as we prioritize the purity of our cakes. This policy outlines how we gather, utilize, and protect your information when you order online.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-text font-extrabold text-xl">
              <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm">1</span>
              <h2>Information We Collect</h2>
            </div>
            <p className="text-sm pl-11">
              To deliver freshly baked cakes straight to your doorstep in Lanka, Sigra, Bhelupur, and other parts of Varanasi, we collect the following essential information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-11">
              <li><strong>Personal Details:</strong> Name, mobile number, and email address for order verification and notification updates.</li>
              <li><strong>Delivery Address:</strong> Precise house number, street, locality in Varanasi, and postal pin code.</li>
              <li><strong>Payment Information:</strong> Secured transactional data handled via RBI-approved payment gateways (such as Razorpay/UPI/Paytm). We do not store card details on our local servers.</li>
              <li><strong>Technical Data:</strong> IP address, device specs, and cookie identifiers to enhance user shopping experience.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-text font-extrabold text-xl">
              <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm">2</span>
              <h2>How We Use Your Information</h2>
            </div>
            <p className="text-sm pl-11">
              We leverage the collected data strictly to ensure a flawless cake ordering experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-11">
              <li>To confirm, process, bake, and dispatch your ordered cakes to your exact Varanasi location.</li>
              <li>To send real-time order tracking status updates via SMS, Web Push, and email.</li>
              <li>To gather client feedback to enhance our cake collections and chef services.</li>
              <li>To notify you about special seasonal festival discounts in Kashi.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-text font-extrabold text-xl">
              <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm">3</span>
              <h2>Information Sharing & Security</h2>
            </div>
            <p className="text-sm pl-11">
              We never trade, sell, or rent your personal directories to third-party marketing services. Your information is only shared with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-11">
              <li><strong>Delivery Partners:</strong> Local delivery riders in Varanasi who transport the cake boxes to your home.</li>
              <li><strong>Payment Partners:</strong> Fully encrypted, secure transaction gateways.</li>
            </ul>
            <p className="text-sm pl-11">
              All user data is encrypted in transit and stored securely on cloud systems protected by robust firewalls.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-text font-extrabold text-xl">
              <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm">4</span>
              <h2>Cookies Policy</h2>
            </div>
            <p className="text-sm pl-11">
              Our online cake store utilizes minimal cookies to retain products in your shopping cart, remember your user profile session, and analyze website traffic to make navigation faster. You can toggle cookie permissions inside your web browser configurations.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-text font-extrabold text-xl">
              <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm">5</span>
              <h2>Contact Our Privacy Officer</h2>
            </div>
            <p className="text-sm pl-11">
              If you have any queries about our privacy practices, data deletion requests, or secured transaction concerns, please feel free to reach out to our team at Assi Ghat:
            </p>
            <div className="bg-background rounded-2xl p-6 mt-4 space-y-3 pl-11 text-text border border-gray-50 max-w-lg">
              <p className="flex items-center gap-3 font-semibold text-sm">
                <MapPin size={18} className="text-primary shrink-0" />
                Cake Baker's, Near Assi Ghat, Shivala, Varanasi, UP, 221005
              </p>
              <p className="flex items-center gap-3 font-semibold text-sm">
                <Mail size={18} className="text-primary shrink-0" />
                privacy@cakebakersvaranasi.com
              </p>
              <p className="flex items-center gap-3 font-semibold text-sm">
                <ShieldCheck size={18} className="text-primary shrink-0" />
                Data Protection Officer: Aman Maurya
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
