import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const alpacaApiKey = Deno.env.get('ALPACA_API_KEY');
const alpacaSecretKey = Deno.env.get('ALPACA_SECRET_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Alpaca search function called');
  
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

    const { query } = await req.json();
    console.log('Search query:', query);

    if (!query || query.length < 2) {
      return new Response(JSON.stringify({ stocks: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const credentials = btoa(`${alpacaApiKey}:${alpacaSecretKey}`);
    
    const response = await fetch(`https://paper-api.alpaca.markets/v2/assets?search=${encodeURIComponent(query)}&status=active&asset_class=us_equity`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Alpaca API error:', response.status, response.statusText);
      throw new Error(`Alpaca API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Alpaca search results count:', data.length);
    
    // Limit to first 50 results for performance
    const stocks = data.slice(0, 50).map((asset: any) => ({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      exchange: asset.exchange,
      asset_class: asset.asset_class,
      status: asset.status
    }));

    return new Response(JSON.stringify({ stocks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in alpaca-search function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});