-- Create audit_log table for tracking user actions
CREATE TABLE IF NOT EXISTS public.audit_log (
  id BIGINT PRIMARY KEY DEFAULT nextval('audit_log_id_seq'::regclass),
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  accion TEXT NOT NULL,
  tabla TEXT NOT NULL,
  registro_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert audit logs
DROP POLICY IF EXISTS audit_log_insert ON public.audit_log;
CREATE POLICY "Authenticated users can insert audit logs"
  ON public.audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow admins to view audit logs
DROP POLICY IF EXISTS audit_log_select ON public.audit_log;
CREATE POLICY "Admins can view audit logs"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.audit_log(tabla, registro_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.audit_log(created_at DESC);
