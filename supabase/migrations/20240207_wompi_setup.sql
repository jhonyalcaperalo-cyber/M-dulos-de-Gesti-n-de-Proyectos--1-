-- Migración para configurar la integración con Wompi

-- 1. Verificar que la función RPC existe
CREATE OR REPLACE FUNCTION incrementar_monto(proyecto_id UUID, monto NUMERIC)
RETURNS void AS $$
BEGIN
  UPDATE proyectos 
  SET monto_recaudado = COALESCE(monto_recaudado, 0) + monto
  WHERE id = proyecto_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Crear tabla de transacciones Wompi (si no existe)
CREATE TABLE IF NOT EXISTS wompi_transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL UNIQUE,
  reference TEXT NOT NULL,
  status TEXT NOT NULL,
  amount_in_cents BIGINT NOT NULL,
  payment_method_type TEXT,
  customer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE
);

-- 3. Habilitar RLS en wompi_transacciones si no está habilitado
ALTER TABLE wompi_transacciones ENABLE ROW LEVEL SECURITY;
