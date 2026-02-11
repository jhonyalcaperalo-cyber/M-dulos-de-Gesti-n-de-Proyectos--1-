-- Migration completa: crear tabla documentos y hacer bucket público

-- 1. Crear tabla de documentos
CREATE TABLE IF NOT EXISTS documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  url TEXT NOT NULL,
  tipo TEXT NOT NULL,
  hito_id UUID REFERENCES hitos(id) ON DELETE CASCADE,
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  fechasubida TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS en documentos
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- 3. Políticas para la tabla documentos
CREATE POLICY documentos_select ON documentos FOR SELECT TO anon USING (true);
CREATE POLICY documentos_insert ON documentos FOR INSERT TO anon WITH CHECK (true);

-- 4. Políticas públicas para el bucket Documentos
DROP POLICY IF EXISTS "Ver documentos" ON storage.objects;
DROP POLICY IF EXISTS "Subir documentos" ON storage.objects;
DROP POLICY IF EXISTS "Eliminar documentos" ON storage.objects;

CREATE POLICY "Anyone can view" ON storage.objects
FOR SELECT TO anon USING (bucket_id = 'Documentos');

CREATE POLICY "Anyone can upload" ON storage.objects
FOR INSERT TO anon WITH CHECK (bucket_id = 'Documentos');

CREATE POLICY "Anyone can delete" ON storage.objects
FOR DELETE TO anon USING (bucket_id = 'Documentos');
