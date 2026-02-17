-- Migration: Add INSERT policy for proyectos table
-- Execute this SQL in Supabase SQL Editor

-- Allow authenticated users to INSERT proyectos
CREATE POLICY "Auth users can insert proyectos"
  ON public.proyectos FOR INSERT
  TO authenticated
  WITH CHECK (true);
