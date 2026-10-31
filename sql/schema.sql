-- ============================================================
-- MANI 272 STORE — Supabase / PostgreSQL Database Schema
-- ============================================================
-- Run this in your Supabase SQL Editor to create all tables.
-- ============================================================

-- ---- Products ----
CREATE TABLE IF NOT EXISTS products (
    id              TEXT PRIMARY KEY,
    slug            TEXT UNIQUE NOT NULL,
    name            TEXT NOT NULL,
    category        TEXT NOT NULL DEFAULT 'utility',
    price           INTEGER NOT NULL DEFAULT 0,
    description     TEXT,
    full_description TEXT,
    status          TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'unavailable')),
    image           TEXT,
    gallery         JSONB DEFAULT '[]'::jsonb,
    links           JSONB DEFAULT '{}'::jsonb,
    featured        BOOLEAN DEFAULT FALSE,
    best_seller     BOOLEAN DEFAULT FALSE,
    special_offer   BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Categories ----
CREATE TABLE IF NOT EXISTS categories (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT,
    icon        TEXT
);

-- ---- Profiles (extends auth.users) ----
CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       TEXT,
    name        TEXT,
    role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Orders ----
CREATE TABLE IF NOT EXISTS orders (
    id              TEXT PRIMARY KEY,
    user_id         UUID REFERENCES auth.users(id),
    user_email      TEXT,
    customer_name   TEXT,
    items           JSONB NOT NULL DEFAULT '[]'::jsonb,
    total           INTEGER NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'completed', 'cancelled')),
    payment_method  TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Reviews ----
CREATE TABLE IF NOT EXISTS reviews (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    product_id    TEXT REFERENCES products(id) ON DELETE CASCADE,
    product_name  TEXT,
    customer_name TEXT NOT NULL,
    rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment       TEXT,
    date          TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Site Settings ----
CREATE TABLE IF NOT EXISTS site_settings (
    id                          INTEGER PRIMARY KEY DEFAULT 1,
    logo_url                    TEXT,
    site_name                   TEXT DEFAULT 'MANI 272 STORE',
    banner_text                 TEXT,
    announcement_text           TEXT,
    primary_color               TEXT DEFAULT '#F50B00',
    discord_invite_url          TEXT,
    discord_server_name         TEXT,
    discord_server_description  TEXT,
    discord_logo_url            TEXT,
    youtube_channel_name        TEXT,
    youtube_channel_description TEXT,
    youtube_channel_logo        TEXT,
    youtube_video_url           TEXT
);

-- ---- Insert default settings ----
INSERT INTO site_settings (id, site_name, primary_color)
VALUES (1, 'MANI 272 STORE', '#F50B00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Products: public read, admin write
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Categories: public read, admin write
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles: users read own, admin read all
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins read all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders: users read own, admin read all
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews: public read, authenticated insert
CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Site settings: public read, admin write
CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- Auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'name', 'user')
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Seed initial products
-- ============================================================
INSERT INTO products (id, slug, name, category, price, status, description, full_description, image, featured, best_seller, special_offer) VALUES
('p01', 'silent-aim', 'SILENT-AIM', 'silent-aim', 2500, 'available', 'Silent aim module', 'Stealth-oriented aim module.', '/images/products/silent-aim.svg', true, true, false),
('p02', 'silent-aim-max', 'SILENT-AIM-MAX', 'silent-aim', 3500, 'available', 'Max-tier silent aim', 'Enhanced silent aim with prediction.', '/images/products/silent-aim-max.svg', true, false, true),
('p06', 'aimkill', 'AIMKILL', 'aim', 1500, 'available', 'Classic aim assist', 'Smooth tracking aim assist.', '/images/products/aimkill.svg', true, true, false),
('p16', 'brutal-panel', 'BRUTAL-PANEL', 'panel', 2000, 'available', 'Full-featured panel', 'Aggressive panel with customisation.', '/images/products/brutal-panel.svg', false, true, false),
('p17', 'premium-panel', 'PREMIUM-PANEL', 'panel', 3500, 'available', 'Top-tier panel', 'All modules unlocked.', '/images/products/premium-panel.svg', true, true, true)
ON CONFLICT (id) DO NOTHING;
