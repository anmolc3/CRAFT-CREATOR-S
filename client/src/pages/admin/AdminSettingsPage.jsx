import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { Save } from 'lucide-react';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsService.getSettings();
      const data = res.data.data;
      setSettings(data);
      
      setBusinessName(data.businessName || '');
      setTagline(data.tagline || '');
      setWhatsappNumber(data.whatsappNumber || '');
      setPhone(data.phone || '');
      setEmail(data.email || '');
      setAddress(data.address || '');
      setHeroTitle(data.heroTitle || '');
      setHeroSubtitle(data.heroSubtitle || '');
      setAboutText(data.aboutText || '');
      setSeoTitle(data.seoTitle || '');
      setSeoDescription(data.seoDescription || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        businessName,
        tagline,
        whatsappNumber,
        phone,
        email,
        address,
        heroTitle,
        heroSubtitle,
        aboutText,
        seoTitle,
        seoDescription
      };
      await settingsService.updateSettings(payload);
      alert('Studio configuration settings successfully saved.');
    } catch (err) {
      console.error(err);
      alert('Error updating configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs text-gray-300">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h2 className="text-xl font-display text-white font-bold">Studio Configuration Settings</h2>
          <p className="text-gray-400 text-xs mt-1">Configure business info, phone numbers, contact address and homepage hero sections</p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-8 bg-[#141414] p-8 rounded-2xl border border-[#222] shadow-lg">
        
        {/* Section 1: Business profile */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-accent border-b border-[#222] pb-2 uppercase tracking-wider">1. Business Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Business Name</label>
              <input 
                type="text" 
                required 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Tagline</label>
              <input 
                type="text" 
                value={tagline} 
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact channels */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-accent border-b border-[#222] pb-2 uppercase tracking-wider">2. Contact Channels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">WhatsApp Inquiry Number</label>
              <input 
                type="text" 
                required 
                value={whatsappNumber} 
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 918077037277"
                className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Contact Phone</label>
              <input 
                type="text" 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Inquiry Email</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Studio Workspace Address</label>
            <input 
              type="text" 
              required 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Section 3: Homepage content */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-accent border-b border-[#222] pb-2 uppercase tracking-wider">3. Homepage Hero & About</h3>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Hero Heading Title</label>
            <textarea 
              rows="2"
              required 
              value={heroTitle} 
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent resize-none font-display text-sm font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Hero Subtitle</label>
            <input 
              type="text" 
              required 
              value={heroSubtitle} 
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">About Description Text</label>
            <textarea 
              rows="4"
              required 
              value={aboutText} 
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent resize-none font-light leading-relaxed"
            />
          </div>
        </div>

        {/* Section 4: SEO Metadata */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-accent border-b border-[#222] pb-2 uppercase tracking-wider">4. Search Engine Optimization (SEO)</h3>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Meta SEO Title</label>
            <input 
              type="text" 
              required 
              value={seoTitle} 
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Meta SEO Description</label>
            <textarea 
              rows="3"
              required 
              value={seoDescription} 
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent resize-none font-light leading-relaxed"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-[#222] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-accent hover:bg-white text-primary px-8 py-3.5 rounded-full font-semibold uppercase tracking-wider text-[10px] transition-all shadow-luxury flex items-center gap-2"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminSettingsPage;
