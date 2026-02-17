-- Simple RLS for hitos - allow authenticated users to insert
-- Run this in Supabase SQL Editor

-- Drop all existing policies on hitos
DROP POLICY IF EXISTS "Owner can insert hitos" ON public.hitos;
DROP POLICY IF EXISTS "Owner can update hitos" ON public.hitos;
DROP POLICY IF EXISTS "Public can view hitos" ON public.hitos;
DROP POLICY IF EXISTS "Auth users can select hitos" ON public.hitos;
DROP POLICY IF EXISTS "Auth users can update hitos" ON public.hitos;
DROP POLICY IF EXISTS "Auth users can insert hitos" ON public.hitos;

-- Allow anyone to view hitos
CREATE POLICY "Public can view hitos" ON public.hitos
  FOR SELECT TO anon USING (true);

-- Allow authenticated users to insert hitos
CREATE POLICY "Auth users can insert hitos" ON public.hitos
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update hitos
CREATE POLICY "Auth users can update hitos" ON public.hitos
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
