import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 min-h-screen">
      <h1 className="font-display text-3xl sm:text-5xl font-bold text-primary border-b border-[#eaeaea] pb-4">
        Privacy Policy
      </h1>
      <p className="text-xs text-primary/40 uppercase tracking-widest font-semibold">Last Updated: July 17, 2026</p>

      <div className="prose text-primary/75 text-xs sm:text-sm font-light leading-relaxed space-y-6">
        <p>
          At Craft Creator's Studio, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Craft Creator's Studio and how we use it.
        </p>

        <h3 className="font-display text-lg font-bold text-primary mt-6">1. Information We Collect</h3>
        <p>
          If you use our online frame configurator, we collect the details you provide, including your name, email address, phone number, frame selection specs, and any photograph files you choose to upload. Uploaded photographs are stored locally on our servers solely for print and assembly processing.
        </p>

        <h3 className="font-display text-lg font-bold text-primary mt-6">2. Image Protection & Security</h3>
        <p>
          We employ strict security measures to protect your uploaded images. Customer images are kept in secure directories on our server. They are never shared, publicised, or used for commercial/promotional purposes without your explicit written consent.
        </p>

        <h3 className="font-display text-lg font-bold text-primary mt-6">3. How We Use Your Details</h3>
        <p>
          We use the information we collect to process your custom framing requests, send quotes, open direct WhatsApp inquiries, contact you regarding pickup or delivery, and manage newsletter subscriptions.
        </p>

        <h3 className="font-display text-lg font-bold text-primary mt-6">4. Contact Us</h3>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at hello@craftcreators.in.
        </p>
      </div>

      <div className="pt-8">
        <Link to="/" className="text-accent hover:underline text-xs">&larr; Back to Home</Link>
      </div>
    </div>
  );
};

export default PrivacyPage;
