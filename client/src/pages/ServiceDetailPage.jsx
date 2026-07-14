import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Calendar } from 'lucide-react';
import { serviceService } from '../services/serviceService';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await serviceService.getBySlug(slug);
        setService(data.data);
      } catch (error) {
        console.error('Failed to load service', error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center skeleton" />;
  if (!service) return <div className="h-screen flex items-center justify-center text-display-sm">Service Not Found</div>;

  const whatsappMessage = encodeURIComponent(`Hello, I am interested in the ${service.title} service. Could you provide more details?`);
  const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="pt-20 pb-20 bg-background">
      {/* Hero Banner */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-primary flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src={service.heroImage || '/sample.png'} 
            alt={service.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20"
        >
          <h1 className="text-display-xl font-display text-white mb-6">
            {service.title}
          </h1>
          <p className="text-xl text-white/90 font-body font-light max-w-2xl mx-auto leading-relaxed">
            {service.description}
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-heading mb-8">Service Overview</h2>
              <div className="prose prose-lg text-primary-600 font-light leading-relaxed mb-16">
                {service.overview?.split('\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>

              {service.gallery && service.gallery.length > 0 && (
                <>
                  <h2 className="section-heading mb-8">Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                    {service.gallery.map((img, idx) => (
                      <div key={idx} className="aspect-[4/3] overflow-hidden luxury-card">
                        <img src={img} alt={`${service.title} gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {service.faqs && service.faqs.length > 0 && (
                <>
                  <h2 className="section-heading mb-8">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                    {service.faqs.map((faq, idx) => (
                      <div key={idx} className="border-b border-primary-100 pb-6">
                        <h4 className="text-lg font-display text-primary mb-2">{faq.question}</h4>
                        <p className="text-primary-600 font-light">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-4">
            <motion.div 
              className="luxury-card p-8 sticky top-32"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-2xl text-primary mb-2">Investment</h3>
              <div className="text-4xl font-display text-accent mb-8">
                {service.price > 0 ? `₹${service.price.toLocaleString('en-IN')}` : 'Custom'}
                <span className="text-sm font-body text-primary-400 block mt-1 uppercase tracking-widest">Starting Price</span>
              </div>

              {service.includes && service.includes.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-body font-medium uppercase tracking-widest text-primary mb-4">What's Included</h4>
                  <ul className="space-y-3">
                    {service.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-primary-600 text-sm">
                        <Check size={18} className="text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-6 border-t border-primary-100 flex flex-col gap-4">
                <Link to={`/book?service=${service.id}`} className="btn-primary w-full">
                  <Calendar size={18} /> Book Now
                </Link>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-8 text-sm font-body font-medium tracking-widest uppercase text-white bg-[#25D366] hover:bg-[#20ba5c] hover:scale-[1.02] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#25D366] shadow-md hover:shadow-lg group"
                >
                  <svg 
                    className="w-5 h-5 fill-current animate-pulse text-white transition-transform duration-300 group-hover:scale-110" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.019 14.07 1 11.993 1c-5.442 0-9.87 4.372-9.874 9.802-.001 1.968.512 3.888 1.488 5.607l-.985 3.593 3.735-.98l.186.11zm11.378-7.904c-.285-.143-1.688-.836-1.95-.931-.262-.095-.453-.143-.644.143-.191.285-.738.931-.905 1.121-.167.19-.334.214-.619.071-.285-.143-1.204-.445-2.293-1.415-.848-.758-1.42-1.696-1.587-1.982-.167-.285-.018-.439.124-.58.128-.127.285-.334.429-.5.143-.167.19-.286.286-.476.095-.19.048-.357-.024-.5-.071-.143-.644-1.554-.882-2.126-.233-.558-.469-.482-.644-.491-.167-.008-.358-.01-.55-.01s-.502.072-.765.358c-.263.286-1.004.981-1.004 2.392s1.028 2.772 1.171 2.963c.143.19 2.023 3.1 4.899 4.343.684.296 1.218.473 1.635.605.687.218 1.312.187 1.806.114.55-.082 1.688-.692 1.926-1.36.238-.67.238-1.243.167-1.36-.071-.118-.262-.19-.548-.333z" />
                  </svg>
                  WhatsApp Inquiry
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
