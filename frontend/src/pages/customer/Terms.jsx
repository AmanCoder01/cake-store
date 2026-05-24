import React from 'react';
import { FileText, AlertCircle, RefreshCw, Truck, CreditCard, ShieldAlert } from 'lucide-react';
import Meta from '../../components/layout/Meta';

const Terms = () => {
  return (
    <div className="bg-gradient-to-b from-[#FFF7F5] to-white min-h-screen py-8 sm:py-12">
      <Meta 
        title="Terms and Conditions - Cake Baker's Varanasi" 
        description="Read the Terms and Conditions of Cake Baker's Varanasi. Understand our policies regarding customized cake ordering, delivery across Varanasi, and refunds."
        keywords="terms and conditions cake bakers, cake order policies varanasi, refund guidelines cake shop"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center mb-12">
          <span className="text-primary font-bold text-xs tracking-widest uppercase bg-primary/10 px-4 py-1.5 rounded-full">
            Legal Terms
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-text mt-4 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-secondary text-sm">Last Updated: May 24, 2026</p>
        </div>

        {/* Informative legal cards */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-10 text-secondary leading-relaxed">
          
          <div className="flex gap-4 p-5 bg-primary/5 border border-primary/10 rounded-2xl">
            <AlertCircle className="text-primary shrink-0 w-6 h-6 mt-0.5" />
            <div>
              <h4 className="font-bold text-text mb-1">Please Read These Rules Carefully</h4>
              <p className="text-xs sm:text-sm">
                By browsing or placing an order at Cake Baker's Varanasi, you signify your full agreement to these terms. These rules ensure a smooth, transparent, and blissful baking relationship between you and our bakery.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-text font-extrabold text-xl">
              <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm">1</span>
              <h2>Cake Customization & Orders</h2>
            </div>
            <p className="text-sm pl-11">
              All our bakery items are handcrafted individually. While we strive to match designs exactly, minor creative adjustments may happen in colors, whipped cream designs, and minor decorations.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-11">
              <li><strong>Purity Assurance:</strong> We bake 100% pure eggless (vegetarian) cakes. Absolutely no egg products are handled inside our kitchen space.</li>
              <li><strong>Design Approval:</strong> For complex, tiered wedding or designer custom cakes, approval must be finalized 24 hours prior to delivery.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-text font-extrabold text-xl">
              <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm">2</span>
              <h2>Prices & Payment Gateway</h2>
            </div>
            <p className="text-sm pl-11">
              All prices listed on the site are in Indian Rupees (₹) inclusive of standard packaging.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-11">
              <li>Full online payment via our integrated channels is required to initiate high-customization cake orders.</li>
              <li>Cash on Delivery (COD) is available only for standard cake varieties in limited Varanasi neighborhoods.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-text font-extrabold text-xl">
              <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm">3</span>
              <h2>Varanasi Delivery & Pickups</h2>
            </div>
            <p className="text-sm pl-11">
              We operate standard delivery services throughout Varanasi.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-11">
              <li><strong>Timing:</strong> Deliveries are executed during your selected timeslots. However, slight variations may happen due to festive processions (such as Dev Deepawali, Maha Shivratri), local traffic restrictions around Godowlia/Dashashwamedh, or harsh weather.</li>
              <li><strong>Incomplete Address:</strong> If a customer inputs an incorrect contact number or door address, we cannot be held responsible for delayed cake melted states. Please double-check address coordinates.</li>
              <li><strong>Self-Pickup:</strong> Customers can also pick up orders directly from our outlet situated near Assi Ghat, Varanasi.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-text font-extrabold text-xl">
              <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm">4</span>
              <h2>Cancellation & Refund Guidelines</h2>
            </div>
            <p className="text-sm pl-11">
              Because cakes are highly perishable handcrafted custom products, specific cancellation windows apply:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-11">
              <li>Cancellations done <strong>at least 12 hours</strong> before the scheduled delivery are eligible for a 100% refund as store credits or direct bank reversals.</li>
              <li>No refunds are provided if cancellation is requested within 4 hours of scheduled dispatch, as baking and cream frosting decorations have already been executed by our chefs.</li>
              <li>If you receive a damaged cake box, please notify our helpline (+91 98765 43210) within 15 minutes of reception with snapshots to initiate quick replacement or partial reimbursement.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-text font-extrabold text-xl">
              <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm">5</span>
              <h2>Governing Legal Jurisdiction</h2>
            </div>
            <p className="text-sm pl-11">
              Any dispute, legal proceedings, or claims originating out of these operational terms shall be exclusively governed by the local judicial courts located within the district of Varanasi, Uttar Pradesh, India.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
