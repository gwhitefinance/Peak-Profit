import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const polygonApiKey = Deno.env.get('POLYGON_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, from, to, resolution } = await req.json();

    if (!polygonApiKey) {
      throw new Error('Polygon API key not configured');
    }
    if (!symbol || !from || !to || !resolution) {
      throw new Error('Missing required parameters for history fetch');
    }

    // Map TradingView resolution to Polygon API timespan
    let timespan = 'minute';
    let multiplier = 1;

    if (resolution.endsWith('S')) {
      timespan = 'second';
      multiplier = parseInt(resolution.slice(0, -1), 10);
    } else if (!isNaN(parseInt(resolution, 10))) {
      timespan = 'minute';
      multiplier = parseInt(resolution, 10);
    } else if (resolution === '1D') {
      timespan = 'day';
      multiplier = 1;
    } else if (resolution === '1W') {
        timespan = 'week';
        multiplier = 1;
    } else if (resolution === '1M') {
        timespan = 'month';
        multiplier = 1;
    }

    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=5000&apiKey=${polygonApiKey}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Polygon History API Error:', errorText);
      throw new Error(`Failed to fetch historical data from Polygon: ${response.statusText}`);
    }
    
    const data = await response.json();

    const bars = (data.results || []).map((bar: any) => ({
      time: bar.t,
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
    }));
    
    return new Response(JSON.stringify(bars), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in polygon-history function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});