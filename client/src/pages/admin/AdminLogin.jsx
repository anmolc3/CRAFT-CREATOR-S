import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock login for now
    setTimeout(() => {
      localStorage.setItem('admin_token', 'mock_token_123');
      window.location.href = '/admin';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card p-10 max-w-md w-full bg-white"
      >
        <div className="flex flex-col items-center mb-8">
          <img src="/cc-logo.svg" alt="Craft Creator's Logo" className="h-20 w-20 object-contain rounded-full shadow-md mb-4" />
          <h1 className="text-3xl font-display text-primary text-center">Admin Portal</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          
          <div>
            <label className="form-label">Email</label>
            <input type="email" required className="form-input" defaultValue="admin@sikhar.photography" />
          </div>
          
          <div>
            <label className="form-label">Password</label>
            <input type="password" required className="form-input" defaultValue="Admin@1234" />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
