import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceService } from '../services/serviceService';
import { ServiceSkeleton } from '../components/common/SkeletonLoader';
import { ArrowRight, Shield, Award, Clock } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceService.getServices()
      .then(res => setServices(res.data.data || []))
      .catch(err => console.error('Error fetching services:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 min-h-screen">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Custom Solutions</span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-primary">Our Framing Services</h1>
        <p className="text-primary/60 text-xs sm:text-sm font-light leading-relaxed">
          From family photos and graduation diplomas to large-scale canvas gallery installations and bulk commercial orders, we provide custom wood and metal framing solutions designed to match your needs.
        </p>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, i) => <ServiceSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white border border-[#eaeaea] rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-accent uppercase tracking-widest bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                    {service.duration || 'Quick service'}
                  </span>
                  {service.featured && (
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                
                <h3 className="font-display text-xl sm:text-2xl font-bold text-primary leading-snug">
                  {service.title}
                </h3>
                
                <p className="text-primary/60 text-xs leading-relaxed font-light line-clamp-4">
                  {service.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#f5f5f5] mt-8 flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase text-primary/40 tracking-widest block font-medium">Starting from</span>
                  <span className="font-display text-base font-bold text-primary">₹{service.startingPrice || 'TBD'}</span>
                </div>

                <Link 
                  to={`/services/${service.slug}`}
                  className="bg-primary hover:bg-accent text-white hover:text-primary px-5 py-2.5 rounded-full text-[9px] font-semibold tracking-widest uppercase transition-all duration-300 shadow-luxury flex items-center gap-1"
                >
                  Details <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assurance Section */}
      <section className="bg-primary text-white rounded-3xl p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
        <div className="space-y-3">
          <Shield size={24} className="text-accent mx-auto md:mx-0" />
          <h4 className="font-display text-lg font-bold">Safe Preservation</h4>
          <p className="text-white/60 text-xs font-light leading-relaxed">
            All adhesives, matting, and spacers are chemically inert and acid-free, guaranteeing they won't damage or stain original drawings or certifications.
          </p>
        </div>

        <div className="space-y-3">
          <Clock size={24} className="text-accent mx-auto md:mx-0" />
          <h4 className="font-display text-lg font-bold">Timely Completion</h4>
          <p className="text-white/60 text-xs font-light leading-relaxed">
            Standard framing jobs are prepared in 2–4 working days. We offer express options for clients requiring urgent wedding or corporate gallery setups.
          </p>
        </div>
      </section>

    </div>
  );
};

export default ServicesPage;
