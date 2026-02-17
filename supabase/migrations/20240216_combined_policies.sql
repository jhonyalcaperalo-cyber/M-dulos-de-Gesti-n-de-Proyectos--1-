-- Migration: RLS policies - only insert for proyectos (other policies already exist)
-- Execute this SQL in Supabase SQL Editor

-- Allow authenticated users to INSERT proyectos (this is the missing policy)
CREATE POLICY "Auth users can insert proyectos"
  ON public.proyectos FOR INSERT
  TO authenticated
  WITH CHECK (true);
