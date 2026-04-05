# Travel By Petal — Backend Setup Guide

Everything is built and ready! You just need to run 2 SQL scripts and create an admin account.

## Step 1: Run Database Schema (2 minutes)

1. Go to **https://supabase.com/dashboard**
2. Open your project **travel-by-petal**
3. Click **SQL Editor** (left sidebar, `<>` icon)
4. Click **New Query**
5. Open the file `supabase/schema.sql` from your project
6. Copy ALL the content and paste it in the SQL Editor
7. Click **Run** (green button or Ctrl+Enter)
8. You should see "Success" — all tables created!

## Step 2: Seed Initial Data (1 minute)

1. Click **New Query** again in SQL Editor
2. Open the file `supabase/seed.sql`
3. Copy ALL the content and paste it
4. Click **Run**
5. Your 7 destinations and 8 testimonials are now in the database!

## Step 3: Create Admin Account (1 minute)

1. In Supabase dashboard, go to **Authentication** (left sidebar)
2. Click **Users** tab
3. Click **Add User** > **Create New User**
4. Enter your email and a password
5. Click **Create User**
6. This is your admin login for the CMS panel

## Step 4: Test the Admin Panel

1. Go to **https://matanm98.github.io/TravelByPetal/admin.html**
2. Login with the email/password you created in Step 3
3. You should see the Dashboard!

## Step 5: Set Up AI Chatbot (Optional — requires Gemini API key)

1. Go to **https://aistudio.google.com/apikey**
2. Create a free API key
3. In Supabase dashboard, go to **Edge Functions**
4. Deploy the chat function (requires Supabase CLI):
   ```
   npm install -g supabase
   supabase login
   supabase link --project-ref audtbcwgkaybqvixfjnf
   supabase secrets set GEMINI_API_KEY=your_api_key_here
   supabase functions deploy chat
   ```
5. The chatbot will now use AI! If the Edge Function isn't deployed, the chatbot falls back to the existing rule-based system automatically.

## What's Working Now

After Steps 1-4:
- **Admin Panel** at /admin.html — manage destinations, testimonials, trip requests, blog posts
- **Dynamic Content** — website loads destinations/testimonials from database
- **Trip Form** — submissions go to Supabase (viewable in admin panel)
- **Analytics** — page views, form starts/completions tracked automatically
- **Chat Logs** — all chatbot conversations logged

## Architecture

```
Website (GitHub Pages) ──→ Supabase Database (PostgreSQL)
                        ──→ Supabase Auth (admin login)
                        ──→ Supabase Edge Function (AI chatbot)
                        ──→ Google Forms (fallback)
```

Everything falls back gracefully if Supabase is down — the site works exactly as before with hardcoded content.
