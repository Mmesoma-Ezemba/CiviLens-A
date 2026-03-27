-- Create a table for analyses mapped to auth.users
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    input_preview TEXT NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own analyses"
    ON public.analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyses"
    ON public.analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
    ON public.analyses FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- STORAGE CONFIGURATION: Avatars Bucket
-- ==========================================

-- 1. Create the public "avatars" bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow anyone to view avatar images (since they show up on the public web app)
CREATE POLICY "Avatar images are publicly accessible" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'avatars');

-- 3. Allow authenticated users to upload and perfectly update ONLY their own avatars
CREATE POLICY "Users can upload their own avatar" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can fully update their own avatar" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'avatars' AND auth.uid()::text = owner::text);

