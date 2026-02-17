-- Migration: Fix RLS policies for authenticated users to upload documents
-- Execute this SQL in Supabase SQL Editor

-- First, drop ALL existing policies on documentos table
DO $$
DECLARE
    pol TEXT;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'documentos' AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol) || ' ON public.documentos';
    END LOOP;
END $$;

-- First, drop ALL existing policies on hitos table
DO $$
DECLARE
    pol TEXT;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'hitos' AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol) || ' ON public.hitos';
    END LOOP;
END $$;

-- First, drop ALL existing policies on proyectos table
DO $$
DECLARE
    pol TEXT;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'proyectos' AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol) || ' ON public.proyectos';
    END LOOP;
END $$;

-- Create RLS policies for documentos table
CREATE POLICY "Auth users can insert documentos"
  ON public.documentos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can select documentos"
  ON public.documentos FOR SELECT
  TO authenticated
  USING (true);

-- Create RLS policies for hitos table
CREATE POLICY "Auth users can update hitos"
  ON public.hitos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Auth users can select hitos"
  ON public.hitos FOR SELECT
  TO authenticated
  USING (true);

-- Create RLS policies for proyectos table
CREATE POLICY "Auth users can select proyectos"
  ON public.proyectos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Auth users can insert proyectos"
  ON public.proyectos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can update proyectos"
  ON public.proyectos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix storage policies for Documentos bucket
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete" ON storage.objects;
DROP POLICY IF EXISTS "Ver documentos" ON storage.objects;
DROP POLICY IF EXISTS "Subir documentos" ON storage.objects;
DROP POLICY IF EXISTS "Eliminar documentos" ON storage.objects;

CREATE POLICY "Auth users can view storage"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'Documentos');

CREATE POLICY "Auth users can upload storage"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'Documentos');

CREATE POLICY "Auth users can delete storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'Documentos');
