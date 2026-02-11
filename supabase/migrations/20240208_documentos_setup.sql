-- Migration para configurar documentos y storage

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
CREATE POLICY documentos_select_auth ON documentos
FOR SELECT TO authenticated
USING (true);

CREATE POLICY documentos_insert_auth ON documentos
FOR INSERT TO authenticated
WITH CHECK (true);
