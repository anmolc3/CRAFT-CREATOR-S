import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@craftcreators.in');
  const [password, setPassword] = useState('Admin@1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('admin_token', res.data.token);
        window.location.href = '/admin';
      } else {
        setError(res.data.message || 'Login failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-10 max-w-md w-full bg-[#141414] rounded-3xl border border-[#222] shadow-luxury"
      >
        <div className="flex flex-col items-center mb-8">
          <span className="text-2xl font-display font-bold tracking-widest text-accent mb-1">CRAFT CREATOR'S</span>
          <h1 className="text-[10px] tracking-[0.25em] font-body text-white/40 uppercase font-semibold">Admin Portal</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-xs text-center font-semibold">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-accent hover:bg-white text-primary hover:text-primary py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-luxury"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
