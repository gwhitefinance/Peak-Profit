import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const alpacaApiKey = Deno.env.get('ALPACA_API_KEY');
const alpacaSecretKey = Deno.env.get('ALPACA_SECRET_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Alpaca quotes function called');
  
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

    const { symbols } = await req.json();
    console.log('Quote symbols:', symbols);

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(JSON.stringify({ quotes: {} }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const credentials = btoa(`${alpacaApiKey}:${alpacaSecretKey}`);
    const symbolsParam = symbols.join(',');
    
    const response = await fetch(`https://data.alpaca.markets/v2/stocks/${symbolsParam}/quotes/latest`, {
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
    console.log('Alpaca quotes response:', data);
    
    const quotes: any = {};
    
    if (data.quotes) {
      for (const [symbol, quote] of Object.entries(data.quotes)) {
        const q = quote as any;
        quotes[symbol] = {
          symbol,
          bid: q.bid_price || 0,
          ask: q.ask_price || 0,
          lastPrice: (q.bid_price + q.ask_price) / 2 || 0,
          change: 0, // Will be calculated on frontend
          changePercent: 0, // Will be calculated on frontend
          volume: q.bid_size + q.ask_size || 0,
          timestamp: q.timeframe || new Date().toISOString()
        };
      }
    }

    return new Response(JSON.stringify({ quotes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in alpaca-quotes function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});