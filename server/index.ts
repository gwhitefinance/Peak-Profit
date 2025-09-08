import express from 'express';
import cors from 'cors';
import { db } from './db';
import path from 'path';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// Mock search endpoint (replaces Supabase function)
app.post('/api/mock-search', async (req, res) => {
  const { query } = req.body;
  
  if (!query || query.length < 2) {
    return res.json({ stocks: [] });
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

  res.json({ stocks: filteredStocks });
});

// Mock quotes endpoint
app.post('/api/mock-quotes', async (req, res) => {
  const { symbols } = req.body;

  if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
    return res.json({ quotes: {} });
  }

  const quotes: any = {};
  
  symbols.forEach((symbol: string) => {
    quotes[symbol] = {
      symbol,
      bid: 150.00 + Math.random() * 10,
      ask: 150.50 + Math.random() * 10,
      lastPrice: 150.25 + Math.random() * 10,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 3,
      volume: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString()
    };
  });

  res.json({ quotes });
});

// Alpaca search endpoint
app.post('/api/alpaca-search', async (req, res) => {
  try {
    const alpacaApiKey = process.env.ALPACA_API_KEY;
    const alpacaSecretKey = process.env.ALPACA_SECRET_KEY;
    
    if (!alpacaApiKey || !alpacaSecretKey) {
      return res.status(500).json({ error: 'Alpaca API credentials not configured' });
    }

    const { query } = req.body;

    if (!query || query.length < 2) {
      return res.json({ stocks: [] });
    }

    const credentials = Buffer.from(`${alpacaApiKey}:${alpacaSecretKey}`).toString('base64');
    
    const response = await fetch(`https://paper-api.alpaca.markets/v2/assets?search=${encodeURIComponent(query)}&status=active&asset_class=us_equity`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Alpaca API error: ${response.status}`);
    }

    const data = await response.json();
    
    const stocks = data.slice(0, 50).map((asset: any) => ({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      exchange: asset.exchange,
      asset_class: asset.asset_class,
      status: asset.status
    }));

    res.json({ stocks });
  } catch (error) {
    console.error('Error in alpaca-search:', error);
    res.status(500).json({ error: 'Failed to search assets' });
  }
});

// Alpaca quotes endpoint
app.post('/api/alpaca-quotes', async (req, res) => {
  try {
    const alpacaApiKey = process.env.ALPACA_API_KEY;
    const alpacaSecretKey = process.env.ALPACA_SECRET_KEY;
    
    if (!alpacaApiKey || !alpacaSecretKey) {
      return res.status(500).json({ error: 'Alpaca API credentials not configured' });
    }

    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.json({ quotes: {} });
    }

    const credentials = Buffer.from(`${alpacaApiKey}:${alpacaSecretKey}`).toString('base64');
    const symbolsParam = symbols.join(',');
    
    const response = await fetch(`https://data.alpaca.markets/v2/stocks/${symbolsParam}/quotes/latest`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Alpaca API error: ${response.status}`);
    }

    const data = await response.json();
    const quotes: any = {};
    
    if (data.quotes) {
      for (const [symbol, quote] of Object.entries(data.quotes)) {
        const q = quote as any;
        quotes[symbol] = {
          symbol,
          bid: q.bid_price || 0,
          ask: q.ask_price || 0,
          lastPrice: (q.bid_price + q.ask_price) / 2 || 0,
          change: 0,
          changePercent: 0,
          volume: q.bid_size + q.ask_size || 0,
          timestamp: q.timeframe || new Date().toISOString()
        };
      }
    }

    res.json({ quotes });
  } catch (error) {
    console.error('Error in alpaca-quotes:', error);
    res.status(500).json({ error: 'Failed to get quotes' });
  }
});

// Alpaca order endpoint
app.post('/api/alpaca-order', async (req, res) => {
  try {
    const alpacaApiKey = process.env.ALPACA_API_KEY;
    const alpacaSecretKey = process.env.ALPACA_SECRET_KEY;
    
    if (!alpacaApiKey || !alpacaSecretKey) {
      return res.status(500).json({ error: 'Alpaca API credentials not configured' });
    }

    const { symbol, qty, side, type = 'market', time_in_force = 'day', limit_price, stop_price } = req.body;

    if (!symbol || !qty || !side) {
      return res.status(400).json({ error: 'Missing required order parameters' });
    }

    const credentials = Buffer.from(`${alpacaApiKey}:${alpacaSecretKey}`).toString('base64');
    
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
      throw new Error(`Order failed: ${response.status} - ${errorText}`);
    }

    const order = await response.json();

    res.json({ 
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
    });
  } catch (error) {
    console.error('Error in alpaca-order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Polygon history endpoint
app.post('/api/polygon-history', async (req, res) => {
  try {
    const polygonApiKey = process.env.POLYGON_API_KEY;

    if (!polygonApiKey) {
      return res.status(500).json({ error: 'Polygon API key not configured' });
    }

    const { symbol, from, to, resolution } = req.body;

    if (!symbol || !from || !to || !resolution) {
      return res.status(400).json({ error: 'Missing required parameters for history fetch' });
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
    
    res.json(bars);
  } catch (error) {
    console.error('Error in polygon-history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get polygon credentials (for client-side usage)
app.get('/api/get-polygon-credentials', async (req, res) => {
  try {
    const polygonApiKey = process.env.POLYGON_API_KEY;

    if (!polygonApiKey) {
      console.error('POLYGON_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'Polygon API credentials not configured' });
    }

    res.json({ apiKey: polygonApiKey });
  } catch (error) {
    console.error('Error in get-polygon-credentials:', error);
    res.status(500).json({ error: 'Failed to get credentials' });
  }
});

// Serve static files from the dist directory
app.use(express.static('dist'));

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});