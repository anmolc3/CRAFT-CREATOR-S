import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { serviceService } from '../services/serviceService';
import { DetailSkeleton } from '../components/common/SkeletonLoader';
import { WhatsAppIcon } from '../components/common/WhatsAppButton';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    serviceService.getServiceBySlug(slug)
      .then(res => {
        setService(res.data.data);
      })
      .catch(error => {
        console.error('Failed to load service', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <DetailSkeleton />;
  
  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold">Service Not Found</h2>
        <Link to="/services" className="text-accent hover:underline text-sm">&larr; Back to services</Link>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(`Hello Craft Creator's,\n\nI am interested in your "${service.title}" custom framing service. Could you please provide details on ordering?`);
  const whatsappUrl = `https://wa.me/918077037277?text=${whatsappMessage}`;

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] w-full bg-primary flex items-center justify-center">
        {service.heroImage ? (
          <div className="absolute inset-0">
            <img 
              src={service.heroImage} 
              alt={service.title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-primary opacity-90" />
        )}
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-10 space-y-4">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-1.5 text-accent hover:text-white text-xs font-semibold uppercase tracking-widest transition-colors mb-4"
          >
            <ArrowLeft size={12} /> Our Services
          </Link>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-white font-bold tracking-wide">
            {service.title}
          </h1>
          <p className="text-sm sm:text-base text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
            {service.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary border-b border-[#f5f5f5] pb-2">Service Overview</h2>
              <div className="prose text-primary/70 text-xs sm:text-sm font-light leading-relaxed space-y-4">
                {service.overview ? (
                  service.overview.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>Get professional museum-grade framing for your prints and paintings with Craft Creator's studio.</p>
                )}
              </div>
            </div>

            {/* Gallery Images (if any) */}
            {service.gallery && service.gallery.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-primary">Service Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.gallery.map((img, idx) => (
                    <div key={idx} className="aspect-[4/3] overflow-hidden rounded-2xl border border-gray-150 shadow-card">
                      <img src={img} alt={`${service.title} gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-[#f5f5f5]">
                <h2 className="font-display text-2xl font-bold text-primary">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {service.faqs.map((faq, idx) => (
                    <div key={idx} className="border-b border-[#f5f5f5] pb-4 space-y-2">
                      <h4 className="font-display text-base font-bold text-primary">{faq.question}</h4>
                      <p className="text-primary/70 text-xs leading-relaxed font-light">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Cost Summary & WhatsApp Action */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-[#eaeaea] shadow-card space-y-6 sticky top-28">
              <div>
                <span className="text-[10px] uppercase text-primary/40 tracking-widest block font-semibold mb-1">Starting Price</span>
                <div className="text-3xl font-display font-bold text-primary">
                  {service.startingPrice > 0 ? `₹${service.startingPrice.toLocaleString('en-IN')}` : 'Request Quote'}
                </div>
                <div className="text-[10px] uppercase text-primary/40 tracking-widest block mt-2 font-medium">Estimated Duration</div>
                <div className="text-xs text-primary/70 font-semibold">{service.duration || '2-4 working days'}</div>
              </div>

              {service.includes && service.includes.length > 0 && (
                <div className="space-y-4 border-t border-[#f5f5f5] pt-4">
                  <h4 className="text-[10px] font-semibold uppercase tracking-widest text-accent">What's Included</h4>
                  <ul className="space-y-3">
                    {service.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-primary/70 text-xs font-light">
                        <Check size={16} className="text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-6 border-t border-[#f5f5f5] flex flex-col gap-3">
                <Link 
                  to="/configure" 
                  className="bg-primary hover:bg-accent text-white hover:text-primary py-3.5 rounded-full text-center text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-luxury"
                >
                  Configure Frame
                </Link>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 py-3.5 text-xs font-semibold tracking-widest uppercase text-white bg-[#25D366] hover:bg-[#20ba5c] rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <WhatsAppIcon /> Inquiry via WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ServiceDetailPage;
