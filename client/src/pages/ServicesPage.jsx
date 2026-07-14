import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { serviceService } from '../services/serviceService';
import ServiceCard from '../components/services/ServiceCard';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAll();
        setServices(data.data || []);
      } catch (error) {
        console.error('Failed to load services', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="container-luxury mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-accent uppercase tracking-widest text-sm font-medium mb-4 block">
            Expertise & Vision
          </span>
          <h1 className="text-display-lg font-display text-primary mb-6">
            Photography Services
          </h1>
          <p className="text-primary-600 text-lg leading-relaxed">
            From intimate weddings to grand wildlife safaris, discover bespoke photography experiences tailored to capture your most meaningful moments.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="container-luxury">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton aspect-[4/5] luxury-card rounded-none" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.filter(s => s.status === 'active').map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {!loading && services.length === 0 && (
          <div className="text-center py-20">
            <h3 className="font-display text-2xl text-primary mb-2">No Services Currently Available</h3>
            <p className="text-primary-600">Please check back later for our updated offerings.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ServicesPage;
