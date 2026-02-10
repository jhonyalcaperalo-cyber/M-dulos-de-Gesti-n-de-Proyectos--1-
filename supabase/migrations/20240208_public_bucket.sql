-- Hacer el bucket Documentos completamente público (para pruebas)

-- 1. Primero eliminar políticas existentes si hay conflictos
DROP POLICY IF EXISTS "Ver documentos" ON storage.objects;
DROP POLICY IF EXISTS "Subir documentos" ON storage.objects;
DROP POLICY IF EXISTS "Eliminar documentos" ON storage.objects;

-- 2. Crear políticas públicas para el bucket Documentos
CREATE POLICY "Anyone can view" ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'Documentos');

CREATE POLICY "Anyone can upload" ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'Documentos');

CREATE POLICY "Anyone can delete" ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'Documentos');
