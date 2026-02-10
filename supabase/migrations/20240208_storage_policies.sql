-- Políticas RLS para el bucket Documentos

-- 1. Política para ver archivos (autenticados)
CREATE POLICY "Ver documentos" ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'Documentos');

-- 2. Política para subir archivos (autenticados)
CREATE POLICY "Subir documentos" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'Documentos');

-- 3. Política para eliminar archivos (autenticados)
CREATE POLICY "Eliminar documentos" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'Documentos');
