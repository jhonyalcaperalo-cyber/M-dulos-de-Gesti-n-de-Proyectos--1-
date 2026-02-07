// Tipos para la integración con Wompi

export type WompiCurrency = 'COP' | 'USD';
export type WompiStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'VOIDED';
export type WompiPaymentMethod = 'PSE' | 'CARD' | 'NEQUI' | 'BANK_TRANSFER';

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

export interface WompiPaymentRequest {
  reference: string;
  amountInCents: number;
  currency: WompiCurrency;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  customerDocument?: string;
  customerDocumentType?: 'CC' | 'CE' | 'NIT' | 'PP' | 'TI';
  projectId: string;
  projectName: string;
}

// Esta es la respuesta directa de la Edge Function (wompiResponse.data)
export interface WompiCheckoutResponse {
  id: string;
  created_at: string;
  after_expiry_date: string;
  reference: string;
  redirect_url: string;
  name?: string;
  description?: string;
  single_use?: boolean;
  currency?: string;
  amount_in_cents?: number;
  expires_at?: string;
  test_mode?: boolean;
}
