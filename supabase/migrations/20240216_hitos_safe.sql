-- Safe RLS fix for hitos table
-- This only adds missing policies without removing existing ones

-- First, check current policies
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'hitos';
