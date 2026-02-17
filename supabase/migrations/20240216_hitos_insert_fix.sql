-- Primero eliminar todas las políticas existentes de hitos
DROP POLICY IF EXISTS "Public can view hitos" ON public.hitos;
DROP POLICY IF EXISTS "Auth users can insert hitos" ON public.hitos;
DROP POLICY IF EXISTS "Auth users can update hitos" ON public.hitos;

-- Crear políticas nuevas con WITH CHECK explícito
-- Cualquiera puede ver hitos
CREATE POLICY "Public can view hitos" ON public.hitos
  FOR SELECT TO anon USING (true);

CREATE POLICY "Public can view hitos auth" ON public.hitos
  FOR SELECT TO authenticated USING (true);

-- Usuarios autenticados pueden insertar hitos (con WITH CHECK)
CREATE POLICY "Auth users can insert hitos" ON public.hitos
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- Usuarios autenticados pueden actualizar hitos
CREATE POLICY "Auth users can update hitos" ON public.hitos
  FOR UPDATE TO authenticated 
  USING (true) 
  WITH CHECK (true);
