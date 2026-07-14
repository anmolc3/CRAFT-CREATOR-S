# Sikhar — Fine Art Photography Portfolio & Print Store

A luxury photographer portfolio and fine art print store. Customers configure custom framed prints and place orders via **WhatsApp** — no payment gateway required.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, React Router DOM |
| Backend | Node.js, Express.js, Prisma ORM |
| Database | PostgreSQL (local) |
| Auth | JWT + bcrypt |
| Images | Local disk (`server/uploads/`) |
| Orders | WhatsApp (wa.me) |

---

## Project Structure

```
photo-web/
├── client/          # React 19 + Vite frontend
├── server/          # Node.js + Express backend
│   └── uploads/     # Uploaded images (served as static files)
└── README.md
```

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally

---

## Local Setup

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Server** — copy `server/.env.example` to `server/.env`:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sikhar_photography"
JWT_SECRET="change-this-to-a-long-random-secret"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client** — copy `client/.env.example` to `client/.env`:

```bash
cp client/.env.example client/.env
```

`client/.env` (defaults are already correct for local dev):

```env
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=919876543210
VITE_PHOTOGRAPHER_NAME=Sikhar
```

### 3. Set Up Database

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed with sample data (photos, categories, collections, etc.)
npx prisma db seed
```

### 4. Run Development Servers

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## Admin Dashboard

After seeding, log in at `http://localhost:5173/admin/login` with:

```
Email:    admin@sikhar.photography
Password: Admin@1234
```

---

## Image Uploads

Uploaded images are stored in `server/uploads/` and served as static files at:

```
http://localhost:5000/uploads/<filename>
```

No cloud storage account is required. To add cloud storage later, update `server/middleware/upload.js` and `server/config/storage.js` — no routes or controllers need to change.

---

## WhatsApp Integration

When a customer clicks **Order on WhatsApp**, the site generates a pre-filled message with their selected print options and opens:

```
https://wa.me/{VITE_WHATSAPP_NUMBER}?text={encoded_message}
```

Set your WhatsApp number (with country code, no `+`) in `client/.env`.

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/photos` | List photos (paginated) |
| GET | `/api/photos/:slug` | Single photo |
| POST | `/api/photos` | Upload photo (admin) |
| GET | `/api/categories` | All categories |
| GET | `/api/collections` | All collections |
| GET | `/api/frames` | Frame options |
| GET | `/api/sizes` | Print sizes |
| GET | `/api/testimonials` | Testimonials |
| GET | `/api/blogs` | Blog posts |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| GET | `/api/settings` | Site settings |
| GET | `/api/analytics` | Analytics (admin) |
| POST | `/api/analytics/track` | Track event |

---

## License

© Sikhar Photography. All rights reserved.
