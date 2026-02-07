// Edge Function para crear payment links de Wompi
// Usa la PRIVATE_KEY (no la publiques en el frontend)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const WOMPI_API_URL = 'https://sandbox.wompi.co/v1';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { reference, amountInCents, currency, customerEmail, customerName, projectId, projectName } = body;

    // Validate required fields
    if (!reference || !amountInCents || !customerEmail || !customerName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener la private key desde secrets
    const privateKey = Deno.env.get('WOMPI_PRIVATE_KEY');
    if (!privateKey) {
      console.error('WOMPI_PRIVATE_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'WOMPI_PRIVATE_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get origin from request headers
    const origin = req.headers.get('origin') || 'https://czohkologyslzjkvcqbd.supabase.co';
    const webhookUrl = `${origin}/functions/v1/wompi-webhook`;
    const successUrl = `${origin}/?tab=gestion&payment_success=true&reference=${reference}`;

    console.log('Creating Wompi payment link:', { reference, amountInCents, currency, webhookUrl, successUrl });

    // Crear payment link en Wompi
    const response = await fetch(`${WOMPI_API_URL}/payment_links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${privateKey}`,
      },
      body: JSON.stringify({
        name: `Aporte a: ${projectName || 'Proyecto'}`,
        description: `Aporte para el proyecto ${projectName || ''}`,
        single_use: true,
        currency: currency || 'COP',
        amount_in_cents: amountInCents,
        reference: reference,
        webhook: webhookUrl,
        success_redirect_url: successUrl,
        expiration_time: 24,
        collect_shipping: false, // Required by Wompi - set to false for digital donations
        metadata: {
          projectId: projectId || '',
          projectName: projectName || '',
          customerEmail,
          customerName,
        },
      }),
    });

    const wompiResponse = await response.json();
    
    console.log('Wompi full response:', JSON.stringify(wompiResponse, null, 2));
    console.log('Wompi payment link data:', JSON.stringify(wompiResponse.data, null, 2));

    if (!response.ok) {
      console.error('Wompi API error:', wompiResponse);
      return new Response(
        JSON.stringify(wompiResponse),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Wompi payment link created:', wompiResponse.data);

    // Retornar el payment link
    return new Response(JSON.stringify(wompiResponse.data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating payment link:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
