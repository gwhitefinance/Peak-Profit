import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const alpacaApiKey = Deno.env.get('ALPACA_API_KEY');
const alpacaSecretKey = Deno.env.get('ALPACA_SECRET_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Alpaca order function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!alpacaApiKey || !alpacaSecretKey) {
      console.error('Missing Alpaca API credentials');
      return new Response(JSON.stringify({ error: 'Alpaca API credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { symbol, qty, side, type = 'market', time_in_force = 'day', limit_price, stop_price } = await req.json();
    console.log('Order details:', { symbol, qty, side, type });

    if (!symbol || !qty || !side) {
      return new Response(JSON.stringify({ error: 'Missing required order parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const credentials = btoa(`${alpacaApiKey}:${alpacaSecretKey}`);
    
    const orderData: any = {
      symbol,
      qty,
      side,
      type,
      time_in_force
    };

    if (type === 'limit' && limit_price) {
      orderData.limit_price = limit_price;
    }

    if (type === 'stop' && stop_price) {
      orderData.stop_price = stop_price;
    }

    const response = await fetch('https://paper-api.alpaca.markets/v2/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Alpaca order API error:', response.status, errorText);
      throw new Error(`Order failed: ${response.status} - ${errorText}`);
    }

    const order = await response.json();
    console.log('Order placed successfully:', order.id);

    return new Response(JSON.stringify({ 
      success: true, 
      order: {
        id: order.id,
        symbol: order.symbol,
        qty: order.qty,
        side: order.side,
        type: order.type,
        status: order.status,
        created_at: order.created_at
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in alpaca-order function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});