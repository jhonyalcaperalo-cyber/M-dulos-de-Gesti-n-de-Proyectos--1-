-- Migration: Add INSERT policy for hitos table
-- Execute this SQL in Supabase SQL Editor

-- Drop existing insert policy if exists
DROP POLICY IF EXISTS "Auth users can insert hitos" ON public.hitos;

-- Allow authenticated users to insert hitos for their own projects
CREATE POLICY "Auth users can insert hitos"
  ON public.hitos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.proyectos
      WHERE proyectos.id = hitos.proyectoid
      AND proyectos.user_id = auth.uid()
    )
  );
