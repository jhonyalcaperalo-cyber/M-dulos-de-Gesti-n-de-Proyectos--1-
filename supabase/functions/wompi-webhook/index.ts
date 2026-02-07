// Edge Function para recibir webhooks de Wompi
// Deploy con: supabase functions deploy wompi-webhook

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const eventsSecret = Deno.env.get('WOMPI_EVENTS_SECRET')!;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, Wompi-Signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface WompiEvent {
  name: string;
  data: {
    transaction: {
      id: string;
      reference: string;
      status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'VOIDED';
      amount_in_cents: number;
      payment_method_type: string;
    };
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Verificar método
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  // Verificar firma del webhook
  const signature = req.headers.get('Wompi-Signature');
  if (!signature) {
    console.error('Missing Wompi-Signature header');
    return new Response('Missing signature', { status: 401, headers: corsHeaders });
  }

  const body = await req.text();
  
  // Verificar firma (simplificado - en producción usar crypto)
  const expectedSignature = eventsSecret;
  if (signature !== expectedSignature) {
    console.error('Invalid signature');
    return new Response('Invalid signature', { status: 401, headers: corsHeaders });
  }

  try {
    const event: WompiEvent = JSON.parse(body);
    console.log('Received Wompi event:', event.name);

    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (event.name === 'transaction.updated') {
      const transaction = event.data.transaction;
      const reference = transaction.reference;
      const newStatus = transaction.status === 'APPROVED' ? 'aprobado' : 
                       transaction.status === 'DECLINED' ? 'rechazado' : 'pendiente';

      console.log(`Updating transaction ${reference} to status ${newStatus}`);

      // Actualizar el aporte
      const { error } = await supabase
        .from('aportes')
        .update({ 
          estado: newStatus,
          transaccionesWompiId: transaction.id 
        })
        .eq('id', reference);

      if (error) {
        console.error('Error updating aporte:', error);
        return new Response('Error updating database', { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Si fue aprobado, actualizar el monto del proyecto
      if (transaction.status === 'APPROVED') {
        // Obtener el aporte para saber el proyecto
        const { data: aporte } = await supabase
          .from('aportes')
          .select('proyectoId, monto')
          .eq('id', reference)
          .single();

        if (aporte) {
          // Usar RPC para incrementar el monto
          const { error: rpcError } = await supabase.rpc('incrementar_monto', {
            proyecto_id: aporte.proyectoId,
            monto: transaction.amount_in_cents / 100 // Convertir de centavos a pesos
          });

          if (rpcError) {
            console.error('Error incrementando monto:', rpcError);
          }
        }
      }
    }

    return new Response('OK', { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
