/**
 * Prisma Seed Script
 * Populates the database with realistic sample data:
 * - 1 Admin
 * - 10 Categories
 * - 8 Collections
 * - 5 Frame options
 * - 5 Print sizes
 * - 42 Photos (Unsplash)
 * - 8 Testimonials
 * - 4 Blog posts
 * - 1 Settings record
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const prisma = new PrismaClient();

const slug = (str) =>
  slugify(str, { lower: true, strict: true, trim: true });

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    title: 'Wedding Photography',
    description: 'Cinematic wedding photography capturing the raw emotion and timeless beauty of your special day.',
    overview: 'From the quiet moments of preparation to the joyous celebrations on the dance floor, my wedding photography is about telling your unique story. I blend photojournalistic candid shots with beautifully directed editorial portraits to create a comprehensive, artistic record of your wedding day.',
    includes: ['Full day coverage (up to 12 hours)', 'Second photographer', 'High-resolution digital gallery', 'Pre-wedding consultation', '50 fine art prints (6x4)', 'Timeline planning assistance'],
    price: 150000,
    duration: 'Full Day',
    heroImage: '/himalayan-dawn.jpg',
    gallery: [
      '/sample.png',
      '/sample.png',
      '/sample.png'
    ],
    faqs: [
      { question: 'Do you travel for weddings?', answer: 'Yes, I am available for destination weddings worldwide. Travel and accommodation fees apply for locations outside Mumbai.' },
      { question: 'When will we receive our photos?', answer: 'A preview gallery of 30-50 images is delivered within 48 hours. The full gallery takes 6-8 weeks.' }
    ],
    featured: true
  },
  {
    title: 'Wildlife Photography Safari',
    description: 'Expert-guided wildlife photography tours and private tuition in India\'s premier national parks.',
    overview: 'Join me for an immersive wildlife photography experience. Whether you are a beginner looking to understand your camera or an advanced enthusiast aiming to build your portfolio, these private safaris are tailored to your goals. We focus on ethical wildlife observation, predicting animal behavior, and mastering light and composition in the wild.',
    includes: ['Private 4x4 safari vehicle', 'In-field technical instruction', 'Daily post-processing masterclasses', 'Accommodation & meals', 'Park entry fees & permits', 'Pre-trip equipment consultation'],
    price: 85000,
    duration: '3-7 Days',
    heroImage: '/sample.png',
    gallery: [
      '/sample.png',
      '/sample.png'
    ],
    faqs: [
      { question: 'What equipment do I need?', answer: 'A DSLR or mirrorless camera and a lens with a minimum focal length of 400mm is recommended. Equipment rental can be arranged upon request.' }
    ],
    featured: true
  },
  {
    title: 'Portrait Photography',
    description: 'Editorial-style portrait sessions capturing personality and character with cinematic lighting.',
    overview: 'My portrait sessions are relaxed, creative collaborations. We use a mix of natural light and studio techniques, either on location or in my Mumbai studio. Perfect for personal branding, editorial features, or timeless family heirlooms.',
    includes: ['2 hour session', 'Location or studio', 'Multiple outfit changes', 'Professional retouching', '15 high-resolution digital files'],
    price: 25000,
    duration: '2 Hours',
    heroImage: '/sample.png',
    gallery: [],
    faqs: [],
    featured: false
  }
];

// ─── Categories ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Landscape', description: 'Sweeping vistas and dramatic natural scenery', imageUrl: '/himalayan-dawn.jpg', order: 1 },
  { name: 'Wildlife', description: 'Intimate portraits of animals in their natural habitat', imageUrl: '/mara-lion.jpg', order: 2 },
  { name: 'Nature', description: 'The quiet beauty of the natural world up close', imageUrl: '/redwood-forest.jpg', order: 3 },
  { name: 'Birds', description: 'Avian life captured in breathtaking detail', imageUrl: '/mara-lion.jpg', order: 4 },
  { name: 'Travel', description: 'Cultures, cities, and landscapes from around the world', imageUrl: '/santorini-domes.jpg', order: 5 },
  { name: 'Architecture', description: 'Geometry and design in the built environment', imageUrl: '/santorini-domes.jpg', order: 6 },
  { name: 'Portrait', description: 'Soulful portraits of people and their stories', imageUrl: '/soulful-portrait.jpg', order: 7 },
  { name: 'Black & White', description: 'Timeless monochrome art', imageUrl: '/mumbai-monsoon.jpg', order: 8 },
  { name: 'Macro', description: 'The extraordinary detail of the very small', imageUrl: '/redwood-forest.jpg', order: 9 },
  { name: 'Street', description: 'Candid moments from city life', imageUrl: '/mumbai-monsoon.jpg', order: 10 },
];

// ─── Print Sizes ──────────────────────────────────────────────────────────────
const SIZES = [
  { label: '8×10', width: 8, height: 10, basePrice: 2500, order: 1 },
  { label: '12×18', width: 12, height: 18, basePrice: 4500, order: 2 },
  { label: '16×24', width: 16, height: 24, basePrice: 7500, order: 3 },
  { label: '24×36', width: 24, height: 36, basePrice: 12500, order: 4 },
  { label: 'Custom', width: 0, height: 0, basePrice: 15000, isCustom: true, order: 5 },
];

// ─── Frames ───────────────────────────────────────────────────────────────────
const FRAMES = [
  { name: 'No Frame', color: 'none', material: 'None', price: 0 },
  { name: 'Black', color: '#1a1a1a', material: 'Wood', price: 1500 },
  { name: 'White', color: '#f5f5f5', material: 'Wood', price: 1500 },
  { name: 'Oak', color: '#c19a6b', material: 'Wood', price: 2000 },
  { name: 'Walnut', color: '#5c3d2e', material: 'Wood', price: 2500 },
  { name: 'Gold', color: '#D4AF37', material: 'Metal', price: 3000 },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Sophia Laurent', title: 'Interior Designer, Paris', quote: "Alexander's prints have transformed my clients' spaces. The quality is simply unparalleled — every detail, every shade, is reproduced with extraordinary fidelity.", rating: 5, photoUrl: '/sample.png' },
  { name: 'David Vance', title: 'Art Collector, New York', quote: "I've purchased five prints now, each more breathtaking than the last. The framing is museum-quality and the WhatsApp ordering process is remarkably personal.", rating: 5, photoUrl: '/sample.png' },
  { name: 'Priya Mehta', title: 'Hotel Director, Mumbai', quote: "We adorned our lobby with Alexander's landscape series. Our guests consistently comment on how the photographs create an atmosphere of calm luxury.", rating: 5, photoUrl: '/sample.png' },
  { name: 'James Thornton', title: 'Wildlife Enthusiast, London', quote: "The 'Monarch of the Mara' print is the centrepiece of my study. Incredible sharpness, stunning colour — it feels like a window into the Serengeti.", rating: 5, photoUrl: '/sample.png' },
  { name: 'Elena Rostova', title: 'Gallery Curator, Berlin', quote: "Professionally, I work with the finest photographers globally. Alexander's technical mastery and artistic vision place him among the very best.", rating: 5, photoUrl: '/sample.png' },
  { name: 'Arjun Sharma', title: 'Architect, Bangalore', quote: "The limited edition 'Himalayan Dawn' print arrived perfectly packaged. It's now the first thing visitors notice in my home. Truly exceptional.", rating: 5, photoUrl: '/sample.png' },
  { name: 'Mei Lin', title: 'Photographer, Singapore', quote: "As a fellow photographer, I appreciate the extraordinary care Alexander takes with his craft. His prints are investment-grade art.", rating: 5, photoUrl: '/sample.png' },
  { name: 'Rajesh Kumar', title: 'CEO, Bangalore', quote: "Gifted my parents the 'Varanasi Ghats at Dawn' print. My mother cried tears of joy. It captures India's soul beautifully.", rating: 5, photoUrl: '/sample.png' },
];

// ─── Photos ───────────────────────────────────────────────────────────────────
const PHOTOS = [
  // Landscape
  { title: 'Golden Himalayan Dawn', category: 'Landscape', imageUrl: '/himalayan-dawn.jpg', description: 'First light breaks over the eternal Himalayas, painting the peaks in gold and amber.', story: 'I camped at 4,200 metres for three nights waiting for the perfect alignment of light and cloud. On the fourth morning, the sky ignited. This shot captures that fleeting 8-minute window of perfection.', camera: 'Sony A7R V', lens: 'Sony 24-70mm f/2.8', iso: 'ISO 100', aperture: 'f/8', shutterSpeed: '1/125s', location: 'Spiti Valley, Himachal Pradesh, India', featured: true, bestSeller: true, limitedEdition: true, basePrice: 8500 },
  { title: 'Patagonia Wildfire Sky', category: 'Landscape', imageUrl: '/himalayan-dawn.jpg', description: 'Torres del Paine under a dramatic sunset sky that set the entire horizon ablaze.', story: 'After a 22km hike, the sunset turned the granite towers amber-pink. I had 15 minutes before the wind picked up and the light died.', camera: 'Canon EOS R5', lens: 'Canon 16-35mm f/2.8', iso: 'ISO 200', aperture: 'f/11', shutterSpeed: '1/60s', location: 'Torres del Paine, Patagonia, Chile', featured: true, bestSeller: false, limitedEdition: false, basePrice: 7500 },
  { title: 'Lofoten Winter Mirror', category: 'Landscape', imageUrl: '/himalayan-dawn.jpg', description: 'Perfect reflections of Norwegian peaks in a glass-still fjord at blue hour.', story: 'The still conditions only last minutes. I arrived at 03:45 in February darkness, set up by torchlight, and waited. The mirror effect lasted exactly 11 minutes.', camera: 'Nikon Z9', lens: 'Nikkor 14-24mm f/2.8', iso: 'ISO 400', aperture: 'f/8', shutterSpeed: '4s', location: 'Reine, Lofoten Islands, Norway', featured: true, bestSeller: true, limitedEdition: true, basePrice: 9500 },
  { title: 'Atacama Salt Flats', category: 'Landscape', imageUrl: '/himalayan-dawn.jpg', description: 'Geometric patterns of salt crust stretch to the horizon under an impossibly blue sky.', story: 'The Salar de Atacama is the driest place on Earth. In the heat of midday, the salt cracks into perfect hexagons, creating an otherworldly geometry.', camera: 'Sony A7R V', lens: 'Sony 16-35mm f/2.8', iso: 'ISO 100', aperture: 'f/16', shutterSpeed: '1/250s', location: 'Salar de Atacama, Chile', featured: false, bestSeller: false, limitedEdition: false, basePrice: 6500 },
  { title: 'Dolomite Alpenglow', category: 'Landscape', imageUrl: '/himalayan-dawn.jpg', description: 'The iconic Tre Cime di Lavaredo bathed in the rosy alpenglow of dusk.', story: 'The Dolomites at alpenglow are a landscape photographer\'s dream. I positioned myself on the Forcella Lavaredo, sheltered from the wind, and let the mountain do its magic.', camera: 'Canon EOS R5', lens: 'Canon 24-105mm f/4', iso: 'ISO 200', aperture: 'f/8', shutterSpeed: '1/30s', location: 'Tre Cime, South Tyrol, Italy', featured: true, bestSeller: false, limitedEdition: false, basePrice: 7000 },

  // Wildlife
  { title: 'Monarch of the Mara', category: 'Wildlife', imageUrl: '/mara-lion.jpg', description: 'A male lion surveys his territory from a rocky outcrop at golden hour in the Masai Mara.', story: 'We tracked this magnificent lion — the dominant male of the Oloololo pride — for four days. On the fifth morning, he climbed this kopje and looked directly into my 600mm lens.', camera: 'Nikon Z9', lens: 'Nikkor 100-400mm f/4.5-5.6 + 1.4x TC', iso: 'ISO 800', aperture: 'f/5.6', shutterSpeed: '1/1000s', location: 'Masai Mara, Kenya', featured: true, bestSeller: true, limitedEdition: true, basePrice: 8000 },
  { title: 'Cheetah Sprint', category: 'Wildlife', imageUrl: '/mara-lion.jpg', description: 'A cheetah at full sprint, captured at 1/4000s — a blur of spots and speed.', story: 'Cheetahs reach 112km/h. Getting a sharp shot at full sprint requires precise timing, continuous autofocus, and a generous helping of luck. This was our third attempt.', camera: 'Canon EOS R3', lens: 'Canon 500mm f/4', iso: 'ISO 1600', aperture: 'f/4', shutterSpeed: '1/4000s', location: 'Serengeti, Tanzania', featured: false, bestSeller: true, limitedEdition: false, basePrice: 7500 },
  { title: 'Elephant Matriarch', category: 'Wildlife', imageUrl: '/mara-lion.jpg', description: 'An ancient elephant matriarch leads her family through the ochre dust of Amboseli.', story: 'This matriarch, whom the researchers called Themis, was 58 years old and had led her family through three decades of drought. There is wisdom in that gaze.', camera: 'Sony A1', lens: 'Sony 200-600mm f/5.6-6.3', iso: 'ISO 500', aperture: 'f/6.3', shutterSpeed: '1/500s', location: 'Amboseli National Park, Kenya', featured: true, bestSeller: false, limitedEdition: false, basePrice: 7000 },
  { title: 'Tiger in the Mist', category: 'Wildlife', imageUrl: '/mara-lion.jpg', description: 'A Bengal tiger emerges from monsoon mist in Bandhavgarh, regal and unhurried.', story: 'The 6:00am safari. Cold, damp. Then, out of the sal forest mist, she appeared — T-17, the tigress of Zone 2. She walked the road for 40 metres before melting back into the forest.', camera: 'Nikon Z9', lens: 'Nikkor 500mm f/5.6', iso: 'ISO 3200', aperture: 'f/5.6', shutterSpeed: '1/640s', location: 'Bandhavgarh National Park, India', featured: true, bestSeller: true, limitedEdition: true, basePrice: 9000 },

  // Birds
  { title: 'Flamingo Ballet', category: 'Birds', imageUrl: '/mara-lion.jpg', description: 'A thousand flamingos take flight in a synchronized ballet of pink and crimson.', story: 'Lake Nakuru at sunset. The flamingos lifted in a wave — first hundreds, then thousands. The sound was extraordinary, like gentle thunder.', camera: 'Canon EOS R5', lens: 'Canon 400mm f/2.8', iso: 'ISO 640', aperture: 'f/4', shutterSpeed: '1/2000s', location: 'Lake Nakuru, Kenya', featured: false, bestSeller: true, limitedEdition: false, basePrice: 6000 },
  { title: 'Eagle in the Storm', category: 'Birds', imageUrl: '/mara-lion.jpg', description: 'A sea eagle cuts through a winter storm off the Norwegian coast, utterly magnificent.', story: 'The weather was brutal — 60km/h gusts, driving snow. I braced my lens against a rock. The eagle appeared from nowhere, riding the wind like it was born for storms. It was.', camera: 'Nikon Z9', lens: 'Nikkor 800mm f/6.3', iso: 'ISO 6400', aperture: 'f/6.3', shutterSpeed: '1/2000s', location: 'Lofoten Islands, Norway', featured: true, bestSeller: false, limitedEdition: true, basePrice: 8000 },
  { title: 'Kingfisher Dive', category: 'Birds', imageUrl: '/mara-lion.jpg', description: 'A common kingfisher enters the water at 45km/h — jewel-bright against silver ripples.', story: 'I spent 11 days in a hide beside this stream. The kingfisher dived around 40 times each day. Getting the perfect angle, light, and frozen dive took patience beyond what I knew I had.', camera: 'Canon EOS R3', lens: 'Canon 600mm f/4', iso: 'ISO 1250', aperture: 'f/4', shutterSpeed: '1/4000s', location: 'New Forest, Hampshire, UK', featured: false, bestSeller: false, limitedEdition: true, basePrice: 7500 },
  { title: 'Puffin Cliff', category: 'Birds', imageUrl: '/mara-lion.jpg', description: 'Atlantic puffins on their sea-cliff colony, returning with sand eels for their chicks.', story: 'Skomer Island in June is one of Britain\'s great wildlife spectacles. 6,000 puffin pairs nest here. I photographed lying prone for 3 hours — completely worth every cramped muscle.', camera: 'Sony A1', lens: 'Sony 400mm f/2.8', iso: 'ISO 400', aperture: 'f/4', shutterSpeed: '1/1600s', location: 'Skomer Island, Pembrokeshire, Wales', featured: false, bestSeller: true, limitedEdition: false, basePrice: 5500 },

  // Nature
  { title: 'Forest Cathedral', category: 'Nature', imageUrl: '/redwood-forest.jpg', description: 'Ancient redwoods filter golden morning light into cathedral shafts, silencing everything.', story: 'Muir Woods before opening time. I was there alone with the giants. The silence was absolute. Then a beam of morning sun pierced the canopy and the forest became a cathedral.', camera: 'Sony A7R V', lens: 'Sony 12-24mm f/4', iso: 'ISO 400', aperture: 'f/8', shutterSpeed: '1/15s', location: 'Muir Woods, California, USA', featured: true, bestSeller: true, limitedEdition: false, basePrice: 7000 },
  { title: 'Autumn Tapestry', category: 'Nature', imageUrl: '/redwood-forest.jpg', description: 'Vermont in peak fall — a quilt of crimson, amber, and gold draped over rolling hills.', story: 'There are perhaps 5 peak days in Vermont each autumn when every colour aligns perfectly. I drove 1,400 miles from New York to catch this exact moment.', camera: 'Canon EOS R5', lens: 'Canon 70-200mm f/2.8', iso: 'ISO 200', aperture: 'f/8', shutterSpeed: '1/250s', location: 'Stowe, Vermont, USA', featured: false, bestSeller: true, limitedEdition: false, basePrice: 6000 },
  { title: 'Cherry Blossom Storm', category: 'Nature', imageUrl: '/redwood-forest.jpg', description: 'A gust of wind releases a blizzard of cherry blossoms over Chidorigafuchi moat.', story: 'The peak bloom lasts 5–7 days. The wind needed to be just right to create the petal storm. On the fourth day, the breeze arrived at the perfect moment.', camera: 'Sony A7R V', lens: 'Sony 85mm f/1.4', iso: 'ISO 800', aperture: 'f/2', shutterSpeed: '1/2000s', location: 'Chidorigafuchi, Tokyo, Japan', featured: true, bestSeller: true, limitedEdition: false, basePrice: 7000 },
  { title: 'Bioluminescent Bay', category: 'Nature', imageUrl: '/redwood-forest.jpg', description: 'Kayak strokes trace blue-white fire through the most bioluminescent bay on Earth.', story: 'Mosquito Bay, Vieques. On the darkest nights, dinoflagellates make the water glow electric blue with every disturbance. This 30-second exposure captured the trail of a single kayak.', camera: 'Nikon Z9', lens: 'Nikkor 14-24mm f/2.8', iso: 'ISO 3200', aperture: 'f/2.8', shutterSpeed: '30s', location: 'Mosquito Bay, Vieques, Puerto Rico', featured: false, bestSeller: false, limitedEdition: true, basePrice: 8500 },

  // Travel
  { title: 'Varanasi Ghats at Dawn', category: 'Travel', imageUrl: '/santorini-domes.jpg', description: 'The sacred ghats of Varanasi emerge from the Ganga mist at first light — timeless and eternal.', story: 'No city on Earth feels older than Varanasi at dawn. I took a rowing boat onto the Ganga at 4:30am and watched the city awaken in this same ritual it has performed for 3,000 years.', camera: 'Canon EOS R5', lens: 'Canon 24-70mm f/2.8', iso: 'ISO 1600', aperture: 'f/4', shutterSpeed: '1/100s', location: 'Varanasi, Uttar Pradesh, India', featured: true, bestSeller: true, limitedEdition: false, basePrice: 7000 },
  { title: 'Santorini Blue Domes', category: 'Travel', imageUrl: '/santorini-domes.jpg', description: 'The iconic blue-domed churches of Oia glow against the caldera at golden hour.', story: 'I climbed to this rooftop position and waited 3 hours for the sun to align perfectly with the domes. The cruise ships left. The light turned gold. For five minutes, the scene was perfect.', camera: 'Sony A7R V', lens: 'Sony 16-35mm f/2.8', iso: 'ISO 100', aperture: 'f/11', shutterSpeed: '1/200s', location: 'Oia, Santorini, Greece', featured: false, bestSeller: true, limitedEdition: false, basePrice: 6500 },
  { title: 'Jodhpur Blue City', category: 'Travel', imageUrl: '/santorini-domes.jpg', description: 'The blue city of Jodhpur cascades down from Mehrangarh Fort in an infinite wash of cobalt.', story: 'From the ramparts of Mehrangarh at golden hour, Jodhpur looks like an ocean frozen in time. Every shade of blue — indigo, cobalt, sky, teal — tumbles down the hillside.', camera: 'Nikon Z9', lens: 'Nikkor 24-120mm f/4', iso: 'ISO 200', aperture: 'f/8', shutterSpeed: '1/320s', location: 'Jodhpur, Rajasthan, India', featured: true, bestSeller: false, limitedEdition: false, basePrice: 6500 },
  { title: 'Bagan Temple Dawn', category: 'Travel', imageUrl: '/santorini-domes.jpg', description: 'Hot air balloons drift over 2,000 ancient temples as the Irrawaddy plain awakens.', story: 'Bagan at sunrise from a temple spire. The mist still clings to the plain. Then, one by one, the balloons rise — silent and surreal against the temple-studded horizon.', camera: 'Canon EOS R5', lens: 'Canon 70-200mm f/2.8', iso: 'ISO 400', aperture: 'f/8', shutterSpeed: '1/500s', location: 'Bagan, Myanmar', featured: true, bestSeller: false, limitedEdition: true, basePrice: 8000 },
  { title: 'Amalfi Cliffside', category: 'Travel', imageUrl: '/santorini-domes.jpg', description: 'Pastel villages cling impossibly to the Amalfi cliffs above the glittering Tyrrhenian Sea.', story: 'I hired a fishing boat and photographed from the sea at 7am before the tourist ferries arrived. The light hits the cliffside villages for just 20 minutes at this angle.', camera: 'Sony A7R V', lens: 'Sony 100-400mm f/4.5-5.6', iso: 'ISO 200', aperture: 'f/8', shutterSpeed: '1/640s', location: 'Positano, Amalfi Coast, Italy', featured: false, bestSeller: true, limitedEdition: false, basePrice: 6500 },

  // Architecture
  { title: 'Sagrada Familia Ceiling', category: 'Architecture', imageUrl: '/santorini-domes.jpg', description: 'Gaudi\'s magnificent ceiling soars overhead in a fractal symphony of light and stone.', story: 'I arrived at the Sagrada Família at opening, positioned directly under the central nave, and shot straight up for 30 minutes as the morning light shifted through the stained glass.', camera: 'Canon EOS R5', lens: 'Canon 14mm f/2.8', iso: 'ISO 800', aperture: 'f/8', shutterSpeed: '1/30s', location: 'Sagrada Família, Barcelona, Spain', featured: true, bestSeller: false, limitedEdition: false, basePrice: 6500 },
  { title: 'Sheikh Zayed Grand Mosque', category: 'Architecture', imageUrl: '/santorini-domes.jpg', description: 'The world\'s third-largest mosque glows white marble against a cobalt evening sky.', story: 'The reflection pool creates a perfect doubling of the mosque. I waited for blue hour — that 20-minute window when sky and interior lighting are perfectly balanced.', camera: 'Nikon Z9', lens: 'Nikkor 16-35mm f/4', iso: 'ISO 400', aperture: 'f/8', shutterSpeed: '8s', location: 'Abu Dhabi, UAE', featured: true, bestSeller: true, limitedEdition: false, basePrice: 7500 },
  { title: 'Colosseum at Dusk', category: 'Architecture', imageUrl: '/santorini-domes.jpg', description: 'Two thousand years of history glow amber in the dusk light over the Roman Forum.', story: 'Rome deserves patience. I spent four evenings finding the exact angle where the Colosseum, Arch of Constantine, and setting sun aligned perfectly. Evening four was the one.', camera: 'Sony A7R V', lens: 'Sony 24-70mm f/2.8', iso: 'ISO 200', aperture: 'f/11', shutterSpeed: '1/60s', location: 'Rome, Italy', featured: false, bestSeller: false, limitedEdition: false, basePrice: 6000 },

  // Black & White
  { title: 'Rain on Glass', category: 'Black & White', imageUrl: '/mumbai-monsoon.jpg', description: 'A lone figure blurs through rain-slicked glass — a study in motion, light, and solitude.', story: 'A rainy Tuesday in Mumbai. I positioned my lens against the café window and photographed the reflections for two hours. The city becomes abstract. People become poetry.', camera: 'Fujifilm GFX 100S', lens: 'Fujinon 110mm f/2', iso: 'ISO 1600', aperture: 'f/2', shutterSpeed: '1/30s', location: 'Colaba, Mumbai, India', featured: true, bestSeller: true, limitedEdition: false, basePrice: 6000 },
  { title: 'Mumbai Monsoon', category: 'Black & White', imageUrl: '/mumbai-monsoon.jpg', description: 'The chaos and grace of Mumbai\'s monsoon — umbrellas bloom like dark flowers.', story: 'Marine Drive during the July monsoon. I stood in the rain for three hours. The umbrellas created a composition that felt simultaneously chaotic and perfectly ordered.', camera: 'Leica Q2 Monochrom', lens: '28mm f/1.7 Summilux', iso: 'ISO 3200', aperture: 'f/2.8', shutterSpeed: '1/500s', location: 'Marine Drive, Mumbai, India', featured: false, bestSeller: false, limitedEdition: false, basePrice: 5500 },
  { title: 'Geometry of Silence', category: 'Black & White', imageUrl: '/mumbai-monsoon.jpg', description: 'Bold architectural shadows create a graphic study in geometry and negative space.', story: 'The National Centre for the Performing Arts in Mumbai. I arrived at 10am sharp when the sun was high enough to cast these precise diagonal shadows across the facade.', camera: 'Fujifilm GFX 100S', lens: 'Fujinon 45mm f/2.8', iso: 'ISO 100', aperture: 'f/11', shutterSpeed: '1/320s', location: 'Mumbai, India', featured: true, bestSeller: false, limitedEdition: true, basePrice: 6500 },

  // Macro
  { title: 'Dewdrop Universe', category: 'Macro', imageUrl: '/redwood-forest.jpg', description: 'Each dewdrop on this spider web contains a perfect reflection of the entire garden.', story: 'Dawn in my garden. The web appeared overnight. Each droplet is a tiny lens containing an inverted world. I used a macro rail to achieve focus at 5:1 magnification.', camera: 'Canon EOS R5', lens: 'Canon MP-E 65mm f/2.8 1-5x', iso: 'ISO 200', aperture: 'f/8', shutterSpeed: '1/200s', location: 'Lonavala, Maharashtra, India', featured: false, bestSeller: true, limitedEdition: false, basePrice: 5000 },
  { title: 'Fire Lily Detail', category: 'Macro', imageUrl: '/redwood-forest.jpg', description: 'The intimate architecture of a fire lily — stamens, pollen, and petals in extreme detail.', story: 'Shot in natural window light with no flash. The macro rail allowed me to focus-stack 40 frames to achieve this impossible depth of field — from petal tip to stamen.', camera: 'Sony A7R V', lens: 'Sony 90mm f/2.8 Macro', iso: 'ISO 400', aperture: 'f/8', shutterSpeed: '1/100s', location: 'Mumbai, India', featured: false, bestSeller: false, limitedEdition: false, basePrice: 4500 },
  { title: 'Butterfly Wing Scale', category: 'Macro', imageUrl: '/redwood-forest.jpg', description: 'At 4:1 magnification, a butterfly\'s wing scales reveal the optical nano-structure that creates iridescent colour.', story: 'The Morpho butterfly\'s iridescence isn\'t pigment — it\'s nanostructure. At 4:1 magnification, the scales look like a field of glass tiles. Nature\'s own structural colour.', camera: 'Canon EOS R5', lens: 'Canon MP-E 65mm f/2.8 1-5x', iso: 'ISO 200', aperture: 'f/11', shutterSpeed: '1/160s', location: 'Amazon Basin, Brazil', featured: false, bestSeller: false, limitedEdition: true, basePrice: 5500 },

  // Street
  { title: 'Chai Wallah at Dawn', category: 'Street', imageUrl: '/mumbai-monsoon.jpg', description: 'A chai wallah tends his brazier in the blue hour before Mumbai awakens.', story: 'Matunga at 5:30am. The city is not yet awake but the chai wallahs are. He\'s been doing this for 31 years. The same spot, the same rhythm. The steam rises like a prayer.', camera: 'Leica Q2', lens: '28mm f/1.7 Summilux', iso: 'ISO 3200', aperture: 'f/2', shutterSpeed: '1/60s', location: 'Matunga, Mumbai, India', featured: true, bestSeller: false, limitedEdition: false, basePrice: 5500 },
  { title: 'Tokyo Crossing', category: 'Street', imageUrl: '/mumbai-monsoon.jpg', description: 'The Shibuya Crossing at rush hour — a choreography of 3,000 people in perfect chaos.', story: 'From the second floor of the Shibuya Starbucks, with a 35mm lens, I photographed the crossing at 6pm peak traffic. The crossing empties in 70 seconds. Then 3,000 more people appear.', camera: 'Fujifilm X-T5', lens: 'Fujinon 35mm f/1.4', iso: 'ISO 800', aperture: 'f/2', shutterSpeed: '1/15s', location: 'Shibuya, Tokyo, Japan', featured: true, bestSeller: true, limitedEdition: false, basePrice: 6000 },
  { title: 'Kolkata Rickshaw', category: 'Street', imageUrl: '/mumbai-monsoon.jpg', description: 'The last hand-pulled rickshaws of Kolkata carry a century of living history.', story: 'Kolkata still has 15,000 hand-pulled rickshaws — the last city on Earth. The rickshaw-wallahs\'s faces tell the story of a nation. This man has pulled this route for 22 years.', camera: 'Leica M11', lens: '35mm f/1.4 Summilux', iso: 'ISO 1600', aperture: 'f/2', shutterSpeed: '1/250s', location: 'Bow Bazaar, Kolkata, India', featured: false, bestSeller: false, limitedEdition: false, basePrice: 5500 },

  // Portrait
  { title: 'The Sadhu of Pushkar', category: 'Portrait', imageUrl: '/soulful-portrait.jpg', description: 'An ancient sadhu meditates beside the sacred lake of Pushkar, his face a map of lifetimes.', story: 'He agreed to be photographed only after I sat with him for an hour. No words — he spoke no English, I spoke no Rajasthani. But photographs transcend language.', camera: 'Canon EOS R5', lens: 'Canon 85mm f/1.2', iso: 'ISO 400', aperture: 'f/1.4', shutterSpeed: '1/500s', location: 'Pushkar, Rajasthan, India', featured: true, bestSeller: false, limitedEdition: true, basePrice: 7000 },
  { title: 'Tibetan Elder', category: 'Portrait', imageUrl: '/soulful-portrait.jpg', description: 'A Tibetan elder spins his prayer wheel on the Barkhor circuit in Lhasa.', story: 'He circles the Jokhang Temple every morning. Has done for 60 years. His prayer wheel is older than my grandfather. There is a peace in his eyes that humbles everything.', camera: 'Nikon Z9', lens: 'Nikkor 85mm f/1.8', iso: 'ISO 800', aperture: 'f/2', shutterSpeed: '1/320s', location: 'Lhasa, Tibet', featured: false, bestSeller: false, limitedEdition: true, basePrice: 6500 },
  { title: 'Rajasthani Wedding', category: 'Portrait', imageUrl: '/soulful-portrait.jpg', description: 'A bride in the full glory of traditional Rajasthani jewellery and embroidered silk.', story: 'Her family allowed me to photograph the mehndi ceremony. The jewellery alone took four hours to put on. Each piece has a story — heirloom necklaces passed down six generations.', camera: 'Canon EOS R5', lens: 'Canon 85mm f/1.2', iso: 'ISO 640', aperture: 'f/1.8', shutterSpeed: '1/250s', location: 'Jaisalmer, Rajasthan, India', featured: false, bestSeller: true, limitedEdition: false, basePrice: 6500 },

  // Additional Featured Photos
  { title: 'Northern Lights over Tromsø', category: 'Landscape', imageUrl: '/himalayan-dawn.jpg', description: 'The aurora borealis dances over snow-dusted pine forest on a crackling Arctic night.', story: 'Kp index 6. -22°C. Battery in my camera lasted 40 minutes before dying from the cold. I had a spare. This was the third frame of the night — and the best aurora I\'ve ever witnessed.', camera: 'Nikon Z9', lens: 'Nikkor 14-24mm f/2.8', iso: 'ISO 3200', aperture: 'f/2.8', shutterSpeed: '6s', location: 'Tromsø, Norway', featured: true, bestSeller: true, limitedEdition: true, basePrice: 11000 },
  { title: 'Milky Way over Ladakh', category: 'Landscape', imageUrl: '/himalayan-dawn.jpg', description: 'At 4,500 metres, the Milky Way arches over the alien landscape of the Hanle Dark Sky Reserve.', story: 'Hanle is one of the last true dark sky sites in Asia. No light pollution for 200km in any direction. The Milky Way is so bright it casts shadows. I could have stayed all night — and did.', camera: 'Sony A7S III', lens: 'Sony 14mm f/1.8', iso: 'ISO 6400', aperture: 'f/1.8', shutterSpeed: '15s', location: 'Hanle, Ladakh, India', featured: true, bestSeller: true, limitedEdition: true, basePrice: 9500 },
  { title: 'Great Migration Crossing', category: 'Wildlife', imageUrl: '/mara-lion.jpg', description: 'Ten thousand wildebeest ford the crocodile-filled Mara River in the greatest wildlife spectacle on Earth.', story: 'You wait at the river for days — sometimes a week — for a crossing. Then the first wildebeest steps in. Within minutes, ten thousand are swimming the river, crocodiles swirling below.', camera: 'Canon EOS R3', lens: 'Canon 500mm f/4', iso: 'ISO 1000', aperture: 'f/5', shutterSpeed: '1/2000s', location: 'Mara River, Kenya/Tanzania', featured: true, bestSeller: false, limitedEdition: true, basePrice: 10000 },
  { title: 'Pangong Lake at Sunrise', category: 'Landscape', imageUrl: '/himalayan-dawn.jpg', description: 'The otherworldly blue of Pangong Lake shifts through a dozen shades as dawn arrives.', story: 'At 4,350m, the air is thin and the cold is absolute. The tent frosted over overnight. But when the light touched the water, the lake turned a blue I have no word for.', camera: 'Nikon Z9', lens: 'Nikkor 24-70mm f/2.8', iso: 'ISO 200', aperture: 'f/8', shutterSpeed: '1/250s', location: 'Pangong Lake, Ladakh, India', featured: false, bestSeller: true, limitedEdition: false, basePrice: 8000 },
  { title: 'Rann of Kutch Full Moon', category: 'Landscape', imageUrl: '/himalayan-dawn.jpg', description: 'The great white desert of Kutch glows silver under a full moon, infinite and dreamlike.', story: 'The Rann is the largest salt desert in the world. On full moon nights, the white salt crust becomes a mirror for the moon. It feels like walking on the surface of another world.', camera: 'Sony A7R V', lens: 'Sony 16-35mm f/2.8', iso: 'ISO 1600', aperture: 'f/4', shutterSpeed: '10s', location: 'Rann of Kutch, Gujarat, India', featured: false, bestSeller: false, limitedEdition: true, basePrice: 8500 },
];

// ─── Collections ──────────────────────────────────────────────────────────────
const COLLECTIONS = [
  { name: 'Best Sellers', slug: 'best-sellers', description: 'The most beloved prints from the collection', imageUrl: '/himalayan-dawn.jpg', order: 1 },
  { name: "Editor's Choice", slug: 'editors-choice', description: 'Personally curated by Sikhar', imageUrl: '/redwood-forest.jpg', order: 2 },
  { name: 'Limited Edition', slug: 'limited-edition', description: 'Numbered and signed prints — strictly limited', imageUrl: '/mara-lion.jpg', order: 3 },
  { name: 'New Arrivals', slug: 'new-arrivals', description: 'The latest additions to the collection', imageUrl: '/santorini-domes.jpg', order: 4 },
  { name: 'India Series', slug: 'india-series', description: 'An intimate portrait of the Indian subcontinent', imageUrl: '/mumbai-monsoon.jpg', order: 5 },
  { name: 'African Wildlife', slug: 'african-wildlife', description: 'Africa\'s magnificent fauna in their wild realm', imageUrl: '/mara-lion.jpg', order: 6 },
  { name: 'Dark Skies', slug: 'dark-skies', description: 'Milky Way, aurora, and celestial light', imageUrl: '/himalayan-dawn.jpg', order: 7 },
  { name: 'Urban Monochrome', slug: 'urban-monochrome', description: 'Cities reduced to light, shadow, and geometry', imageUrl: '/mumbai-monsoon.jpg', order: 8 },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────
const BLOGS = [
  {
    title: 'How I Captured the Perfect Aurora in Norway',
    slug: 'how-i-captured-perfect-aurora-norway',
    excerpt: 'Three weeks, -25°C temperatures, and a lot of patience. Here\'s the story behind my most requested print.',
    content: `# How I Captured the Perfect Aurora in Norway\n\nThe forecast showed Kp index 6 — near-storm conditions. After two weeks of broken cloud and weak aurora, this was my best chance.\n\nI drove 40km north of Tromsø to escape the city light pollution, set up on a snow-covered lake, and waited.\n\nAt 22:14, the aurora began — faint green ribbons at first, then suddenly the entire sky erupted in curtains of green and violet that moved faster than I could track with my eyes.\n\n## Technical Details\n\nThe challenge with aurora photography is balancing ISO and shutter speed. Too slow and the aurora blurs into a green smear. Too fast and you lose detail in the shadows.\n\nI settled on ISO 3200, f/2.8, 6 seconds — fast enough to freeze the aurora's movement while retaining detail in the snow.\n\n## The Result\n\nThe "Northern Lights over Tromsø" print remains my best-selling work. Every time I look at it, I'm back on that frozen lake, breath clouding the air, watching the sky perform its greatest show.\n\n**Print available in sizes 16×24 through 24×36.** Limited to 25 numbered editions.`,
    coverImage: '/sample.png',
    tags: ['aurora', 'norway', 'night photography', 'behind the scenes'],
    published: true,
  },
  {
    title: 'The Art of Wildlife Patience: Kenya and Tanzania',
    slug: 'art-of-wildlife-patience-kenya-tanzania',
    excerpt: 'Waiting eight days for a single great photograph taught me more about photography than eight years of technique.',
    content: `# The Art of Wildlife Patience: Kenya and Tanzania\n\nOn day seven, our guide David said, "Tomorrow will be the crossing."\n\nWe'd spent a week watching the wildebeest herd mass on the northern banks of the Mara River. Somewhere between 30,000 and 50,000 animals — an undulating carpet of hooves and horns stretching to the horizon.\n\n## The Wait\n\nWildlife photography is 90% patience and 10% technique. The crossing can happen at any time — or not at all. Some photographers wait two weeks and see nothing. We were relatively lucky.\n\nAt 09:23 on day eight, the first wildebeest stepped to the water's edge. Then three more. Then ten. Then a thousand.\n\n## The Crossing\n\nThe crocodiles were waiting — they always are. In 45 minutes, ten thousand wildebeest crossed that river. The noise was immense. The water turned red briefly, then cleared.\n\nI fired 3,400 frames. Of those, perhaps 12 were truly exceptional. That's the reality of wildlife photography.\n\n**The "Great Migration Crossing" print is available as a limited edition of 15 numbered prints.**`,
    coverImage: '/sample.png',
    tags: ['wildlife', 'kenya', 'wildebeest', 'safari', 'behind the scenes'],
    published: true,
  },
  {
    title: 'Camera Settings for Milky Way Photography',
    slug: 'camera-settings-milky-way-photography',
    excerpt: 'Everything you need to know to photograph the Milky Way — from settings to location scouting.',
    content: `# Camera Settings for Milky Way Photography\n\nThe Milky Way is one of the most breathtaking subjects in photography — and one of the most technically demanding.\n\n## Location First\n\nBefore anything else, you need darkness. Use the Light Pollution Map (lightpollutionmap.info) to find Bortle Class 3 or below sites within driving distance. In India, Hanle in Ladakh and Jaisalmer in Rajasthan are exceptional.\n\n## The Golden Triangle of Milky Way Settings\n\n**ISO**: 3200-6400 depending on your camera's noise performance.\n\n**Aperture**: As wide as your lens allows — f/1.8 or f/2.8 ideal.\n\n**Shutter Speed**: Use the 500 Rule. Divide 500 by your focal length. A 14mm lens = 500/14 = 35 seconds maximum before stars trail.\n\n## Focusing in the Dark\n\nThe hardest part. Use Live View, zoom to 10x on a bright star, and manually focus until the star is its smallest, sharpest point. Lock focus. Don't touch the lens again.\n\n## Post-Processing\n\nI shoot RAW and process in Lightroom. Clarity +40, Texture +30, and careful noise reduction while preserving star detail.\n\nHappy shooting — and enjoy the dark sky.`,
    coverImage: '/sample.png',
    tags: ['technique', 'milky way', 'astrophotography', 'camera settings'],
    published: true,
  },
  {
    title: 'Shooting India: A Photographer\'s Love Letter',
    slug: 'shooting-india-photographers-love-letter',
    excerpt: 'India is the most photographically rich country on Earth. Here\'s how I approach shooting it.',
    content: `# Shooting India: A Photographer's Love Letter\n\nI have photographed 47 countries. India remains, without question, the most photographically rich place on Earth.\n\n## The Light\n\nIndia's light is extraordinary — golden hour lasts longer, the monsoon sky produces drama unmatched anywhere, and the dust and haze create atmospheric depth that European light simply cannot replicate.\n\n## The People\n\nIndians are, in my experience, among the most generous photo subjects in the world. A smile, a genuine "namaste", and usually permission follows. Never photograph without asking. Respect earns you the real portrait — not the performance.\n\n## My India Essentials\n\n**Varanasi**: Arrive by boat at 4:30am. The ghats at dawn are eternal.\n\n**Jodhpur**: Blue hour from Mehrangarh's ramparts. The blue city glows.\n\n**Ladakh**: Go in September. The light is extraordinary and the dark skies are unmatched in Asia.\n\n**Rajasthan**: The colour, the people, the architecture — it's inexhaustible.\n\n## One Piece of Advice\n\nLeave your itinerary loose. India's greatest photographs happen when you follow a sound, a smell, or an instinct down an alley you hadn't planned to enter.\n\nShe'll surprise you. She always does.`,
    coverImage: '/sample.png',
    tags: ['india', 'travel photography', 'culture', 'street photography'],
    published: true,
  },
];

// ─── Main Seed Function ───────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting seed...\n');

  // 1. Admin
  console.log('👤 Creating admin...');
  const hashedPassword = await bcrypt.hash('Admin@1234', 12);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@sikhar.photography' },
    update: {},
    create: {
      name: 'Sikhar',
      email: 'admin@sikhar.photography',
      password: hashedPassword,
    },
  });
  console.log(`   ✓ Admin: ${admin.email}`);

  // 2. Categories
  console.log('\n📂 Creating categories...');
  const categoryMap = {};
  for (const cat of CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { slug: slug(cat.name) },
      update: {},
      create: { ...cat, slug: slug(cat.name) },
    });
    categoryMap[cat.name] = record.id;
    console.log(`   ✓ ${cat.name}`);
  }

  // 3. Print Sizes
  console.log('\n📐 Creating print sizes...');
  for (const size of SIZES) {
    await prisma.printSize.upsert({
      where: { id: size.label.replace('×', 'x') },
      update: {},
      create: { id: size.label.replace('×', 'x'), ...size },
    });
    console.log(`   ✓ ${size.label}`);
  }

  // 4. Frames
  console.log('\n🖼️  Creating frames...');
  await prisma.frame.deleteMany();
  for (const frame of FRAMES) {
    await prisma.frame.create({ data: frame });
    console.log(`   ✓ ${frame.name}`);
  }

  // 5. Photos
  console.log('\n📸 Creating photos...');
  const photoMap = {};
  for (const photo of PHOTOS) {
    const photoSlug = slug(photo.title);
    const { category: catName, ...photoData } = photo;
    const record = await prisma.photo.upsert({
      where: { slug: photoSlug },
      update: {},
      create: {
        ...photoData,
        slug: photoSlug,
        categoryId: categoryMap[catName] || null,
        dateTaken: new Date('2023-01-01'),
        tags: [catName.toLowerCase(), 'fine art', 'print'],
      },
    });
    photoMap[photo.title] = record.id;
    console.log(`   ✓ ${photo.title}`);
  }

  // 6. Collections
  console.log('\n🗂️  Creating collections...');
  const collectionMap = {};
  for (const col of COLLECTIONS) {
    const record = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: col,
    });
    collectionMap[col.slug] = record.id;
    console.log(`   ✓ ${col.name}`);
  }

  // 7. Assign Photos to Collections
  console.log('\n🔗 Linking photos to collections...');
  const bestSellerPhotos = PHOTOS.filter(p => p.bestSeller).map(p => p.title);
  const limitedEditionPhotos = PHOTOS.filter(p => p.limitedEdition).map(p => p.title);
  const featuredPhotos = PHOTOS.filter(p => p.featured).map(p => p.title);
  const indiaPhotos = ['Varanasi Ghats at Dawn', 'Jodhpur Blue City', 'Tiger in the Mist', 'Chai Wallah at Dawn', 'The Sadhu of Pushkar', 'Rann of Kutch Full Moon', 'Milky Way over Ladakh', 'Pangong Lake at Sunrise', 'Rajasthani Wedding', 'Kolkata Rickshaw'];
  const africaPhotos = ['Monarch of the Mara', 'Cheetah Sprint', 'Elephant Matriarch', 'Flamingo Ballet', 'Great Migration Crossing'];
  const darkSkyPhotos = ['Northern Lights over Tromsø', 'Milky Way over Ladakh', 'Bioluminescent Bay'];
  const monoPhotos = ['Rain on Glass', 'Mumbai Monsoon', 'Geometry of Silence'];

  const collectionAssignments = [
    { slug: 'best-sellers', photos: bestSellerPhotos },
    { slug: 'editors-choice', photos: featuredPhotos },
    { slug: 'limited-edition', photos: limitedEditionPhotos },
    { slug: 'new-arrivals', photos: PHOTOS.slice(-8).map(p => p.title) },
    { slug: 'india-series', photos: indiaPhotos },
    { slug: 'african-wildlife', photos: africaPhotos },
    { slug: 'dark-skies', photos: darkSkyPhotos },
    { slug: 'urban-monochrome', photos: monoPhotos },
  ];

  for (const { slug: colSlug, photos } of collectionAssignments) {
    const colId = collectionMap[colSlug];
    if (!colId) continue;
    for (let i = 0; i < photos.length; i++) {
      const photoId = photoMap[photos[i]];
      if (!photoId) continue;
      await prisma.collectionPhoto.upsert({
        where: { collectionId_photoId: { collectionId: colId, photoId } },
        update: {},
        create: { collectionId: colId, photoId, order: i },
      });
    }
    console.log(`   ✓ ${colSlug}: ${photos.filter(p => photoMap[p]).length} photos`);
  }

  // 8. Testimonials
  console.log('\n💬 Creating testimonials...');
  await prisma.testimonial.deleteMany();
  for (const t of TESTIMONIALS) {
    await prisma.testimonial.create({ data: t });
    console.log(`   ✓ ${t.name}`);
  }

  // 9. Blog Posts
  console.log('\n✍️  Creating blog posts...');
  for (const post of BLOGS) {
    await prisma.blog.upsert({
      where: { slug: post.slug },
      update: {},
      create: { ...post, authorId: admin.id },
    });
    console.log(`   ✓ ${post.title}`);
  }

  // 10. Settings
  console.log('\n⚙️  Creating settings...');
  const settingsCount = await prisma.settings.count();
  if (settingsCount === 0) {
    await prisma.settings.create({
      data: {
        photographerName: 'Sikhar',
        whatsappNumber: '918077037277',
        phone: '+91 80770 37277',
        email: 'hello@sikhar.photography',
        address: 'Mumbai, Maharashtra, India',
        instagramUrl: 'https://www.instagram.com/craft_creators_original?utm_source=qr&igsh=MTJubGxraXB3d3FqOA==',
        facebookUrl: 'https://facebook.com/sikhar.photography',
        youtubeUrl: 'https://youtube.com/@sikhar.photography',
        heroTitle: 'Capturing Light,\nCrafting Eternity',
        heroSubtitle: 'Fine art prints for discerning collectors — landscapes, wildlife, and the poetry of the natural world',
        heroImage: '/sample.png',
        aboutText: 'Sikhar is an award-winning fine art photographer based in Mumbai, India. For over a decade, he has pursued the extraordinary in the ordinary — from the soaring peaks of the Himalayas to the intimate silence of a forest at dawn. His work has been exhibited in galleries across London, New York, Mumbai, and Singapore, and his limited-edition prints are held in private collections across six continents.',
        seoTitle: 'Sikhar | Fine Art Photography & Premium Prints',
        seoDescription: 'Luxury fine art prints by Sikhar. Landscape, wildlife, travel, and nature photography from India and around the world. Custom framed prints ordered via WhatsApp.',
      },
    });
    console.log('   ✓ Settings created');
  }

  // 11. Services
  console.log('\n💼 Creating services...');
  for (const srv of SERVICES) {
    const srvSlug = slug(srv.title);
    await prisma.service.upsert({
      where: { slug: srvSlug },
      update: {},
      create: { ...srv, slug: srvSlug },
    });
    console.log(`   ✓ ${srv.title}`);
  }

  // 12. Bookings
  console.log('\n📅 Creating sample bookings...');
  const weddingService = await prisma.service.findUnique({ where: { slug: 'wedding-photography' } });
  if (weddingService) {
    const existingBooking = await prisma.booking.findFirst({ where: { email: 'aisha.p@example.com' }});
    if (!existingBooking) {
      await prisma.booking.create({
        data: {
          name: 'Aisha Patel',
          email: 'aisha.p@example.com',
          phone: '+91 98765 12345',
          eventType: 'Wedding Photography',
          serviceId: weddingService.id,
          preferredDate: new Date('2027-03-15T00:00:00Z'),
          location: 'Udaipur, Rajasthan',
          guests: 250,
          budget: 200000,
          status: 'pending',
        }
      });
      console.log(`   ✓ Wedding Booking - Aisha Patel`);
    }
  }

  // 13. Client Gallery
  console.log('\n🔒 Creating sample client gallery...');
  const gallery = await prisma.clientGallery.upsert({
    where: { slug: 'patel-wedding-preview' },
    update: {},
    create: {
      title: 'Aisha & Rahul - Wedding Preview',
      slug: 'patel-wedding-preview',
      clientName: 'Aisha Patel',
      eventName: 'Wedding Ceremony',
      eventDate: new Date('2027-03-15T00:00:00Z'),
      description: 'A selection of preview images from your beautiful wedding ceremony in Udaipur.',
      coverImage: '/sample.png',
      password: 'love',
      status: 'active',
      downloadsEnabled: true,
    }
  });
  
  const galleryImagesCount = await prisma.galleryImage.count({ where: { galleryId: gallery.id } });
  if (galleryImagesCount === 0) {
    await prisma.galleryImage.createMany({
      data: [
        { galleryId: gallery.id, imageUrl: '/sample.png', order: 1 },
        { galleryId: gallery.id, imageUrl: '/sample.png', order: 2 },
        { galleryId: gallery.id, imageUrl: '/sample.png', order: 3 },
      ]
    });
  }
  console.log(`   ✓ Client Gallery - ${gallery.title}`);

  console.log('\n✅ Seed complete!\n');
  console.log('Admin credentials:');
  console.log('  Email: admin@sikhar.photography');
  console.log('  Password: Admin@1234\n');
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}

module.exports = { SERVICES, CATEGORIES, SIZES, FRAMES, TESTIMONIALS, PHOTOS, COLLECTIONS, BLOGS };
