import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppButton';

const FAQS = [
  {
    category: 'Ordering & Customization',
    items: [
      {
        question: 'How do I place an order?',
        answer: 'Use our online frame configurator to select your frame, material, size, glass, and mount options. Upload your photo or choose "I will bring a printed copy." Fill in your contact info, and click "Submit & Open WhatsApp". This sends the details directly to our studio. We will confirm the price quote and timeline via chat.'
      },
      {
        question: 'Do you offer custom frame sizes?',
        answer: 'Yes! Select the "Custom Size" option inside the configurator, and enter your exact width and height dimensions in inches. Our workshop will cut the frame and mounts exact to your measurements.'
      },
      {
        question: 'What formats can I upload for digital printing?',
        answer: 'We accept JPG, JPEG, PNG, WEBP, and HEIC files up to 15MB. For best printing results, upload the highest resolution file possible.'
      },
      {
        question: 'Can I bring physical photos or original paintings to frame?',
        answer: 'Absolutely. Select "I will bring a printed copy" in the configurator. You can bring or courier your physical prints, canvas paintings, or diplomas directly to our Mumbai studio for professional conservation framing.'
      }
    ]
  },
  {
    category: 'Materials & Glazing',
    items: [
      {
        question: 'What materials are your frames made of?',
        answer: 'We use solid hardwoods (Teak, Oak, American Walnut), high-density MDF for sleek painted modern finishes, anodised aluminium, brushed steel, and composite resin for ornate vintage moldings.'
      },
      {
        question: 'What glass options do you offer?',
        answer: 'We offer Standard float glass, Anti-Glare glass (which diffuses glare under direct light), UV-Protection glass (which filters 99% of UV rays to prevent photo fading), and Museum glass (optically clear, non-reflective glazing).'
      },
      {
        question: 'What is a mount board?',
        answer: 'A mount board (or mat board) is a thick, acid-free card board frame that surrounds your photo inside the frame. It adds white space, draws focus to the image, and keeps the photo from directly touching the glass.'
      }
    ]
  },
  {
    category: 'Shipping, Delivery & Payment',
    items: [
      {
        question: 'How long does production take?',
        answer: 'Standard wooden and metal frames are completed in 2-4 working days. Ornate baroque, double mount, or custom-designed frames take 5-10 working days.'
      },
      {
        question: 'Do you ship custom frames across India?',
        answer: 'Yes! We ship nationwide. All frames are bubble-wrapped, padded, and packed inside heavy wooden boxes to prevent any damage or glass breakage during transit.'
      },
      {
        question: 'Do you require online payment on this site?',
        answer: 'No online payments are taken on this website. All orders are reviewed by our team and paid directly via Bank Transfer or UPI when we confirm the specifications with you on WhatsApp.'
      },
      {
        question: 'Do you take bulk orders?',
        answer: 'Yes, we take bulk framing orders for hotels, cafes, offices, weddings, and galleries. Volume pricing discounts start at 10 or more frames. Inquire via our WhatsApp channel for bulk estimates.'
      }
    ]
  }
];

const FAQPage = () => {
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleAccordion = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndexes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-16 min-h-screen">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Common Inquiries</span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-primary">Frequently Asked Questions</h1>
        <p className="text-primary/60 text-xs sm:text-sm font-light leading-relaxed">
          Find answers to common questions about frame customization, material details, shipping rates, and physical/digital artwork handling.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-10">
        {FAQS.map((category, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-accent font-semibold border-b border-gray-100 pb-2">
              {category.category}
            </h3>

            <div className="space-y-3">
              {category.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`;
                const isOpen = !!openIndexes[key];

                return (
                  <div 
                    key={itemIdx}
                    className="bg-white border border-[#eaeaea] rounded-2xl shadow-card transition-all duration-300 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleAccordion(catIdx, itemIdx)}
                      className="w-full text-left p-6 flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-display text-sm sm:text-base font-bold text-primary">
                        {item.question}
                      </h4>
                      <span className="text-primary/45 flex-shrink-0">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="p-6 pt-0 border-t border-gray-50 text-xs sm:text-sm leading-relaxed text-primary/70 font-light bg-gray-50/50">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Help WhatsApp Footer */}
      <div className="text-center space-y-4 pt-10">
        <h3 className="font-display text-xl font-bold text-primary">Still Have Questions?</h3>
        <p className="text-primary/60 text-xs max-w-sm mx-auto font-light leading-relaxed">
          Chat directly with our master framing specialists. Send us a message on WhatsApp and we will get back to you immediately.
        </p>
        <div className="pt-2">
          <a
            href="https://wa.me/918077037277?text=Hello%2C%20I%20have%20a%20question%20about%20your%20custom%20photo%20framing%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-3.5 rounded-full font-semibold uppercase tracking-widest text-[10px] transition-all duration-300"
          >
            <WhatsAppIcon /> Ask on WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
};

export default FAQPage;
