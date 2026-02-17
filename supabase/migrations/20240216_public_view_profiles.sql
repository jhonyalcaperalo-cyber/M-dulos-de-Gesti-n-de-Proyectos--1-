-- Migration: Allow public (anon) users to view profiles for project creator names
-- Execute this SQL in Supabase SQL Editor

-- Allow anyone to view profiles (needed to show project creator names)
CREATE POLICY "Public can view profiles"
  ON public.profiles FOR SELECT
  TO anon
  USING (true);
