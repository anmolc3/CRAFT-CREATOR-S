import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BookingForm from '../components/booking/BookingForm';
import { serviceService } from '../services/serviceService';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service') || '';
  
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
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <section className="container-luxury mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-accent uppercase tracking-widest text-sm font-medium mb-4 block">
            Inquire & Book
          </span>
          <h1 className="text-display-lg font-display text-primary mb-6">
            Reserve Your Session
          </h1>
          <p className="text-primary-600 text-lg leading-relaxed">
            Please fill out the form below to request a booking. I accept a limited number of commissions each year to ensure the highest quality for every client.
          </p>
        </motion.div>
      </section>

      <section className="container-luxury max-w-4xl">
        <motion.div 
          className="luxury-card p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="space-y-6">
              <div className="h-12 skeleton w-full" />
              <div className="h-12 skeleton w-full" />
              <div className="h-32 skeleton w-full" />
            </div>
          ) : (
            <BookingForm services={services} defaultServiceId={serviceId} />
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default BookingPage;
