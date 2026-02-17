-- Fix RLS for hitos table
-- Run this in Supabase SQL Editor

-- Allow anyone to view hitos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view hitos' AND tablename = 'hitos') THEN
    CREATE POLICY "Public can view hitos" ON public.hitos
      FOR SELECT TO anon USING (true);
  END IF;
END $$;

-- Allow authenticated users to insert hitos for their own projects
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Owner can insert hitos' AND tablename = 'hitos') THEN
    CREATE POLICY "Owner can insert hitos" ON public.hitos
      FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.proyectos
          WHERE proyectos.id = hitos.proyectoid
          AND proyectos.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Allow authenticated users to update hitos for their own projects
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Owner can update hitos' AND tablename = 'hitos') THEN
    CREATE POLICY "Owner can update hitos" ON public.hitos
      FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.proyectos
          WHERE proyectos.id = hitos.proyectoid
          AND proyectos.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.proyectos
          WHERE proyectos.id = hitos.proyectoid
          AND proyectos.user_id = auth.uid()
        )
      );
  END IF;
END $$;
