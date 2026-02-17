// Edge Function para crear payment links de Wompi
// Requiere: WOMPI_PRIVATE_KEY y FRONTEND_URL en secrets de Supabase
// Documentación: https://docs.wompi.co/docs/enlaces-de-pago

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const WOMPI_API_URL = 'https://production.wompi.co/v1';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CustomerReference {
  label: string;
  is_required: boolean;
}

interface TaxInfo {
  type: 'VAT' | 'CONSUMPTION';
  amount_in_cents?: number;
  percentage?: number;
}

interface PaymentLinkRequest {
  reference: string;
  amountInCents?: number;
  currency?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  customerDocument?: string;
  customerDocumentType?: string;
  projectId?: string;
  projectName?: string;
  singleUse?: boolean;
  expiresAt?: string;
  redirectUrl?: string;
  imageUrl?: string;
  sku?: string;
  collectShipping?: boolean;
  customerReferences?: CustomerReference[];
  taxes?: TaxInfo[];
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      reference,
      amountInCents,
      currency,
      customerEmail,
      customerName,
      customerPhone,
      customerDocument,
      customerDocumentType,
      projectId,
      projectName,
      singleUse,
      expiresAt,
      redirectUrl,
      imageUrl,
      sku,
      collectShipping,
      customerReferences,
      taxes,
    } = body as PaymentLinkRequest;

    // Validar campos requeridos según documentación de Wompi
    if (!reference) {
      return new Response(
        JSON.stringify({ error: 'Falta el campo requerido: reference' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar monto mínimo si se especifica (Wompi sandbox: mínimo 1000 centavos = 10 COP)
    if (amountInCents !== undefined && amountInCents < 1000) {
      return new Response(
        JSON.stringify({ error: 'El monto mínimo es 1000 centavos (10 COP)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar customerReferences (máximo 2 según documentación)
    if (customerReferences && customerReferences.length > 2) {
      return new Response(
        JSON.stringify({ error: 'Máximo 2 campos personalizados permitidos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener secrets desde variables de entorno
    const privateKey = Deno.env.get('WOMPI_PRIVATE_KEY');
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'http://localhost:5173';

    if (!privateKey) {
      return new Response(
        JSON.stringify({ error: 'WOMPI_PRIVATE_KEY no configurada en Supabase' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // URL para redirect
    const successUrl = redirectUrl || `${frontendUrl}/?payment_success=true&reference=${reference}`;

    // Construir objeto customer_data si hay customerReferences
    const customerData = customerReferences ? {
      customer_references: customerReferences,
    } : undefined;

    // Construir cuerpo de la petición según documentación de Wompi
    const paymentLinkBody: Record<string, unknown> = {
      name: projectName ? `Aporte: ${projectName}` : 'Aporte a proyecto',
      description: projectName ? `Aporte para "${projectName}"` : 'Aporte a proyecto',
      single_use: singleUse ?? true,
      collect_shipping: collectShipping ?? false,
      currency: currency || 'COP',
    };

    // Agregar campos opcionales
    if (amountInCents !== undefined) {
      paymentLinkBody.amount_in_cents = amountInCents;
    }

    if (expiresAt) {
      paymentLinkBody.expires_at = expiresAt;
    }

    if (redirectUrl) {
      paymentLinkBody.redirect_url = redirectUrl;
    }

    if (imageUrl) {
      paymentLinkBody.image_url = imageUrl;
    }

    if (sku) {
      paymentLinkBody.sku = sku;
    }

    if (customerData) {
      paymentLinkBody.customer_data = customerData;
    }

    if (taxes && taxes.length > 0) {
      paymentLinkBody.taxes = taxes;
    }

    // Agregar metadata
    paymentLinkBody.reference = reference;
    paymentLinkBody.metadata = {
      projectId: projectId || '',
      projectName: projectName || '',
      customerEmail: customerEmail || '',
      customerName: customerName || '',
      customerPhone: customerPhone || '',
      customerDocument: customerDocument || '',
      customerDocumentType: customerDocumentType || '',
    };

    // Crear payment link en Wompi
    const response = await fetch(`${WOMPI_API_URL}/payment_links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${privateKey}`,
      },
      body: JSON.stringify(paymentLinkBody),
    });

    const wompiResponse = await response.json();
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Error de Wompi', details: wompiResponse }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Retornar datos del payment link
    return new Response(JSON.stringify({
      id: wompiResponse.data?.id,
      reference: reference,
      redirect_url: wompiResponse.data?.redirect_url,
      amount_in_cents: amountInCents,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error interno', message: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
