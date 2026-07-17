import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { configuratorService } from '../services/configuratorService';
import { inquiryService } from '../services/inquiryService';
import { frameService } from '../services/frameService';
import RoomPreview from '../components/configurator/RoomPreview';
import { generateWhatsAppLink, WhatsAppIcon } from '../components/common/WhatsAppButton';
import { Eye, Info, Check, CloudUpload, Trash2, ArrowRight } from 'lucide-react';

const ConfiguratorPage = () => {
  const [searchParams] = useSearchParams();
  const initialFrameSlug = searchParams.get('frame') || '';

  // Options fetched from DB
  const [frames, setFrames] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [glassOptions, setGlassOptions] = useState([]);
  const [mountOptions, setMountOptions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configuration State
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  
  // Custom sizes
  const [customWidth, setCustomWidth] = useState(12);
  const [customHeight, setCustomHeight] = useState(18);

  const [selectedGlass, setSelectedGlass] = useState(null);
  const [selectedMount, setSelectedMount] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Photo option
  const [photoOption, setPhotoOption] = useState('upload'); // 'upload' | 'bring'
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Inquiry form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load Configurator Options
  useEffect(() => {
    configuratorService.getConfigOptions()
      .then(res => {
        const data = res.data.data;
        setFrames(data.frames || []);
        setSizes(data.sizes || []);
        setGlassOptions(data.glassOptions || []);
        setMountOptions(data.mountOptions || []);
        setMaterials(data.materials || []);
        setColors(data.colors || []);

        // Autofill if a frame slug is passed in URL
        if (initialFrameSlug && data.frames) {
          const preselected = data.frames.find(f => f.slug === initialFrameSlug);
          if (preselected) {
            handleFrameSelect(preselected);
          }
        } else if (data.frames && data.frames.length > 0) {
          handleFrameSelect(data.frames[0]);
        }

        // Default Glass & Mount
        if (data.glassOptions && data.glassOptions.length > 0) {
          setSelectedGlass(data.glassOptions[0]);
        }
        if (data.mountOptions && data.mountOptions.length > 0) {
          setSelectedMount(data.mountOptions[0]);
        }
      })
      .catch(err => console.error('Error fetching configurator options:', err))
      .finally(() => setLoading(false));
  }, [initialFrameSlug]);

  const handleFrameSelect = (frame) => {
    setSelectedFrame(frame);
    setSelectedMaterial(frame.material || '');
    setSelectedColor(frame.colors?.[0] || '');
    
    // Auto size preselection
    if (sizes && sizes.length > 0) {
      const match = sizes.find(s => frame.availableSizes?.includes(s.label));
      setSelectedSize(match || sizes[0]);
    }
  };

  // Image Upload handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhotoFile = () => {
    setPhotoFile(null);
    setPhotoPreview('');
  };

  // Live Price Calculations
  const calculateCosts = () => {
    if (!selectedFrame) return { frameBase: 0, materialAdder: 0, sizePrice: 0, glassPrice: 0, mountPrice: 0, total: 0 };

    const frameBase = selectedFrame.basePrice || 2000;
    
    // Material adder
    const matObj = materials.find(m => m.name === selectedMaterial);
    const materialAdder = matObj ? matObj.priceAdder : 0;

    // Size calculation
    let sizePrice = 0;
    if (selectedSize) {
      if (selectedSize.isCustom) {
        // Simple custom size calculator: width * height * 12 + 1000 base
        sizePrice = (customWidth * customHeight * 12) + 1000;
      } else {
        sizePrice = selectedSize.basePrice || 0;
      }
    }

    // Glass price
    const glassPrice = selectedGlass ? selectedGlass.price : 0;

    // Mount price
    const mountPrice = selectedMount ? selectedMount.price : 0;

    const singleItemTotal = frameBase + materialAdder + sizePrice + glassPrice + mountPrice;
    const total = singleItemTotal * quantity;

    return {
      frameBase,
      materialAdder,
      sizePrice,
      glassPrice,
      mountPrice,
      total
    };
  };

  const costs = calculateCosts();

  // Handle Order Submit
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert("Please fill in your Name, Email, and Phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('customerName', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('whatsapp', phone);
      formData.append('frameName', selectedFrame?.name || '');
      formData.append('frameId', selectedFrame?.id || '');
      formData.append('material', selectedMaterial);
      formData.append('color', selectedColor);
      
      if (selectedSize?.isCustom) {
        formData.append('size', `Custom (${customWidth}×${customHeight} in)`);
        formData.append('customWidth', customWidth);
        formData.append('customHeight', customHeight);
      } else {
        formData.append('size', selectedSize?.label || '');
      }
      
      formData.append('glass', selectedGlass?.name || '');
      formData.append('mount', selectedMount?.name || '');
      formData.append('quantity', quantity);
      formData.append('photoOption', photoOption);
      if (photoOption === 'upload' && photoFile) {
        formData.append('photo', photoFile);
      }

      const res = await inquiryService.submitInquiry(formData);

      if (res.data.success) {
        setSubmitSuccess(true);
        
        // Generate WhatsApp Message text
        const sizeLabel = selectedSize?.isCustom 
          ? `${customWidth}×${customHeight} Custom` 
          : selectedSize?.label;
        const photoLabel = photoOption === 'upload' ? 'Uploaded Digitally' : 'I will bring a printed copy.';

        const waText = `Hello Craft Creator's,\n\nI would like to place a custom framing order.\n\n` +
          `• Frame: ${selectedFrame?.name}\n` +
          `• Material: ${selectedMaterial}\n` +
          `• Color: ${selectedColor}\n` +
          `• Size: ${sizeLabel} in\n` +
          `• Glass: ${selectedGlass?.name}\n` +
          `• Mount: ${selectedMount?.name}\n` +
          `• Quantity: ${quantity}\n` +
          `• Photo: ${photoLabel}\n\n` +
          `Customer Details:\n` +
          `Name: ${name}\n` +
          `Phone: ${phone}\n\n` +
          `Please confirm my custom framing quotation and estimated timeline.`;

        // Direct transfer to WhatsApp Link
        const waLink = generateWhatsAppLink("918077037277", waText);
        window.open(waLink, '_blank');
      }
    } catch (err) {
      console.error('Error submitting frame inquiry:', err);
      alert('There was a problem submitting your inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase text-primary/40 tracking-widest font-semibold">Configurator Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Design Studio</span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-primary">Frame Configurator</h1>
        <p className="text-primary/60 text-xs sm:text-sm font-light">
          Build and preview your frame details in real-time. Follow the steps, view estimate instantly, and submit to launch your project.
        </p>
      </div>

      {/* Main Grid: Options (left) + Visualizer/Preview (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: Options Panel */}
        <div className="lg:col-span-7 space-y-8 bg-white p-8 rounded-3xl border border-[#eaeaea] shadow-card">
          
          {/* Step 1: Select Frame Design */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-primary border-b border-[#f5f5f5] pb-2">1. Choose Frame Design</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-2">
              {frames.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFrameSelect(f)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                    selectedFrame?.id === f.id
                      ? 'border-accent bg-accent/5 ring-1 ring-accent'
                      : 'border-gray-200 hover:border-accent hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold text-xs text-primary line-clamp-1">{f.name}</span>
                  <span className="text-[10px] text-primary/40 block mt-1 uppercase">{f.material}</span>
                  <span className="text-xs font-bold text-accent mt-auto">₹{f.basePrice}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Material & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Material */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">2. Frame Material</label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-accent text-primary"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.name}>{m.name} {m.priceAdder > 0 ? `(+₹${m.priceAdder})` : ''}</option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">3. Frame Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`h-8 px-3 rounded-lg border text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      selectedColor === c.name 
                        ? 'border-accent bg-accent/5 text-primary' 
                        : 'border-gray-200 text-primary/70 hover:border-accent'
                    }`}
                  >
                    <span 
                      className="h-3.5 w-3.5 rounded-full border border-black/10 inline-block" 
                      style={{ backgroundColor: c.hex }} 
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Step 3: Sizes */}
          <div className="space-y-4">
            <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">4. Select Size (Inches)</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedSize?.id === s.id
                      ? 'bg-primary text-white border-primary shadow-luxury'
                      : 'bg-white border-gray-200 text-primary hover:bg-gray-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Custom sizing input box */}
            {selectedSize?.isCustom && (
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">Custom Width (in)</label>
                  <input
                    type="number"
                    min="4"
                    max="60"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Math.max(4, parseInt(e.target.value) || 4))}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-xs text-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">Custom Height (in)</label>
                  <input
                    type="number"
                    min="4"
                    max="60"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Math.max(4, parseInt(e.target.value) || 4))}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-xs text-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Glass & Mount Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Glass */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">5. Glass Options</label>
              <div className="space-y-2">
                {glassOptions.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGlass(g)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                      selectedGlass?.id === g.id
                        ? 'border-accent bg-accent/5 text-primary'
                        : 'border-gray-200 text-primary/70 hover:border-accent'
                    }`}
                  >
                    <span>{g.name}</span>
                    <span className="font-semibold text-accent">+₹{g.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mount */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">6. Mount Board</label>
              <div className="space-y-2">
                {mountOptions.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMount(m)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                      selectedMount?.id === m.id
                        ? 'border-accent bg-accent/5 text-primary'
                        : 'border-gray-200 text-primary/70 hover:border-accent'
                    }`}
                  >
                    <span>{m.name}</span>
                    <span className="font-semibold text-accent">+₹{m.price}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Step 5: Quantity & Photo Option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#f5f5f5]">
            
            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">7. Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 border border-gray-200 rounded-xl flex items-center justify-center font-bold hover:bg-gray-50 text-primary text-sm"
                >
                  -
                </button>
                <span className="font-bold text-sm text-primary w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 border border-gray-200 rounded-xl flex items-center justify-center font-bold hover:bg-gray-50 text-primary text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Photo Option Selection */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">8. Artwork Source</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoOption('upload')}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                    photoOption === 'upload' 
                      ? 'bg-primary text-white border-primary shadow-luxury' 
                      : 'bg-white border-gray-200 text-primary hover:bg-gray-100'
                  }`}
                >
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoOption('bring')}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                    photoOption === 'bring' 
                      ? 'bg-primary text-white border-primary shadow-luxury' 
                      : 'bg-white border-gray-200 text-primary hover:bg-gray-100'
                  }`}
                >
                  I'll bring print
                </button>
              </div>
            </div>

          </div>

          {/* Photo File upload element */}
          {photoOption === 'upload' && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-6 rounded-2xl text-center space-y-4">
              {photoPreview ? (
                <div className="relative max-w-xs mx-auto">
                  <img src={photoPreview} alt="Customer upload preview" className="rounded-xl max-h-40 mx-auto object-contain border border-[#eaeaea]" />
                  <button
                    type="button"
                    onClick={removePhotoFile}
                    className="absolute -top-3 -right-3 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-luxury"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block space-y-2">
                  <CloudUpload size={32} className="mx-auto text-primary/30" />
                  <span className="block text-xs font-semibold text-primary">Click to upload digital photograph</span>
                  <span className="block text-[10px] text-primary/40 font-light">Supports JPG, PNG, WEBP, HEIC up to 15MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {photoOption === 'bring' && (
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex gap-3 text-xs leading-relaxed font-light text-primary/75">
              <Info size={16} className="text-accent flex-shrink-0 mt-0.5" />
              <p>
                <strong>"I will bring a printed copy"</strong> option selected. Choose this if you have an original drawing, wedding portrait print, or painting you want framed in our Mumbai studio.
              </p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Room Preview + Live Price Summary + Form Inquiry */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
          
          {/* Room visualizer */}
          <div className="bg-white p-6 rounded-3xl border border-[#eaeaea] shadow-card">
            <RoomPreview 
              frameColor={selectedColor}
              frameWidth={selectedFrame?.thickness}
              hasMount={selectedMount?.name?.toLowerCase().includes('with') || selectedMount?.name?.toLowerCase().includes('mount')}
              uploadPreview={photoPreview}
            />
          </div>

          {/* Live Estimate Card */}
          <div className="bg-primary text-white p-8 rounded-3xl shadow-luxury space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-accent text-[10px] tracking-[0.2em] font-semibold uppercase block">Inquiry Quote Estimate</span>
              <h3 className="font-display text-2xl font-bold mt-1">Pricing Breakdown</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed font-light">
              <div className="flex justify-between">
                <span>{selectedFrame?.name || 'Frame'} Base Design</span>
                <span>₹{costs.frameBase}</span>
              </div>
              <div className="flex justify-between">
                <span>Material: {selectedMaterial}</span>
                <span>₹{costs.materialAdder}</span>
              </div>
              <div className="flex justify-between">
                <span>Size: {selectedSize?.label} {selectedSize?.isCustom ? `(${customWidth}×${customHeight})` : ''}</span>
                <span>₹{costs.sizePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Glass: {selectedGlass?.name || 'Standard'}</span>
                <span>₹{costs.glassPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Mount Board: {selectedMount?.name || 'Without Mount'}</span>
                <span>₹{costs.mountPrice}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-semibold">
                <span>Unit Subtotal</span>
                <span>₹{costs.frameBase + costs.materialAdder + costs.sizePrice + costs.glassPrice + costs.mountPrice}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Quantity</span>
                <span>x {quantity}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
              <span className="text-accent uppercase tracking-widest text-[10px] font-bold">Estimated Total</span>
              <span className="text-3xl font-display font-bold">₹{costs.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Customer Details & Checkout Form */}
          <div className="bg-white p-8 rounded-3xl border border-[#eaeaea] shadow-card space-y-6">
            <div className="border-b border-[#f5f5f5] pb-3">
              <h3 className="font-display text-lg font-bold text-primary">Inquire Details</h3>
              <p className="text-xs text-primary/40">Complete the form to order and trigger WhatsApp.</p>
            </div>

            {submitSuccess ? (
              <div className="text-center p-6 bg-[#25D366]/5 border border-[#25D366]/20 rounded-2xl space-y-3">
                <span className="text-2xl">✅</span>
                <h4 className="font-bold text-sm text-primary">Inquiry Sent to WhatsApp</h4>
                <p className="text-xs text-primary/60 font-light leading-relaxed">
                  We have received your custom frame specifications and opened WhatsApp. If WhatsApp did not open automatically, check pop-up settings or click button below.
                </p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/918077037277"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white px-6 py-2.5 rounded-full font-semibold uppercase tracking-widest text-[10px] inline-block hover:bg-[#20ba5a]"
                  >
                    Open Chat Manually
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">Phone Number (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-luxury flex items-center justify-center gap-2"
                >
                  {submitting ? 'Submitting Details...' : (
                    <>
                      <WhatsAppIcon />
                      Submit & Open WhatsApp
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ConfiguratorPage;
