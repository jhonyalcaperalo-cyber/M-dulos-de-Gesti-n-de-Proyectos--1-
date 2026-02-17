-- Migration para configurar documentos y storage

-- 1. Crear tabla de documentos
CREATE TABLE IF NOT EXISTS public.documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyectoid UUID NOT NULL REFERENCES public.proyectos(id) ON DELETE CASCADE,
  hitoid UUID REFERENCES public.hitos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,
  url TEXT NOT NULL,
  fechasubida TEXT DEFAULT to_char(now(), 'DD/MM/YYYY'::text),
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS en documentos
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;

-- 3. Políticas para la tabla documentos
CREATE POLICY documentos_select_auth ON public.documentos
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY documentos_insert_auth ON public.documentos
  FOR INSERT TO authenticated
  WITH CHECK (true);
