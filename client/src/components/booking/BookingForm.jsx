import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { bookingService } from '../../services/bookingService';

const BookingForm = ({ services = [], defaultServiceId = '' }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      serviceId: defaultServiceId
    }
  });
  
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const onSubmit = async (data) => {
    try {
      setSubmitError('');
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'referenceImages') {
          if (data.referenceImages.length > 0) {
            Array.from(data.referenceImages).forEach(file => {
              formData.append('referenceImages', file);
            });
          }
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await bookingService.create(formData);
      
      if (response.success) {
        setSubmitSuccess(true);
        reset();
        
        // Generate WhatsApp Link
        const selectedService = services.find(s => s.id === data.serviceId);
        const serviceName = selectedService ? selectedService.title : data.eventType || 'Photography Session';
        
        const waMessage = `Hello, I would like to book a photography session.\n\nService: ${serviceName}\nPreferred Date: ${data.preferredDate || 'TBD'}\nLocation: ${data.location || 'TBD'}\nGuests: ${data.guests || 'N/A'}\nBudget: ₹${data.budget || 'TBD'}\n\nPlease contact me regarding availability.`;
        
        const waUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
        
        // Open WhatsApp after a short delay
        setTimeout(() => {
          window.open(waUrl, '_blank');
        }, 1500);
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to submit booking request. Please try again.');
    }
  };

  if (submitSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-8 luxury-card"
      >
        <h3 className="font-display text-3xl text-primary mb-4">Thank You</h3>
        <p className="text-primary-600 text-lg font-light mb-8 max-w-md mx-auto">
          Your booking request has been received. We will contact you shortly. Opening WhatsApp to complete your inquiry...
        </p>
        <button onClick={() => setSubmitSuccess(false)} className="btn-secondary">
          Submit Another Request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded text-sm">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Full Name *</label>
          <input 
            type="text" 
            className={`form-input ${errors.name ? 'border-red-500' : ''}`}
            {...register('name', { required: 'Full name is required' })} 
          />
          {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
        </div>
        
        <div>
          <label className="form-label">Email Address *</label>
          <input 
            type="email" 
            className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
            })} 
          />
          {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
        </div>

        <div>
          <label className="form-label">Phone Number *</label>
          <input 
            type="tel" 
            className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
            {...register('phone', { required: 'Phone number is required' })} 
          />
          {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>}
        </div>

        <div>
          <label className="form-label">WhatsApp Number</label>
          <input 
            type="tel" 
            className="form-input"
            {...register('whatsapp')} 
            placeholder="If different from phone"
          />
        </div>

        <div>
          <label className="form-label">Service Required *</label>
          <select 
            className={`form-input ${errors.serviceId ? 'border-red-500' : ''}`}
            {...register('serviceId', { required: 'Please select a service' })}
          >
            <option value="">Select a service...</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
            <option value="custom">Other / Custom Service</option>
          </select>
          {errors.serviceId && <span className="text-red-500 text-xs mt-1 block">{errors.serviceId.message}</span>}
        </div>

        <div>
          <label className="form-label">Event Type (If custom)</label>
          <input 
            type="text" 
            className="form-input"
            {...register('eventType')} 
          />
        </div>

        <div>
          <label className="form-label">Preferred Date *</label>
          <input 
            type="date" 
            className={`form-input ${errors.preferredDate ? 'border-red-500' : ''}`}
            {...register('preferredDate', { required: 'Preferred date is required' })} 
          />
          {errors.preferredDate && <span className="text-red-500 text-xs mt-1 block">{errors.preferredDate.message}</span>}
        </div>

        <div>
          <label className="form-label">Alternate Date</label>
          <input 
            type="date" 
            className="form-input"
            {...register('alternateDate')} 
          />
        </div>

        <div>
          <label className="form-label">Location / Venue</label>
          <input 
            type="text" 
            className="form-input"
            {...register('location')} 
          />
        </div>

        <div>
          <label className="form-label">Number of Guests</label>
          <input 
            type="number" 
            className="form-input"
            {...register('guests')} 
          />
        </div>

        <div>
          <label className="form-label">Estimated Budget (₹)</label>
          <input 
            type="number" 
            className="form-input"
            {...register('budget')} 
          />
        </div>

        <div>
          <label className="form-label">Preferred Time</label>
          <input 
            type="time" 
            className="form-input"
            {...register('time')} 
          />
        </div>
      </div>

      <div>
        <label className="form-label">Additional Requirements</label>
        <textarea 
          className="form-input min-h-[120px] resize-y"
          {...register('requirements')}
          placeholder="Tell me more about your vision, the story you want to tell, or any specific shots you have in mind..."
        ></textarea>
      </div>

      <div>
        <label className="form-label">Reference Images (Optional)</label>
        <input 
          type="file" 
          multiple
          accept="image/*"
          className="form-input file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-primary/5 file:text-primary file:font-body file:text-sm file:font-medium hover:file:bg-primary/10"
          {...register('referenceImages')} 
        />
        <span className="text-xs text-primary-400 mt-1 block">Upload mood boards or inspiration images (Max 5 files)</span>
      </div>

      <div className="pt-4 border-t border-primary-100">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-primary w-full md:w-auto"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
