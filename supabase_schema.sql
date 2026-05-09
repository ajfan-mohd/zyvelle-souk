-- SQL Schema for Zyvelle Souk Hero Slides
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    button_text TEXT DEFAULT 'Discover Collection',
    button_link TEXT DEFAULT '/collections',
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- 1. Allow everyone to view active slides
CREATE POLICY "Allow public read access to active slides" 
ON public.hero_slides FOR SELECT 
USING (is_active = true);

-- 2. Allow authenticated users (admin) to perform all actions
-- Note: In a production app, you'd restrict this to specific admin UIDs or roles.
CREATE POLICY "Allow authenticated users full access" 
ON public.hero_slides FOR ALL 
USING (auth.role() = 'authenticated');

-- Optional: Insert a starter slide
INSERT INTO public.hero_slides (title, subtitle, image_url, order_index)
VALUES (
    'Art of\nElegance', 
    'EST. 2024 — FINE JEWELLERY', 
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=2000',
    0
);
