-- ============================================
-- Travel By Petal — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- === DESTINATIONS ===
CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_he TEXT NOT NULL,
    tag_en TEXT NOT NULL DEFAULT '',
    tag_he TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL,
    gradient TEXT DEFAULT '',
    highlights_en TEXT[] DEFAULT '{}',
    highlights_he TEXT[] DEFAULT '{}',
    best_time_en TEXT DEFAULT '',
    best_time_he TEXT DEFAULT '',
    cta_url TEXT DEFAULT '',
    cta_text_en TEXT DEFAULT 'Plan My Trip',
    cta_text_he TEXT DEFAULT 'תכננו את הטיול שלי',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- === TESTIMONIALS ===
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name TEXT NOT NULL,
    author_initials TEXT NOT NULL DEFAULT '',
    trip_label TEXT DEFAULT '',
    review_text TEXT NOT NULL,
    stars INT DEFAULT 5 CHECK (stars BETWEEN 1 AND 5),
    source TEXT DEFAULT 'Google Review',
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- === TRIP REQUESTS ===
CREATE TABLE IF NOT EXISTS trip_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    ages TEXT DEFAULT '',
    passport_valid TEXT DEFAULT '',
    destination TEXT DEFAULT '',
    travel_dates TEXT DEFAULT '',
    date_flexibility TEXT DEFAULT '',
    service_type TEXT DEFAULT '',
    budget TEXT DEFAULT '',
    support_level TEXT DEFAULT '',
    flight_pref TEXT DEFAULT '',
    airline_pref TEXT DEFAULT '',
    luggage_type TEXT DEFAULT '',
    cancel_policy TEXT DEFAULT '',
    hotel_level TEXT DEFAULT '',
    bed_type TEXT DEFAULT '',
    meals TEXT DEFAULT '',
    hotel_cancel TEXT DEFAULT '',
    shabbat_kosher TEXT DEFAULT '',
    special_notes TEXT DEFAULT '',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'booked', 'closed')),
    admin_notes TEXT DEFAULT '',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- === BLOG POSTS ===
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL DEFAULT '',
    title_he TEXT NOT NULL DEFAULT '',
    content_en TEXT NOT NULL DEFAULT '',
    content_he TEXT NOT NULL DEFAULT '',
    excerpt_en TEXT DEFAULT '',
    excerpt_he TEXT DEFAULT '',
    cover_image TEXT DEFAULT '',
    author TEXT DEFAULT 'Petal',
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- === CHATBOT LOGS ===
CREATE TABLE IF NOT EXISTS chatbot_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    was_ai BOOLEAN DEFAULT false,
    lang TEXT DEFAULT 'he',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- === ANALYTICS EVENTS ===
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    page TEXT DEFAULT '',
    session_id TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Destinations: public read, admin write
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active destinations" ON destinations
    FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users full access destinations" ON destinations
    FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials: public read, admin write
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active testimonials" ON testimonials
    FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users full access testimonials" ON testimonials
    FOR ALL USING (auth.role() = 'authenticated');

-- Trip Requests: public insert, admin read/update
ALTER TABLE trip_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit trip request" ON trip_requests
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users manage trip requests" ON trip_requests
    FOR ALL USING (auth.role() = 'authenticated');

-- Blog Posts: public read published, admin write
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published posts" ON blog_posts
    FOR SELECT USING (is_published = true);
CREATE POLICY "Auth users full access posts" ON blog_posts
    FOR ALL USING (auth.role() = 'authenticated');

-- Chatbot Logs: public insert, admin read
ALTER TABLE chatbot_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log chat" ON chatbot_logs
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users read chat logs" ON chatbot_logs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Analytics: public insert, admin read
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log events" ON analytics_events
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users read analytics" ON analytics_events
    FOR SELECT USING (auth.role() = 'authenticated');
