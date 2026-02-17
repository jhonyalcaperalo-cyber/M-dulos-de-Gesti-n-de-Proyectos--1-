-- Migration: Add public read-only access to proyectos table
-- This allows anyone to view projects without login

-- Add policy to allow public (anon) users to view proyectos
CREATE POLICY "Public can view proyectos"
  ON public.proyectos FOR SELECT
  TO anon
  USING (true);

-- Add policy to allow public (anon) users to view hitos
CREATE POLICY "Public can view hitos"
  ON public.hitos FOR SELECT
  TO anon
  USING (true);

-- Add policy to allow public (anon) users to view aportes
CREATE POLICY "Public can view aportes"
  ON public.aportes FOR SELECT
  TO anon
  USING (true);

-- Add policy to allow public (anon) users to view personas
CREATE POLICY "Public can view personas"
  ON public.personas FOR SELECT
  TO anon
  USING (true);

-- Add policy to allow public (anon) users to view documentos
CREATE POLICY "Public can view documentos"
  ON public.documentos FOR SELECT
  TO anon
  USING (true);
