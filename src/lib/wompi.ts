// Servicio de integración con Wompi
// Documentación: https://docs.wompi.co/docs/enlaces-de-pago
import { supabase } from './supabase';
import type {
  WompiPaymentRequest,
  WompiTransaction,
  WompiCheckoutResponse,
  CustomerReference,
  TaxInfo,
} from '../types/wompi';

const WOMPI_API_URL = 'https://production.wompi.co/v1';
const PUBLIC_KEY = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

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
 * Obtener URL del checkout de Wompi
 */
export function getPaymentLinkUrl(paymentLinkId: string): string {
  return `https://checkout.wompi.co/l/${paymentLinkId}`;
}

/**
 * Crear un enlace de pago usando la Edge Function
 */
export async function createPaymentLink(request: WompiPaymentRequest): Promise<WompiCheckoutResponse> {
  console.log('Creating payment link with request:', request);
  
  // Usar service role key para la Edge Function
  const authToken = SUPABASE_SERVICE_KEY;
  
  const response = await fetch(`${EDGE_FUNCTION_URL}/wompi-create-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'apikey': authToken,
    },
    body: JSON.stringify(request),
  });

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
 * Crear link de pago con monto fijo
 */
export async function createFixedAmountPaymentLink(
  reference: string,
  amountInCents: number,
  projectName: string,
  options?: {
    customerEmail?: string;
    customerName?: string;
    expiresAt?: string;
    customerReferences?: CustomerReference[];
    taxes?: TaxInfo[];
  }
): Promise<WompiCheckoutResponse> {
  return createPaymentLink({
    reference,
    amountInCents,
    currency: 'COP',
    projectName,
    singleUse: true,
    ...options,
  });
}

/**
 * Crear link de pago con monto abierto (cliente elige el monto)
 */
export async function createOpenAmountPaymentLink(
  reference: string,
  projectName: string,
  options?: {
    customerEmail?: string;
    customerName?: string;
    expiresAt?: string;
    customerReferences?: CustomerReference[];
    taxes?: TaxInfo[];
  }
): Promise<WompiCheckoutResponse> {
  return createPaymentLink({
    reference,
    projectName,
    singleUse: false,
    ...options,
  });
}

/**
 * Crear link de pago con campos personalizados
 */
export async function createPaymentLinkWithCustomFields(
  reference: string,
  amountInCents: number | undefined,
  projectName: string,
  customFields: CustomerReference[],
  options?: {
    customerEmail?: string;
    customerName?: string;
    expiresAt?: string;
    taxes?: TaxInfo[];
  }
): Promise<WompiCheckoutResponse> {
  return createPaymentLink({
    reference,
    amountInCents,
    currency: 'COP',
    projectName,
    singleUse: true,
    customerReferences: customFields,
    ...options,
  });
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

/**
 * Calcular IVA (VAT) - Colombia 19%
 */
export function calculateVAT(amountInCents: number, rate: number = 0.19): number {
  return Math.round(amountInCents * rate);
}

/**
 * Crear configuración de impuestos para monto fijo
 */
export function createFixedTax(taxType: 'VAT' | 'CONSUMPTION', amountInCents: number): TaxInfo {
  return {
    type: taxType,
    amount_in_cents: amountInCents,
  };
}

/**
 * Crear configuración de impuestos para monto abierto (porcentage)
 */
export function createPercentageTax(taxType: 'VAT' | 'CONSUMPTION', percentage: number): TaxInfo {
  return {
    type: taxType,
    percentage: percentage,
  };
}

/**
 * Crear campo personalizado para el formulario de pago
 */
export function createCustomerReference(label: string, isRequired: boolean = true): CustomerReference {
  return {
    label: label.substring(0, 24), // Máximo 24 caracteres
    is_required: isRequired,
  };
}
