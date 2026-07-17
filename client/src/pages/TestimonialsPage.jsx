import React, { useEffect, useState } from 'react';
import { testimonialService } from '../services/testimonialService';
import { StarRating } from '../components/common/StarRating';
import { ArrowRight, Quote } from 'lucide-react';

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testimonialService.getTestimonials()
      .then(res => setTestimonials(res.data.data || []))
      .catch(err => console.error('Error fetching testimonials:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 min-h-screen">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Verified Reviews</span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-primary">Customer Stories</h1>
        <p className="text-primary/60 text-xs sm:text-sm font-light leading-relaxed">
          Read reviews from home decorators, interior architects, professional wedding photographers, and corporate managers who have custom-framed their prints with us.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div 
              key={test.id}
              className="bg-white border border-[#eaeaea] rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              {/* Decorative Quote mark */}
              <Quote className="absolute right-6 top-6 text-accent/10 h-16 w-16 select-none pointer-events-none" />

              <div className="space-y-3 relative z-10">
                <StarRating rating={test.rating} size={14} />
                <p className="text-primary/75 text-xs sm:text-sm italic leading-relaxed font-light">
                  "{test.quote}"
                </p>
              </div>

              <div className="border-t border-[#f5f5f5] pt-4 flex items-center gap-3">
                {test.photoUrl ? (
                  <img src={test.photoUrl} alt={test.name} className="h-10 w-10 rounded-full object-cover border border-[#eaeaea]" />
                ) : (
                  <div className="h-10 w-10 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {test.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs text-primary">{test.name}</h4>
                  <span className="text-[10px] text-primary/40 uppercase tracking-widest block">{test.title || 'Client'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to action section */}
      <section className="text-center bg-gray-50 border border-gray-100 rounded-3xl p-10 md:p-14 space-y-4">
        <h3 className="font-display text-2xl font-bold text-primary">Have You Framed with Us?</h3>
        <p className="text-primary/60 text-xs max-w-sm mx-auto font-light leading-relaxed">
          We would love to hear your feedback. Send us your review directly on WhatsApp or drop us an email so we can feature your gallery wall!
        </p>
        <div className="pt-2">
          <a
            href="https://wa.me/918077037277?text=Hello%2C%20I%20would%20like%20to%20share%20my%20framing%20review%20with%20you%20guys."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3 rounded-full font-semibold uppercase tracking-widest text-[10px] transition-all duration-300"
          >
            🙋🏻‍♂️ Send Feedback
          </a>
        </div>
      </section>

    </div>
  );
};

export default TestimonialsPage;
