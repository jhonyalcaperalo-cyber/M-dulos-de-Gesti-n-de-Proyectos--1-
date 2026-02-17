-- Migration: Restrict hitos to project owners only
-- Execute this SQL in Supabase SQL Editor

-- Drop existing policies for hitos (they allow all authenticated users)
DROP POLICY IF EXISTS "Auth users can select hitos" ON public.hitos;
DROP POLICY IF EXISTS "Auth users can update hitos" ON public.hitos;
DROP POLICY IF EXISTS "Auth users can insert hitos" ON public.hitos;

-- Allow anyone to view hitos (public read)
CREATE POLICY "Public can view hitos"
  ON public.hitos FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to insert hitos only for their own projects
CREATE POLICY "Owner can insert hitos"
  ON public.hitos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.proyectos
      WHERE proyectos.id = hitos.proyectoid
      AND proyectos.user_id = auth.uid()
    )
  );

-- Allow authenticated users to update hitos only for their own projects
CREATE POLICY "Owner can update hitos"
  ON public.hitos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.proyectos
      WHERE proyectos.id = hitos.proyectoid
      AND proyectos.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.proyectos
      WHERE proyectos.id = hitos.proyectoid
      AND proyectos.user_id = auth.uid()
    )
  );
