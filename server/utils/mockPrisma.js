/**
 * CRAFT CREATOR'S — In-memory Mock Prisma Client
 * Emulates CRUD operations on seed data to run without PostgreSQL.
 * Set USE_MOCK_DB=true in .env to activate.
 */

const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const {
  FRAME_CATEGORIES,
  FRAME_MATERIALS,
  FRAME_COLORS,
  FRAME_SIZES,
  GLASS_OPTIONS,
  MOUNT_OPTIONS,
  FRAME_DESIGNS,
  SERVICES,
  TESTIMONIALS,
} = require('../prisma/seed');

const slug = (str) => slugify(str, { lower: true, strict: true, trim: true });

// Hash default admin password
const adminHashedPassword = bcrypt.hashSync('Admin@1234', 10);

// ─── Initialize DB Tables ─────────────────────────────────────────────────────
const db = {
  admin: [
    {
      id: 'admin-1',
      name: 'Craft Creator\'s Admin',
      email: 'admin@craftcreators.in',
      password: adminHashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  frameCategory: FRAME_CATEGORIES.map((c, i) => ({
    id: `cat-${i + 1}`,
    name: c.name,
    slug: c.slug,
    description: c.description || null,
    imageUrl: null,
    order: c.order,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),

  frameMaterial: FRAME_MATERIALS.map((m, i) => ({
    id: `mat-${i + 1}`,
    name: m.name,
    description: m.description || null,
    priceAdder: m.priceAdder || 0,
    order: m.order,
  })),

  frameColor: FRAME_COLORS.map((c, i) => ({
    id: `col-${i + 1}`,
    name: c.name,
    hex: c.hex,
    order: c.order,
  })),

  frameSize: FRAME_SIZES.map((s, i) => ({
    id: `size-${i + 1}`,
    label: s.label,
    width: s.width,
    height: s.height,
    basePrice: s.basePrice,
    isCustom: !!s.isCustom,
    order: s.order,
  })),

  glassOption: GLASS_OPTIONS.map((g, i) => ({
    id: `glass-${i + 1}`,
    name: g.name,
    description: g.description || null,
    price: g.price,
    order: g.order,
  })),

  mountOption: MOUNT_OPTIONS.map((m, i) => ({
    id: `mount-${i + 1}`,
    name: m.name,
    description: m.description || null,
    price: m.price,
    order: m.order,
  })),

  frameDesign: [],
  frameReview: [],

  service: SERVICES.map((s, i) => ({
    id: `serv-${i + 1}`,
    title: s.title,
    slug: s.slug,
    description: s.description,
    overview: s.overview || null,
    includes: s.includes || [],
    startingPrice: s.startingPrice || 0,
    duration: s.duration || null,
    heroImage: null,
    gallery: [],
    faqs: s.faqs || [],
    featured: !!s.featured,
    status: 'active',
    order: s.order || i + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),

  testimonial: TESTIMONIALS.map((t, i) => ({
    id: `test-${i + 1}`,
    name: t.name,
    title: t.title || null,
    quote: t.quote,
    rating: t.rating || 5,
    photoUrl: null,
    featured: !!t.featured,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),

  inquiry: [
    {
      id: 'inq-demo-1',
      customerName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98200 11111',
      whatsapp: '919820011111',
      frameName: 'Teak Classic',
      frameId: null,
      material: 'Solid Wood',
      color: 'Natural Oak',
      size: '16×24',
      customWidth: null,
      customHeight: null,
      glass: 'Anti-Glare Glass',
      mount: 'White Mount',
      quantity: 1,
      photoOption: 'upload',
      uploadedImageUrl: null,
      status: 'pending',
      notes: null,
      totalEstimate: null,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      id: 'inq-demo-2',
      customerName: 'Rohan Mehta',
      email: 'rohan.mehta@example.com',
      phone: '+91 99300 22222',
      whatsapp: '919930022222',
      frameName: 'Grand Imperial',
      frameId: null,
      material: 'Composite',
      color: 'Antique Gold',
      size: '12×18',
      customWidth: null,
      customHeight: null,
      glass: 'Museum Glass',
      mount: 'Double Mount',
      quantity: 2,
      photoOption: 'bring',
      uploadedImageUrl: null,
      status: 'confirmed',
      notes: 'Wedding portraits. Customer will bring physical prints.',
      totalEstimate: 24000,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      id: 'inq-demo-3',
      customerName: 'Arjun Kapoor',
      email: 'arjun.kapoor@example.com',
      phone: '+91 97700 33333',
      whatsapp: '919770033333',
      frameName: 'Black Obsidian',
      frameId: null,
      material: 'MDF Wood',
      color: 'Matte Black',
      size: '24×36',
      customWidth: null,
      customHeight: null,
      glass: 'UV-Protection Glass',
      mount: 'Without Mount',
      quantity: 3,
      photoOption: 'upload',
      uploadedImageUrl: null,
      status: 'in_progress',
      notes: 'Corporate office installation. Rush order.',
      totalEstimate: 18000,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      id: 'inq-demo-4',
      customerName: 'Meera Nair',
      email: 'meera.nair@example.com',
      phone: '+91 96600 44444',
      whatsapp: '919660044444',
      frameName: 'Regency Gold',
      frameId: null,
      material: 'Composite',
      color: 'Antique Gold',
      size: '8×10',
      customWidth: null,
      customHeight: null,
      glass: 'Standard Glass',
      mount: 'Cream Mount',
      quantity: 1,
      photoOption: 'bring',
      uploadedImageUrl: null,
      status: 'completed',
      notes: null,
      totalEstimate: 4500,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ],

  newsletter: [],
  analytics: [],

  settings: [
    {
      id: 'settings-1',
      businessName: 'Craft Creator\'s',
      tagline: 'Custom Photo Framing, Crafted with Precision',
      whatsappNumber: '918077037277',
      phone: '+91 80770 37277',
      email: 'hello@craftcreators.in',
      address: 'Mumbai, Maharashtra, India',
      instagramUrl: 'https://www.instagram.com/craft_creators_original',
      facebookUrl: 'https://facebook.com/craftcreators',
      youtubeUrl: 'https://youtube.com/@craftcreators',
      heroTitle: 'Frame Your Memories,\nForever',
      heroSubtitle: 'Premium custom photo framing — your photographs, our craftsmanship',
      heroImage: null,
      aboutText: 'Craft Creator\'s is a premium custom photo framing studio based in Mumbai, dedicated to preserving your most cherished memories in frames of exceptional quality. From intimate family portraits to large-format art prints, we craft each frame by hand using premium materials and time-honoured techniques.',
      seoTitle: 'Craft Creator\'s | Premium Custom Photo Framing Studio',
      seoDescription: 'Premium custom photo framing in Mumbai. Upload your photo or bring a printed copy. Choose from 40+ frame styles. Order via WhatsApp.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

// ─── Hydrate Frame Designs ─────────────────────────────────────────────────────
const categoryMap = {};
db.frameCategory.forEach(c => { categoryMap[c.name] = c.id; });

db.frameDesign = FRAME_DESIGNS.map((f, i) => ({
  id: `frame-${i + 1}`,
  name: f.name,
  slug: f.slug,
  description: f.description || null,
  imageUrl: f.imageUrl,
  galleryImages: f.galleryImages || [],
  material: f.material,
  colors: f.colors || [],
  availableSizes: f.availableSizes || [],
  thickness: f.thickness || '2cm',
  basePrice: f.basePrice || 2000,
  productionDays: f.productionDays || 3,
  featured: !!f.featured,
  bestseller: !!f.bestseller,
  isAvailable: true,
  categoryId: categoryMap[f.category] || null,
  order: i + 1,
  views: Math.floor(Math.random() * 300) + 50,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

// Assign demo frameIds to inquiries
db.inquiry[0].frameId = db.frameDesign.find(f => f.name === 'Teak Classic')?.id || null;
db.inquiry[1].frameId = db.frameDesign.find(f => f.name === 'Grand Imperial')?.id || null;
db.inquiry[2].frameId = db.frameDesign.find(f => f.name === 'Black Obsidian')?.id || null;
db.inquiry[3].frameId = db.frameDesign.find(f => f.name === 'Regency Gold')?.id || null;

// ─── Frame Reviews ────────────────────────────────────────────────────────────
db.frameReview = [
  {
    id: 'rev-1',
    frameId: db.frameDesign.find(f => f.name === 'Teak Classic')?.id,
    customerName: 'Sunita M.',
    rating: 5,
    comment: 'Absolutely beautiful frame. The wood grain is stunning and the finish is flawless. Highly recommend.',
    verified: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'rev-2',
    frameId: db.frameDesign.find(f => f.name === 'Teak Classic')?.id,
    customerName: 'Rahul K.',
    rating: 5,
    comment: 'Got this for my parents\' anniversary photo. They loved it. Great quality and fast delivery.',
    verified: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'rev-3',
    frameId: db.frameDesign.find(f => f.name === 'Metro Slim')?.id,
    customerName: 'Anika P.',
    rating: 5,
    comment: 'The Metro Slim is perfect for my modern apartment. Clean, minimal, and the quality is top-notch.',
    verified: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'rev-4',
    frameId: db.frameDesign.find(f => f.name === 'Regency Gold')?.id,
    customerName: 'Vikram S.',
    rating: 5,
    comment: 'Ordered for my wedding portrait. The Regency Gold frame is majestic — better in person than in photos.',
    verified: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'rev-5',
    frameId: db.frameDesign.find(f => f.name === 'Float Classic')?.id,
    customerName: 'Priya R.',
    rating: 4,
    comment: 'Love the floating effect. Really gives the photo a gallery feel. Would rate 5 stars but delivery took slightly longer than expected.',
    verified: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'rev-6',
    frameId: db.frameDesign.find(f => f.name === 'Black Obsidian')?.id,
    customerName: 'James H.',
    rating: 5,
    comment: 'The gloss black finish is stunning. Really makes the colours in my landscape photo pop.',
    verified: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

// ─── Generic makeMockModel ────────────────────────────────────────────────────
const matchesFilter = (item, key, filter, tableName) => {
  if (filter && typeof filter === 'object' && !Array.isArray(filter)) {
    if (filter.hasOwnProperty('contains')) {
      const fieldVal = (item[key] || '').toString().toLowerCase();
      return fieldVal.includes(filter.contains.toLowerCase());
    }
    if (filter.hasOwnProperty('hasSome')) {
      const fieldArray = item[key] || [];
      return (filter.hasSome || []).some(val => fieldArray.includes(val));
    }
    if (filter.hasOwnProperty('not')) {
      return item[key] !== filter.not;
    }
    if (filter.hasOwnProperty('in')) {
      return filter.in.includes(item[key]);
    }
    if (filter.hasOwnProperty('gte')) {
      return item[key] >= filter.gte;
    }
    if (filter.hasOwnProperty('lte')) {
      return item[key] <= filter.lte;
    }
    // Relation filter for frameDesign -> category
    if (tableName === 'frameDesign' && key === 'category') {
      const cat = db.frameCategory.find(c => c.id === item.categoryId);
      if (!cat) return false;
      return Object.entries(filter).every(([k, v]) => cat[k] === v);
    }
    if (tableName === 'frameReview' && key === 'frame') {
      const frame = db.frameDesign.find(f => f.id === item.frameId);
      if (!frame) return false;
      return Object.entries(filter).every(([k, v]) => frame[k] === v);
    }
    return false;
  }
  return item[key] === filter;
};

const evalWhere = (item, where, tableName) => {
  if (!where) return true;
  if (where.OR) {
    return where.OR.some(cond =>
      Object.entries(cond).every(([k, v]) => matchesFilter(item, k, v, tableName))
    );
  }
  if (where.AND) {
    return where.AND.every(cond =>
      Object.entries(cond).every(([k, v]) => matchesFilter(item, k, v, tableName))
    );
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
      const ob = Array.isArray(args.orderBy) ? args.orderBy[0] : args.orderBy;
      if (ob) {
        key = Object.keys(ob)[0];
        dir = ob[key];
      }
      result.sort((a, b) => {
        if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    if (args.skip !== undefined) result = result.slice(args.skip);
    if (args.take !== undefined) result = result.slice(0, args.take);

    if (args.include) {
      result = result.map(item => {
        const enriched = { ...item };
        if (args.include.category) {
          enriched.category = db.frameCategory.find(c => c.id === item.categoryId) || null;
        }
        if (args.include.reviews) {
          enriched.reviews = db.frameReview.filter(r => r.frameId === item.id);
        }
        if (args.include.frames) {
          enriched.frames = db.frameDesign.filter(f => f.categoryId === item.id);
        }
        if (args.include._count) {
          enriched._count = {};
          if (args.include._count.select) {
            if (args.include._count.select.frames) {
              enriched._count.frames = db.frameDesign.filter(f => f.categoryId === item.id).length;
            }
            if (args.include._count.select.reviews) {
              enriched._count.reviews = db.frameReview.filter(r => r.frameId === item.id).length;
            }
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
      ...args.data,
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
      updatedAt: new Date(),
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
    return db[tableName].splice(index, 1)[0];
  };

  const deleteMany = async (args = {}) => {
    const originalLen = db[tableName].length;
    if (!args.where || Object.keys(args.where).length === 0) {
      db[tableName] = [];
    } else {
      db[tableName] = db[tableName].filter(item => !evalWhere(item, args.where, tableName));
    }
    return { count: originalLen - db[tableName].length };
  };

  const createMany = async (args = {}) => {
    const newItems = (args.data || []).map(d => ({
      id: d.id || `${tableName}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...d,
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
    let result = Object.values(groups);
    if (args.orderBy) {
      const ob = Array.isArray(args.orderBy) ? args.orderBy[0] : args.orderBy;
      if (ob) {
        const key = Object.keys(ob)[0];
        const dir = ob[key];
        result.sort((a, b) => {
          const av = key.startsWith('_count') ? a._count._all : a[key];
          const bv = key.startsWith('_count') ? b._count._all : b[key];
          return dir === 'desc' ? bv - av : av - bv;
        });
      }
    }
    if (args.take) result = result.slice(0, args.take);
    return result;
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

// ─── Construct Mock Prisma API ─────────────────────────────────────────────────
const mockPrisma = {
  admin: makeMockModel('admin'),
  frameCategory: makeMockModel('frameCategory'),
  frameMaterial: makeMockModel('frameMaterial'),
  frameColor: makeMockModel('frameColor'),
  frameSize: makeMockModel('frameSize'),
  glassOption: makeMockModel('glassOption'),
  mountOption: makeMockModel('mountOption'),
  frameDesign: makeMockModel('frameDesign'),
  frameReview: makeMockModel('frameReview'),
  inquiry: makeMockModel('inquiry'),
  service: makeMockModel('service'),
  testimonial: makeMockModel('testimonial'),
  newsletter: makeMockModel('newsletter'),
  settings: makeMockModel('settings'),
  analytics: makeMockModel('analytics'),

  $transaction: async (promises) => Promise.all(promises),
  $disconnect: async () => {},
};

module.exports = mockPrisma;
