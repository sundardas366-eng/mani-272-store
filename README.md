# MANI 272 STORE

**Premium Gaming Digital Products Store**

Built with Next.js 15, React 19, Tailwind CSS, Framer Motion, Zustand, and Supabase.

---

## Features

### Storefront
- Premium black/dark grey theme with red neon accents
- Glassmorphism UI with smooth animations
- Animated hero section with CTA buttons
- Featured Products, Best Sellers, Special Offers, Latest Products sections
- Customer reviews section (no fake reviews — empty by default)
- Statistics section
- Discord and YouTube integration sections
- Background particle effects
- Loading screen animation
- Scroll reveal animations
- Fully responsive (desktop, tablet, mobile)

### Products
- 24 products with individual cards
- 5 categories: Silent Aim, Aim, Bypass, Panels, Utilities
- Each card: image, name, price, description, status badge, buy button
- Product details page with full description, gallery, related products
- External links per product (YouTube, Discord, Demo, Documentation, Custom)
- Links only show when provided

### Shopping
- Add to cart, remove, update quantity
- Cart total calculation
- Checkout page with customer info form
- **Demo checkout** — clearly marked, no fake payment success
- Order confirmation page with order ID
- Order history in user dashboard

### Authentication
- Login, Register, Forgot Password, Reset Password pages
- User profile and dashboard
- Order history and purchased products
- Account settings
- Session management (demo mode with localStorage)

### Admin Dashboard
- Dashboard statistics (products, users, orders, revenue)
- Product management: add, edit, delete products
- Image upload support per product
- External link management per product
- Website settings: logo, name, banner, colors, announcement
- Discord settings: server name, invite URL, description, logo
- YouTube settings: channel name, description, logo, video URL
- Order management: view orders, update status, view customer details
- User management: view users, assign admin permissions

### Design
- **MANI**: Red (#F50B00)
- **272**: White (#FFFFFF)
- Background: Premium Black / Dark Grey
- Glassmorphism cards
- Red neon glow effects
- Orbitron font for branding
- Inter font for body text

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 3 |
| Animations | Framer Motion 11 |
| State | Zustand 5 |
| Auth & DB | Supabase (PostgreSQL) |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Validation | Zod |

---

## Project Structure

```
mani-272-store/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (main)/              # Main store pages
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx     # Product catalog
│   │   │   │   └── [slug]/      # Product details
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── order-confirmation/
│   │   ├── admin/               # Admin dashboard
│   │   │   ├── page.tsx         # Dashboard overview
│   │   │   ├── products/        # Product CRUD
│   │   │   ├── orders/          # Order management
│   │   │   ├── users/           # User management
│   │   │   └── settings/        # Website settings
│   │   ├── dashboard/           # User dashboard
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── layout/              # Navbar, Footer
│   │   ├── home/               # Homepage sections
│   │   ├── products/           # ProductCard
│   │   ├── animations/         # Particles, Loading, Transitions
│   │   └── admin/              # Admin components
│   ├── data/
│   │   ├── products.ts         # Product catalog (24 products)
│   │   └── settings.ts         # Site settings
│   ├── lib/
│   │   └── utils.ts            # Utilities (formatPrice, cn, etc.)
│   ├── store/
│   │   └── cart.ts             # Zustand cart store
│   └── types/
│       └── index.ts            # TypeScript types
├── public/
│   └── images/
│       ├── products/           # Product images
│       ├── logo/               # Logo assets
│       └── banner/             # Banner assets
├── sql/
│   └── schema.sql              # Supabase database schema
├── .env.example                # Environment variable template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+ (v22 recommended)
- npm or yarn or pnpm

### Steps

```bash
# 1. Clone or download the project
cd mani-272-store

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Edit .env.local with your values
#    - Set Supabase URL and keys (when ready to use database)
#    - Set Discord and YouTube links
#    - Set Stripe keys (when ready for payments)

# 5. Run development server
npm run dev
```

Visit `http://localhost:3000`

---

## Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor**
3. Paste and run the contents of `sql/schema.sql`
4. Copy your project URL and anon key from **Settings > API**
5. Paste them into `.env.local`

### RLS Policies
The schema includes Row Level Security policies:
- Products, categories, reviews, settings: public read
- Orders: users read own, admins read all
- Profiles: users read own, admins read all
- All writes require admin role (except order creation and review submission)

---

## Customization

### Product Prices
Edit prices in:
- `src/data/products.ts` (for seed data)
- Admin Dashboard > Products > Edit (when database is connected)

### Product Images
- Replace SVG placeholders in `public/images/products/`
- Or upload via Admin Dashboard > Products > Edit

### Logo
- Replace file in `public/images/logo/`
- Or upload via Admin Dashboard > Settings

### Colors
- Edit `tailwind.config.ts` under `colors.mani`
- Or change via Admin Dashboard > Settings

### Discord / YouTube
- Set environment variables in `.env.local`
- Or edit via Admin Dashboard > Settings

---

## Production Deployment

### Vercel (recommended)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "MANI 272 STORE"
git remote add origin https://github.com/yourusername/mani-272-store.git
git push -u origin main

# 2. Import on Vercel
#    - Go to vercel.com
#    - Import your GitHub repo
#    - Add environment variables
#    - Deploy
```

### Other platforms
```bash
npm run build
npm start
```

---

## Payment Gateway Integration

The checkout is currently a **demo** (clearly marked). To integrate a real payment gateway:

### Stripe Example
1. Install: `npm install stripe @stripe/stripe-js`
2. Set environment variables in `.env.local`
3. Create an API route at `src/app/api/checkout/route.ts`
4. Replace the demo checkout in `checkout/page.tsx` with Stripe redirect
5. Create a webhook handler at `src/app/api/webhook/route.ts` for payment verification

---

## Security Notes

- Never expose service role keys in frontend code
- Use Supabase RLS policies for database access control
- Validate all inputs with Zod
- Use server-side checks for admin actions
- Hash passwords (handled by Supabase Auth)
- Validate image uploads (file type, size)

---

## License

MIT

---

**MANI 272 STORE** — Premium Gaming Digital Products Store
