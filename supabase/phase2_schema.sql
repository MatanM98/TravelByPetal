-- ============================================
-- Phase 2: User System, CRM, Affiliate Tracking
-- Run this in Supabase SQL Editor
-- ============================================

-- === USER PROFILES (extends Supabase auth.users) ===
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'agent', 'customer')),
    avatar_url TEXT DEFAULT '',
    preferred_lang TEXT DEFAULT 'he',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- === SAVED DESTINATIONS (user favorites) ===
CREATE TABLE IF NOT EXISTS saved_destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, destination_id)
);

-- === AFFILIATE CLICKS ===
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_name TEXT NOT NULL,
    link_url TEXT NOT NULL,
    session_id TEXT DEFAULT '',
    referrer TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- === QUOTES (admin creates for customers) ===
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES trip_requests(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT DEFAULT '',
    description TEXT NOT NULL,
    items JSONB DEFAULT '[]',
    total_amount DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'ILS',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
    valid_until TIMESTAMPTZ,
    notes TEXT DEFAULT '',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- === RLS POLICIES ===

-- User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins full access profiles" ON user_profiles
    FOR ALL USING (auth.role() = 'authenticated');

-- Saved Destinations
ALTER TABLE saved_destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved dests" ON saved_destinations
    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins read saved dests" ON saved_destinations
    FOR SELECT USING (auth.role() = 'authenticated');

-- Affiliate Clicks
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log clicks" ON affiliate_clicks
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read clicks" ON affiliate_clicks
    FOR SELECT USING (auth.role() = 'authenticated');

-- Quotes
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage quotes" ON quotes
    FOR ALL USING (auth.role() = 'authenticated');

-- === AUTO-CREATE PROFILE ON SIGNUP ===
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, role)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'customer');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
