import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid2X2, Check, RefreshCw } from 'lucide-react';
import { frameService } from '../services/frameService';
import { categoryService } from '../services/categoryService';
import FrameCard from '../components/frames/FrameCard';
import QuickPreviewModal from '../components/frames/QuickPreviewModal';
import { FrameSkeleton } from '../components/common/SkeletonLoader';

const FrameCollectionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [frames, setFrames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState(null);
  
  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedMaterial, setSelectedMaterial] = useState(searchParams.get('material') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  useEffect(() => {
    categoryService.getCategories()
      .then(res => setCategories(res.data.data || []))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Fetch frames on filter change
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedMaterial) params.material = selectedMaterial;

    frameService.getFrames(params)
      .then(res => {
        setFrames(res.data.data || []);
      })
      .catch(err => console.error('Error fetching frames:', err))
      .finally(() => setLoading(false));
  }, [search, selectedCategory, selectedMaterial]);

  // Synchronize search params with URL
  const updateUrlParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    updateUrlParams('category', slug);
  };

  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    updateUrlParams('material', material);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    updateUrlParams('search', val);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedMaterial('');
    setSearchParams({});
  };

  const materials = ['Solid Wood', 'MDF Wood', 'Aluminium', 'Steel', 'Composite'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 min-h-screen">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Premium Catalogue</span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-primary">Frame Collection</h1>
        <p className="text-primary/60 text-xs sm:text-sm font-light leading-relaxed">
          Browse our extensive catalog of handcrafted designs. Choose wooden frames for traditional warmth, metal for contemporary minimalism, or vintage gilded frames for timeless statement pieces.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#eaeaea] p-4 rounded-2xl shadow-card space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
          <input 
            type="text" 
            placeholder="Search frames by name, description, material..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-accent focus:bg-white transition-all text-primary"
          />
        </div>

        {/* Filter triggers */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
              showFilters || selectedCategory || selectedMaterial
                ? 'bg-primary border-primary text-white' 
                : 'bg-white border-gray-200 text-primary hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters {(selectedCategory || selectedMaterial) ? '(Active)' : ''}
          </button>

          {(search || selectedCategory || selectedMaterial) && (
            <button 
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-primary/60 hover:text-primary rounded-xl text-xs transition-colors"
            >
              <RefreshCw size={12} />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Filters Expandable Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-fade-in">
          
          {/* Category Filter */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">Categories</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategorySelect('')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === '' 
                    ? 'bg-primary text-white' 
                    : 'bg-white border border-gray-200 text-primary hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-primary text-white' 
                      : 'bg-white border border-gray-200 text-primary hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Material Filter */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">Materials</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleMaterialSelect('')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedMaterial === '' 
                    ? 'bg-primary text-white' 
                    : 'bg-white border border-gray-200 text-primary hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {materials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => handleMaterialSelect(mat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedMaterial === mat
                      ? 'bg-primary text-white' 
                      : 'bg-white border border-gray-200 text-primary hover:bg-gray-100'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Main Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array(8).fill(0).map((_, i) => <FrameSkeleton key={i} />)}
        </div>
      ) : frames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {frames.map((frame) => (
            <FrameCard 
              key={frame.id} 
              frame={frame} 
              onQuickPreview={setSelectedFrame} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4 bg-gray-50 border border-gray-100 rounded-3xl">
          <p className="text-primary/40 font-light text-sm">No frames match your search filters.</p>
          <button 
            onClick={resetFilters}
            className="bg-primary hover:bg-accent text-white hover:text-primary px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Quick Preview Modal */}
      {selectedFrame && (
        <QuickPreviewModal 
          frame={selectedFrame} 
          onClose={() => setSelectedFrame(null)} 
        />
      )}

    </div>
  );
};

export default FrameCollectionPage;
