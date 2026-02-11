-- Migration: Fix RLS policies for hitos, proyectos, and documentos tables

-- Ensure public schema access
GRANT USAGE ON SCHEMA public TO authenticated;

-- Fix documentos table policies (drop existing and create new)
DROP POLICY IF EXISTS documentos_select_auth ON documentos;
DROP POLICY IF EXISTS documentos_insert_auth ON documentos;
DROP POLICY IF EXISTS documentos_select ON documentos;
DROP POLICY IF EXISTS documentos_insert ON documentos;

ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view documentos"
  ON documentos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert documentos"
  ON documentos FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure hitos table has proper RLS policies
ALTER TABLE hitos ENABLE ROW LEVEL SECURITY IF NOT EXISTS;

DROP POLICY IF EXISTS hitos_select_auth ON hitos;
DROP POLICY IF EXISTS hitos_update_auth ON hitos;

CREATE POLICY "Authenticated users can view hitos"
  ON hitos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update hitos"
  ON hitos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure proyectos table has proper RLS policies
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY IF NOT EXISTS;

DROP POLICY IF EXISTS proyectos_select_auth ON proyectos;
DROP POLICY IF EXISTS proyectos_update_auth ON proyectos;

CREATE POLICY "Authenticated users can view proyectos"
  ON proyectos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update proyectos"
  ON proyectos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix storage policies for Documentos bucket
DROP POLICY IF EXISTS "Ver documentos" ON storage.objects;
DROP POLICY IF EXISTS "Subir documentos" ON storage.objects;
DROP POLICY IF EXISTS "Eliminar documentos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete" ON storage.objects;

CREATE POLICY "Authenticated users can view documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'Documentos');

CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'Documentos');

CREATE POLICY "Authenticated users can delete documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'Documentos');
