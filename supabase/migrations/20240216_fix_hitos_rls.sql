-- Eliminar políticas existentes de hitos
DROP POLICY IF EXISTS "Anyone can view hitos" ON public.hitos;
DROP POLICY IF EXISTS "Owner can insert hitos" ON public.hitos;
DROP POLICY IF EXISTS "Owner can update hitos" ON public.hitos;
DROP POLICY IF EXISTS "Users can view hitos" ON public.hitos;

-- Crear políticas permisivas para hitos
-- Cualquiera puede ver hitos
CREATE POLICY "Anyone can view hitos" ON public.hitos
  FOR SELECT TO anon USING (true);

-- Usuarios autenticados pueden insertar hitos
CREATE POLICY "Auth users can insert hitos" ON public.hitos
  FOR INSERT TO authenticated WITH CHECK (true);

-- Usuarios autenticados pueden actualizar hitos
CREATE POLICY "Auth users can update hitos" ON public.hitos
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
