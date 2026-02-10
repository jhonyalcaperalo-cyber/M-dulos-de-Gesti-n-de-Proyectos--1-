// Tipos para la integración con Wompi - Payment Links
// Basado en documentación: https://docs.wompi.co/docs/enlaces-de-pago

export type WompiCurrency = 'COP' | 'USD';
export type WompiStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'VOIDED';
export type WompiPaymentMethod = 'PSE' | 'CARD' | 'NEQUI' | 'BANK_TRANSFER';
export type TaxType = 'VAT' | 'CONSUMPTION';

export interface WompiTransaction {
  id: string;
  created_at: string;
  status: WompiStatus;
  amount_in_cents: number;
  reference: string;
  payment_method_type: WompiPaymentMethod;
  payment_method: {
    type: WompiPaymentMethod;
    extra?: {
      email?: string;
      last_four_digits?: string;
      payment_description?: string;
    };
  };
  customer_email?: string;
  currency: WompiCurrency;
}

// Campos personalizados para收集 información del cliente
export interface CustomerReference {
  label: string;  // Máximo 24 caracteres
  is_required: boolean;
}

export interface CustomerData {
  customer_references: CustomerReference[];  // Máximo 2 referencias
}

// Información de impuestos
export interface TaxInfo {
  type: TaxType;
  amount_in_cents?: number;  // Para monto fijo
  percentage?: number;      // Para monto abierto
}

// Request para crear payment link
export interface WompiPaymentRequest {
  reference: string;
  amountInCents?: number;  // Si no se especifica, es monto abierto
  currency?: WompiCurrency;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  customerDocument?: string;
  customerDocumentType?: 'CC' | 'CE' | 'NIT' | 'PP' | 'TI';
  projectId?: string;
  projectName?: string;
  singleUse?: boolean;      // false = múltiples usos, true = uso único
  expiresAt?: string;       // ISO 8601 UTC format
  redirectUrl?: string;
  imageUrl?: string;
  sku?: string;             // Máximo 36 caracteres
  collectShipping?: boolean;
  customerReferences?: CustomerReference[];  // Máximo 2 campos personalizados
  taxes?: TaxInfo[];
}

// Respuesta del payment link (del campo data en la respuesta de Wompi)
export interface WompiPaymentLink {
  id: string;
  name: string;
  description: string;
  single_use: boolean;
  collect_shipping: boolean;
  currency: WompiCurrency;
  amount_in_cents: number | null;
  sku: string | null;
  expires_at: string | null;
  redirect_url: string | null;
  image_url: string | null;
  active: boolean;
  customer_data: CustomerData;
  created_at: string;
  updated_at: string;
  merchant_public_key: string;
}

// Respuesta de la Edge Function
export interface WompiCheckoutResponse {
  id: string;
  reference: string;
  redirect_url: string;
  name?: string;
  description?: string;
  single_use?: boolean;
  currency?: string;
  amount_in_cents?: number;
  expires_at?: string;
  test_mode?: boolean;
  created_at?: string;
}

// Ejemplos de uso según documentación de Wompi
// Ejemplo 1: Link con monto abierto (mínimos campos)
export const EXAMPLE_OPEN_AMOUNT = {
  name: 'Pago de arriendo edificio Lombardía - AP 505',
  description: 'Arriendo mensual',
  single_use: false,
  collect_shipping: false,
};

// Ejemplo 2: Link con monto fijo
export const EXAMPLE_FIXED_AMOUNT = {
  name: 'Pago de arriendo edificio Lombardía - AP 505',
  description: 'Arriendo mensual',
  single_use: false,
  collect_shipping: false,
  currency: 'COP',
  amount_in_cents: 500000,  // 5000 COP
};

// Ejemplo 3: Link con fecha de expiración
export const EXAMPLE_WITH_EXPIRY = {
  name: 'Pago de arriendo edificio Lombardía - AP 505',
  description: 'Arriendo mensual',
  single_use: false,
  collect_shipping: false,
  expires_at: '2040-12-10T14:30:00',  // ISO 8601 UTC
};

// Ejemplo 4: Link con campos personalizados
export const EXAMPLE_WITH_CUSTOM_FIELDS = {
  name: 'Pago de arriendo edificio Lombardía - AP 505',
  description: 'Arriendo mensual',
  single_use: false,
  collect_shipping: false,
  customer_data: {
    customer_references: [
      { label: 'Número de Apartamento', is_required: true },
      { label: 'Documento de identidad', is_required: true },
    ],
  },
};

// Ejemplo 5: Link con monto fijo e impuestos
export const EXAMPLE_WITH_TAXES_FIXED = {
  name: 'Pago de arriendo edificio Lombardía - AP 505',
  description: 'Arriendo mensual',
  single_use: false,
  collect_shipping: false,
  amount_in_cents: 2000,  // 20 COP
  currency: 'COP',
  taxes: [
    { type: 'VAT', amount_in_cents: 120000 },  // IVA incluido
  ],
};

// Ejemplo 6: Link con monto abierto e impuestos
export const EXAMPLE_WITH_TAXES_OPEN = {
  name: 'Pago de arriendo edificio Lombardía - AP 505',
  description: 'Arriendo mensual',
  single_use: false,
  collect_shipping: false,
  taxes: [
    { type: 'VAT', percentage: 19 },  // 19% de IVA
  ],
};
