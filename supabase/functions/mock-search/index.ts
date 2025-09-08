import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Mock search function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('Search query:', query);

    if (!query || query.length < 2) {
      return new Response(JSON.stringify({ stocks: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mock search results for testing
    const mockStocks = [
      { id: '1', symbol: 'AAPL', name: 'Apple Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '2', symbol: 'TSLA', name: 'Tesla Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '3', symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '4', symbol: 'GOOGL', name: 'Alphabet Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '5', symbol: 'AMZN', name: 'Amazon.com Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' }
    ];
    
    const filteredStocks = mockStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
      stock.name.toLowerCase().includes(query.toLowerCase())
    );

    console.log('Returning mock search results:', filteredStocks.length);

    return new Response(JSON.stringify({ stocks: filteredStocks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in mock search function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});