/**
 * In-memory Mock Prisma Client
 * Emulates CRUD operations on seed data to run the site without PostgreSQL.
 */

const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const { SERVICES, CATEGORIES, SIZES, FRAMES, TESTIMONIALS, PHOTOS, COLLECTIONS, BLOGS } = require('../prisma/seed');

const slug = (str) => slugify(str, { lower: true, strict: true, trim: true });

// Hash default admin password
const adminHashedPassword = bcrypt.hashSync('Admin@1234', 10);

// Initialize DB tables
const db = {
  admin: [
    {
      id: 'admin-1',
      name: 'Sikhar',
      email: 'admin@sikhar.photography',
      password: adminHashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  category: CATEGORIES.map((c, index) => ({
    id: `cat-${index + 1}`,
    name: c.name,
    slug: slug(c.name),
    description: c.description,
    imageUrl: c.imageUrl,
    order: c.order,
    createdAt: new Date(),
    updatedAt: new Date()
  })),
  printSize: SIZES.map((s) => ({
    id: s.label.replace('×', 'x'),
    label: s.label,
    width: s.width,
    height: s.height,
    basePrice: s.basePrice,
    isCustom: !!s.isCustom,
    order: s.order,
    createdAt: new Date(),
    updatedAt: new Date()
  })),
  frame: FRAMES.map((f, index) => ({
    id: `frame-${index + 1}`,
    name: f.name,
    color: f.color,
    material: f.material,
    price: f.price,
    createdAt: new Date(),
    updatedAt: new Date()
  })),
  printFinish: [
    { id: 'finish-1', name: 'Matte', price: 0, order: 1 },
    { id: 'finish-2', name: 'Glossy', price: 0, order: 2 },
    { id: 'finish-3', name: 'Fine Art Paper', price: 1000, order: 3 },
    { id: 'finish-4', name: 'Canvas', price: 2000, order: 4 }
  ],
  glassOption: [
    { id: 'glass-1', name: 'Standard Glass', price: 0, order: 1 },
    { id: 'glass-2', name: 'Anti-Glare Glass', price: 1200, order: 2 }
  ],
  mountOption: [
    { id: 'mount-1', name: 'Without Mount', price: 0, order: 1 },
    { id: 'mount-2', name: 'With Mount', price: 800, order: 2 }
  ],
  photo: [],
  collection: COLLECTIONS.map((col, index) => ({
    id: `col-${index + 1}`,
    name: col.name,
    slug: col.slug,
    description: col.description,
    imageUrl: col.imageUrl,
    order: col.order,
    createdAt: new Date(),
    updatedAt: new Date()
  })),
  collectionPhoto: [],
  testimonial: TESTIMONIALS.map((t, index) => ({
    id: `test-${index + 1}`,
    name: t.name,
    title: t.title,
    quote: t.quote,
    rating: t.rating || 5,
    photoUrl: t.photoUrl || '/sample.png',
    createdAt: new Date()
  })),
  blog: BLOGS.map((b, index) => ({
    id: `blog-${index + 1}`,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    content: b.content,
    coverImage: b.coverImage || '/sample.png',
    tags: b.tags || [],
    published: true,
    authorId: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date()
  })),
  settings: [
    {
      id: 'settings-1',
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
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  service: SERVICES.map((s, index) => ({
    id: `serv-${index + 1}`,
    title: s.title,
    slug: slug(s.title),
    description: s.description,
    overview: s.overview,
    includes: s.includes || [],
    price: s.price || 0,
    duration: s.duration,
    heroImage: s.heroImage || '/sample.png',
    gallery: s.gallery || [],
    faqs: s.faqs || [],
    featured: !!s.featured,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  })),
  booking: [
    {
      id: 'book-1',
      name: 'Aisha Patel',
      email: 'aisha.p@example.com',
      phone: '+91 98200 12345',
      whatsapp: '919820012345',
      eventType: 'Wedding Photography',
      preferredDate: new Date('2024-12-15'),
      alternateDate: new Date('2024-12-16'),
      time: 'Morning',
      location: 'Colaba, Mumbai',
      guests: 250,
      budget: 200000,
      requirements: 'Interested in candid portraiture and full-day wedding coverage.',
      referenceImages: [],
      status: 'pending',
      notes: 'Aisha contacted us via the booking form.',
      serviceId: 'serv-1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  clientGallery: [
    {
      id: 'gal-1',
      title: 'Mehta Wedding Highlights',
      slug: 'mehta-wedding-highlights',
      clientName: 'Rohan & Priya Mehta',
      eventName: 'Wedding Ceremony',
      eventDate: new Date('2024-02-14'),
      description: 'A curated selection of highlights from Rohan & Priya\'s wedding at the Taj Mahal Palace, Mumbai.',
      coverImage: '/sample.png',
      password: 'Priya',
      status: 'active',
      expiryDate: new Date('2025-02-14'),
      downloadsEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  galleryImage: [
    { id: 'gal-img-1', galleryId: 'gal-1', imageUrl: '/sample.png', order: 1, createdAt: new Date() },
    { id: 'gal-img-2', galleryId: 'gal-1', imageUrl: '/sample.png', order: 2, createdAt: new Date() },
    { id: 'gal-img-3', galleryId: 'gal-1', imageUrl: '/sample.png', order: 3, createdAt: new Date() }
  ],
  newsletter: [],
  analytics: []
};

// Maps for fast lookups during initial loading
const categoryMap = {};
db.category.forEach(c => { categoryMap[c.name] = c.id; });

const collectionMap = {};
db.collection.forEach(c => { collectionMap[c.slug] = c.id; });

// Hydrate Photos
db.photo = PHOTOS.map((p, index) => {
  const photoSlug = slug(p.title);
  return {
    id: `photo-${index + 1}`,
    title: p.title,
    slug: photoSlug,
    description: p.description,
    story: p.story,
    imageUrl: p.imageUrl,
    galleryImages: [],
    cloudinaryId: null,
    width: 6000,
    height: 4000,
    resolution: p.resolution || '24 MP',
    orientation: p.orientation || (index % 2 === 0 ? 'landscape' : 'portrait'),
    camera: p.camera || 'Sony A7R V',
    lens: p.lens || 'Sony 24-70mm f/2.8',
    iso: p.iso || 'ISO 100',
    aperture: p.aperture || 'f/8',
    shutterSpeed: p.shutterSpeed || '1/125s',
    location: p.location || 'India',
    dateTaken: new Date('2023-01-01'),
    tags: [p.category.toLowerCase(), 'fine art', 'print'],
    palette: ['#000000', '#ffffff'],
    featured: !!p.featured,
    bestSeller: !!p.bestSeller,
    limitedEdition: !!p.limitedEdition,
    editionSize: 100,
    editionSold: 0,
    views: Math.floor(Math.random() * 200),
    status: 'published',
    basePrice: p.basePrice || 4500,
    categoryId: categoryMap[p.category] || null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
});

const photoMap = {};
db.photo.forEach(p => { photoMap[p.title] = p.id; });

// Hydrate CollectionPhoto relations
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

collectionAssignments.forEach(({ slug: colSlug, photos: pTitles }) => {
  const colId = collectionMap[colSlug];
  if (!colId) return;
  pTitles.forEach((title, i) => {
    const photoId = photoMap[title];
    if (!photoId) return;
    db.collectionPhoto.push({
      collectionId: colId,
      photoId,
      order: i
    });
  });
});

// Helper functions for matching logic
const matchesFilter = (item, key, filter, tableName) => {
  if (filter && typeof filter === 'object' && !Array.isArray(filter)) {
    if (filter.hasOwnProperty('contains')) {
      const fieldVal = (item[key] || '').toString().toLowerCase();
      const searchVal = filter.contains.toLowerCase();
      return fieldVal.includes(searchVal);
    }
    if (filter.hasOwnProperty('hasSome')) {
      const fieldArray = item[key] || [];
      const searchArray = filter.hasSome || [];
      return searchArray.some(val => fieldArray.includes(val));
    }
    if (filter.hasOwnProperty('not')) {
      return item[key] !== filter.not;
    }
    
    // Relation filter logic
    if (tableName === 'photo' && key === 'category') {
      const cat = db.category.find(c => c.id === item.categoryId);
      if (!cat) return false;
      return Object.entries(filter).every(([k, v]) => cat[k] === v);
    }
    if (tableName === 'photo' && key === 'collections') {
      if (filter.some) {
        return db.collectionPhoto.some(cp => {
          if (cp.photoId !== item.id) return false;
          const col = db.collection.find(c => c.id === cp.collectionId);
          if (!col) return false;
          if (filter.some.collection) {
            return Object.entries(filter.some.collection).every(([k, v]) => col[k] === v);
          }
          return true;
        });
      }
    }
    if (tableName === 'collectionPhoto' && key === 'collection') {
      const col = db.collection.find(c => c.id === item.collectionId);
      if (!col) return false;
      return Object.entries(filter).every(([k, v]) => col[k] === v);
    }
    if (tableName === 'collectionPhoto' && key === 'photo') {
      const p = db.photo.find(ph => ph.id === item.photoId);
      if (!p) return false;
      return Object.entries(filter).every(([k, v]) => p[k] === v);
    }
    return false;
  }
  return item[key] === filter;
};

const evalWhere = (item, where, tableName) => {
  if (!where) return true;
  
  if (where.OR) {
    return where.OR.some(cond => {
      return Object.entries(cond).every(([k, v]) => matchesFilter(item, k, v, tableName));
    });
  }
  if (where.AND) {
    return where.AND.every(cond => {
      return Object.entries(cond).every(([k, v]) => matchesFilter(item, k, v, tableName));
    });
  }
  
  return Object.entries(where).every(([k, v]) => matchesFilter(item, k, v, tableName));
};

const makeMockModel = (tableName) => {
  const findMany = async (args = {}) => {
    let result = [...db[tableName]];
    
    if (args.where) {
      result = result.filter(item => evalWhere(item, args.where, tableName));
    }
    
    if (args.orderBy) {
      let key = 'id';
      let dir = 'asc';
      if (Array.isArray(args.orderBy)) {
        const first = args.orderBy[0];
        if (first) {
          key = Object.keys(first)[0];
          dir = first[key];
        }
      } else {
        key = Object.keys(args.orderBy)[0];
        dir = args.orderBy[key];
      }
      result.sort((a, b) => {
        if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    if (args.skip !== undefined) {
      result = result.slice(args.skip);
    }
    if (args.take !== undefined) {
      result = result.slice(0, args.take);
    }
    
    if (args.include) {
      result = result.map(item => {
        const enriched = { ...item };
        if (args.include.category) {
          enriched.category = db.category.find(c => c.id === item.categoryId) || null;
        }
        if (args.include.images) {
          enriched.images = db.galleryImage.filter(gi => gi.galleryId === item.id)
            .sort((a, b) => a.order - b.order);
        }
        if (args.include.photos) {
          const cpList = db.collectionPhoto.filter(cp => cp.collectionId === item.id);
          enriched.photos = cpList.map(cp => {
            const p = db.photo.find(ph => ph.id === cp.photoId);
            return {
              ...cp,
              photo: p ? { ...p, category: db.category.find(c => c.id === p.categoryId) || null } : null
            };
          });
        }
        if (args.include.service) {
          enriched.service = db.service.find(s => s.id === item.serviceId) || null;
        }
        if (args.include._count) {
          enriched._count = {};
          if (args.include._count.select && args.include._count.select.photos) {
            enriched._count.photos = db.collectionPhoto.filter(cp => cp.collectionId === item.id).length;
          }
        }
        if (args.include.author) {
          const authorRecord = db.admin.find(a => a.id === item.authorId);
          if (authorRecord) {
            if (args.include.author.select) {
              const selected = {};
              Object.keys(args.include.author.select).forEach(sk => {
                selected[sk] = authorRecord[sk];
              });
              enriched.author = selected;
            } else {
              enriched.author = authorRecord;
            }
          } else {
            enriched.author = null;
          }
        }
        return enriched;
      });
    }
    
    return result;
  };
  
  const findUnique = async (args = {}) => {
    const records = await findMany({ where: args.where, include: args.include });
    return records[0] || null;
  };
  
  const findFirst = async (args = {}) => {
    const records = await findMany({ where: args.where, include: args.include });
    return records[0] || null;
  };
  
  const count = async (args = {}) => {
    const records = await findMany({ where: args.where });
    return records.length;
  };
  
  const create = async (args = {}) => {
    const newItem = {
      id: args.data.id || `${tableName}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...args.data
    };
    db[tableName].push(newItem);
    return newItem;
  };
  
  const update = async (args = {}) => {
    const index = db[tableName].findIndex(item => {
      for (const [key, value] of Object.entries(args.where)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
    if (index === -1) throw new Error(`Record not found in ${tableName}`);
    db[tableName][index] = {
      ...db[tableName][index],
      ...args.data,
      updatedAt: new Date()
    };
    return db[tableName][index];
  };
  
  const deleteRecord = async (args = {}) => {
    const index = db[tableName].findIndex(item => {
      for (const [key, value] of Object.entries(args.where)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
    if (index === -1) throw new Error(`Record not found in ${tableName}`);
    const deleted = db[tableName].splice(index, 1)[0];
    return deleted;
  };
  
  const deleteMany = async (args = {}) => {
    const originalLen = db[tableName].length;
    if (!args.where || Object.keys(args.where).length === 0) {
      db[tableName] = [];
    } else {
      db[tableName] = db[tableName].filter(item => {
        for (const [key, value] of Object.entries(args.where)) {
          if (item[key] !== value) return true;
        }
        return false;
      });
    }
    return { count: originalLen - db[tableName].length };
  };

  const createMany = async (args = {}) => {
    const newItems = args.data.map(d => ({
      id: d.id || `${tableName}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...d
    }));
    db[tableName].push(...newItems);
    return { count: newItems.length };
  };

  const upsert = async (args = {}) => {
    const existing = await findFirst({ where: args.where });
    if (existing) {
      return update({ where: args.where, data: args.update });
    }
    return create({ data: { ...args.where, ...args.create } });
  };

  // groupBy — minimal mock: group by a single field and count
  const groupBy = async (args = {}) => {
    const records = await findMany({ where: args.where });
    const groupField = args.by && args.by[0];
    if (!groupField) return [];
    const groups = {};
    records.forEach(item => {
      const key = item[groupField];
      if (!groups[key]) groups[key] = { [groupField]: key, _count: { _all: 0 } };
      groups[key]._count._all += 1;
    });
    return Object.values(groups);
  };

  return {
    findMany,
    findUnique,
    findFirst,
    count,
    create,
    update,
    delete: deleteRecord,
    deleteMany,
    createMany,
    upsert,
    groupBy,
  };
};

// Construct Mock Prisma API object
const mockPrisma = {
  admin: makeMockModel('admin'),
  category: makeMockModel('category'),
  printSize: makeMockModel('printSize'),
  frame: makeMockModel('frame'),
  printFinish: makeMockModel('printFinish'),
  glassOption: makeMockModel('glassOption'),
  mountOption: makeMockModel('mountOption'),
  photo: makeMockModel('photo'),
  collection: makeMockModel('collection'),
  collectionPhoto: makeMockModel('collectionPhoto'),
  testimonial: makeMockModel('testimonial'),
  blog: makeMockModel('blog'),
  settings: makeMockModel('settings'),
  service: makeMockModel('service'),
  booking: makeMockModel('booking'),
  clientGallery: makeMockModel('clientGallery'),
  galleryImage: makeMockModel('galleryImage'),
  newsletter: makeMockModel('newsletter'),
  analytics: makeMockModel('analytics'),
  
  $transaction: async (promises) => {
    return Promise.all(promises);
  },
  
  $disconnect: async () => {
    // No-op
  }
};

module.exports = mockPrisma;
