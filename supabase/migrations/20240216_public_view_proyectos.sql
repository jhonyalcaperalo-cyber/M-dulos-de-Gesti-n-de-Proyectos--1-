-- Migration: Allow public (anon) users to view proyectos
-- Execute this SQL in Supabase SQL Editor

-- Allow anyone to view proyectos
CREATE POLICY "Public can view proyectos"
  ON public.proyectos FOR SELECT
  TO anon
  USING (true);
