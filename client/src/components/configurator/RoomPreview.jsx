import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROOMS = [
  { id: 'living', name: 'Living Room', bg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80', scale: 0.15, y: -40 },
  { id: 'bedroom', name: 'Bedroom', bg: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80', scale: 0.13, y: -50 },
  { id: 'office', name: 'Office', bg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', scale: 0.14, y: -30 },
  { id: 'lobby', name: 'Hotel Lobby', bg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', scale: 0.11, y: -45 },
  { id: 'cafe', name: 'Café', bg: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80', scale: 0.12, y: -35 },
  { id: 'gallery', name: 'Gallery Wall', bg: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80', scale: 0.16, y: -10 },
];

const RoomPreview = ({ frameColor, frameWidth = "2cm", hasMount, uploadPreview }) => {
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);

  // Determine frame style based on color selection
  const getFrameColorHex = (color) => {
    switch (color?.toLowerCase()) {
      case 'black':
      case 'matte black':
        return '#111111';
      case 'white':
      case 'gloss white':
      case 'ivory white':
        return '#f9f9f9';
      case 'natural oak':
      case 'oak':
        return '#d2b48c';
      case 'walnut':
      case 'dark walnut':
      case 'espresso brown':
        return '#5c4033';
      case 'gold':
      case 'antique gold':
        return '#D4AF37';
      default:
        return '#333333';
    }
  };

  const frameHex = getFrameColorHex(frameColor);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-lg font-bold text-primary">Virtual Room Preview</h3>
        <p className="text-xs text-primary/40">Visualize how the finished frame will look in spaces.</p>
      </div>

      {/* Room Preview Canvas */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-luxury bg-gray-950 flex items-center justify-center border border-[#eaeaea]">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedRoom.id}
            src={selectedRoom.bg}
            alt={selectedRoom.name}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Dynamic Frame Mockup in the room */}
        <div 
          className="relative z-10 flex items-center justify-center shadow-luxury transition-all duration-500"
          style={{
            transform: `scale(${selectedRoom.scale}) translateY(${selectedRoom.y}px)`,
          }}
        >
          <div 
            className="p-1 border shadow-2xl transition-all duration-500"
            style={{
              backgroundColor: frameHex,
              borderColor: frameHex === '#f9f9f9' ? '#ddd' : 'transparent',
              borderWidth: frameWidth === '0.5cm' ? '8px' : frameWidth === '1cm' ? '14px' : frameWidth === '4cm' ? '44px' : '24px',
              padding: hasMount ? '36px' : '0px',
              boxShadow: '0 30px 60px -10px rgba(0,0,0,0.5)',
            }}
          >
            {/* Inner Mount Board */}
            <div className={`transition-all duration-500 ${hasMount ? 'bg-white p-1 shadow-inner' : ''}`}>
              {uploadPreview ? (
                <img 
                  src={uploadPreview} 
                  alt="Customer Upload Preview" 
                  className="max-h-[300px] w-auto max-w-[400px] object-contain"
                />
              ) : (
                <div className="h-[250px] w-[350px] bg-gray-300 flex items-center justify-center text-primary/40 font-light text-sm italic">
                  Sample Artwork Preview
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Room Name Tag */}
        <span className="absolute bottom-4 left-4 bg-primary/95 text-white text-[10px] tracking-widest uppercase font-semibold px-4 py-2 rounded-full border border-white/10 shadow-luxury">
          {selectedRoom.name}
        </span>
      </div>

      {/* Room Selection Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {ROOMS.map(room => (
          <button
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              selectedRoom.id === room.id 
                ? 'bg-primary text-white shadow-luxury' 
                : 'bg-white hover:bg-gray-100 text-primary border border-gray-200'
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomPreview;
