# Craft Creator's — Premium Custom Photo Framing Studio

A premium, luxury Custom Photo Framing Studio website. Customers upload digital copies of their photo or choose "I will bring a printed copy", configure frame borders, materials, glass properties, and mounts, and submit custom framing inquiries directly via **WhatsApp** — no payment gateway required.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, React Router DOM, React Hook Form |
| Backend | Node.js, Express.js, Prisma ORM |
| Database | PostgreSQL (Local) / Mock in-memory DB fallback |
| Auth | JWT + bcrypt |
| Images | Local disk (`server/uploads/`) |
| Orders | WhatsApp (wa.me) |

---

## Project Structure

```
photo-web/
├── client/          # React 19 + Vite frontend
├── server/          # Node.js + Express backend
│   └── uploads/     # Customer image uploads (stored inside server/uploads/inquiries)
└── README.md
```

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally (optional if using `USE_MOCK_DB=true`)

---

## Local Setup

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Server** — edit `server/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sikhar_photography"
JWT_SECRET="9a7f3b8c2d1e0f9a8b7c6d5e4f3a2b1c"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
USE_MOCK_DB=true
```

> [!NOTE]
> Since `USE_MOCK_DB=true` is enabled, the backend will run using an in-memory mock database hydrated from seed parameters. No PostgreSQL configuration is required for local running!

**Client** — edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

Open **two separate terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Runs API server on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Runs client dashboard on http://localhost:5173
```

---

## Admin Dashboard

Log in at `http://localhost:5173/admin/login` with:

```
Email:    admin@craftcreators.in
Password: Admin@1234
```

---

## Image Upload Protection & Storage

Customer-uploaded photograph files are securely validated (accepts JPG, PNG, WEBP, HEIC up to 15MB) and saved inside:

```
server/uploads/inquiries/
```

Served through Express static middleware for admin review at `http://localhost:5000/uploads/inquiries/<filename>`.

---

## WhatsApp Integration

Once client specifications are submitted, the site generates a pre-formatted WhatsApp message detailing the selected frame profile, glass style, mat mounting, quantity, and print source option. Clicking the CTA directs to:

```
https://wa.me/918077037277?text={encoded_message}
```

The studio number is configurable from the server settings.

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login validation |
| GET | `/api/frames` | Get frame catalogs |
| GET | `/api/frames/:slug` | Get frame style details |
| POST | `/api/inquiries` | Create customer inquiry (optional file upload) |
| GET | `/api/inquiries` | List inquiries (admin) |
| GET | `/api/configurator` | Get size/glass/mount settings |
| GET | `/api/testimonials` | Get customer reviews |
| POST | `/api/newsletter` | Subscribe to newsletter |
| GET | `/api/settings` | Get studio configuration |

---

## License

© Craft Creator's Studio. All rights reserved.
