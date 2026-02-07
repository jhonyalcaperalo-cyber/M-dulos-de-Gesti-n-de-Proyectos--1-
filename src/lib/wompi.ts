// Servicio de integración con Wompi
import type { WompiPaymentRequest, WompiTransaction, WompiCheckoutResponse } from '../types/wompi';

const WOMPI_API_URL = 'https://sandbox.wompi.co/v1';
const PUBLIC_KEY = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// URL de la Edge Function para crear payment links
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1`;

export function getWompiPublicKey(): string {
  return PUBLIC_KEY || '';
}

export function getWompiEnvironment(): string {
  return import.meta.env.VITE_WOMPI_ENVIRONMENT || 'sandbox';
}

export function isSandbox(): boolean {
  return getWompiEnvironment() === 'sandbox';
}

/**
 * Crear un enlace de pago usando la Edge Function
 */
export async function createPaymentLink(request: WompiPaymentRequest): Promise<WompiCheckoutResponse> {
  console.log('Creating payment link with request:', request);
  
  // Usar fetch directo con service role key
  const response = await fetch(`${EDGE_FUNCTION_URL}/wompi-create-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
    body: JSON.stringify(request),
  });

  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Error invoking Edge Function:', error);
    throw new Error(`Error al crear enlace de pago: ${error}`);
  }

  const data = await response.json();
  console.log('Payment link created:', data);
  return data;
}

/**
 * Consultar estado de una transacción
 */
export async function getTransactionStatus(transactionId: string): Promise<WompiTransaction> {
  const response = await fetch(`${WOMPI_API_URL}/transactions/${transactionId}`, {
    headers: {
      'Authorization': `Bearer ${PUBLIC_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al consultar transacción');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Formatear monto para mostrar
 */
export function formatAmount(amountInCents: number, currency: string = 'COP'): string {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Generar referencia única para la transacción
 */
export function generateReference(prefix: string = 'APORTE'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`.toUpperCase();
}

/**
 * Validar que el email sea correcto
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calcular comisiones de Wompi (aproximado)
 * PSE: 2.99% + COP$800
 * Tarjeta Crédito: 3.49% + COP$800
 * Nequi: 2.99% + COP$800
 */
export function estimateFees(amountInCents: number, method: 'PSE' | 'CARD' | 'NEQUI'): {
  fee: number;
  netAmount: number;
} {
  const percentageFee = method === 'CARD' ? 0.0349 : 0.0299;
  const fixedFee = 80000; // COP en centavos

  const fee = Math.round(amountInCents * percentageFee + fixedFee);
  const netAmount = amountInCents - fee;

  return {
    fee,
    netAmount,
  };
}
