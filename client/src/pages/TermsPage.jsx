import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 min-h-screen">
      <h1 className="font-display text-3xl sm:text-5xl font-bold text-primary border-b border-[#eaeaea] pb-4">
        Terms & Conditions
      </h1>
      <p className="text-xs text-primary/40 uppercase tracking-widest font-semibold">Last Updated: July 17, 2026</p>

      <div className="prose text-primary/75 text-xs sm:text-sm font-light leading-relaxed space-y-6">
        <p>
          Welcome to Craft Creator's Studio. These terms and conditions outline the rules and regulations for the use of our services.
        </p>

        <h3 className="font-display text-lg font-bold text-primary mt-6">1. Customer Content Ownership</h3>
        <p>
          By uploading any digital photograph, print copy details, or bringing physical drawings/paintings to our Colaba studio, you represent and warrant that you own or have full legal rights to reproduce and frame the content.
        </p>

        <h3 className="font-display text-lg font-bold text-primary mt-6">2. Order Approval & Assembly</h3>
        <p>
          All estimates generated on this website are indicative. A framing project is only officially confirmed once our workshop validates your dimensions, checks image DPI resolution, receives payment via UPI/Bank Transfer, and starts assembly work.
        </p>

        <h3 className="font-display text-lg font-bold text-primary mt-6">3. Pickup & Courier Deliveries</h3>
        <p>
          We pack framed items in rigid crates for shipping. Once courier transit commences, we are not responsible for delays caused by third-party logistics. Finished frames not picked up from our studio within 90 days may be subject to disposal or storage fees.
        </p>

        <h3 className="font-display text-lg font-bold text-primary mt-6">4. Contact Channels</h3>
        <p>
          For queries related to our service terms, please contact ourColaba workspace at hello@craftcreators.in.
        </p>
      </div>

      <div className="pt-8">
        <Link to="/" className="text-accent hover:underline text-xs">&larr; Back to Home</Link>
      </div>
    </div>
  );
};

export default TermsPage;
