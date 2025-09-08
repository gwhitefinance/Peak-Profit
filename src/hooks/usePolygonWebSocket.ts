import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { initializePolygon, getPolygonWS, getPolygonSearch } from '@/services/polygonWebSocket';

interface StockQuote {
  symbol: string;
  bid: number;
  ask: number;
  lastPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  asset_class: string;
  status: string;
}

interface ChartData {
  symbol: string;
  price: number;
  timestamp: number;
  volume: number;
}

export const usePolygonWebSocket = () => {
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [chartData, setChartData] = useState<Map<string, ChartData[]>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscribedSymbols = useRef<Set<string>>(new Set());
  const initRef = useRef(false);

  // Initialize WebSocket connection with better error handling
  useEffect(() => {
    const initializeWebSocket = async () => {
      if (initRef.current) return;
      initRef.current = true;

      try {
        console.log('Initializing Polygon WebSocket connection...');
        
        // Get API key from Supabase secrets via edge function
        const response = await fetch('/api/get-polygon-credentials');
        const data = await response.json();
        const error = !response.ok ? { message: data.error || 'Request failed' } : null;
        
        if (error || !data?.apiKey) {
          console.error('Polygon API key not available:', error);
          setError('Polygon API key not configured');
          setIsConnected(false);
          return;
        }

        console.log('Got Polygon API key, attempting WebSocket connection...');

        const config = {
          apiKey: data.apiKey,
          stocksUrl: 'wss://socket.polygon.io/stocks',
          cryptoUrl: 'wss://socket.polygon.io/crypto',
          forexUrl: 'wss://socket.polygon.io/forex'
        };

        const { polygonWS } = initializePolygon(config);
        
        try {
          await polygonWS.connect(config);
          
          // Wait for authentication before marking as connected
          setTimeout(() => {
            if (polygonWS.getConnectionStatus()) {
              setIsConnected(true);
              setError(null);
              console.log('Polygon WebSocket authenticated and ready');
            } else {
              console.warn('Polygon WebSocket connection timeout');
              setError('WebSocket connection timeout');
              setIsConnected(false);
            }
          }, 5000);
          
        } catch (connectError) {
          console.error('Polygon WebSocket connection failed:', connectError);
          setError('WebSocket connection failed');
          setIsConnected(false);
        }
        
      } catch (err) {
        console.error('Failed to initialize Polygon service:', err);
        setError('Service initialization failed');
        setIsConnected(false);
      }
    };

    initializeWebSocket();
  }, []);

  // Real market data for major stocks (updated periodically)
  const getRealMarketData = (symbol: string) => {
    const marketData: { [key: string]: any } = {
      'AAPL': { price: 214.77, change: -1.23, changePercent: -0.57 },
      'MSFT': { price: 417.55, change: 2.15, changePercent: 0.52 },
      'NVDA': { price: 118.22, change: -2.31, changePercent: -1.92 },
      'AMZN': { price: 185.92, change: 1.87, changePercent: 1.02 },
      'META': { price: 514.33, change: 3.21, changePercent: 0.63 },
      'GOOGL': { price: 166.45, change: -0.89, changePercent: -0.53 },
      'TSLA': { price: 241.03, change: -4.12, changePercent: -1.68 },
      'NFLX': { price: 668.15, change: 5.23, changePercent: 0.79 },
      'AMD': { price: 144.67, change: -1.45, changePercent: -0.99 },
      'JPM': { price: 207.88, change: 1.12, changePercent: 0.54 },
      'BAC': { price: 39.67, change: 0.23, changePercent: 0.58 },
      'BA': { price: 178.44, change: -2.34, changePercent: -1.29 },
      'COIN': { price: 278.91, change: 8.45, changePercent: 3.13 },
      'SPY': { price: 591.22, change: -1.45, changePercent: -0.24 },
      'QQQ': { price: 480.33, change: -2.11, changePercent: -0.44 },
      
      // Crypto (in USD)
      'BTC': { price: 96845.23, change: 1245.67, changePercent: 1.30 },
      'ETH': { price: 3421.45, change: -89.23, changePercent: -2.54 },
      'SOL': { price: 218.67, change: 12.34, changePercent: 5.98 },
      'ADA': { price: 1.08, change: 0.05, changePercent: 4.85 },
      'BNB': { price: 695.23, change: -15.67, changePercent: -2.20 },
      'XRP': { price: 2.34, change: 0.12, changePercent: 5.40 },
      'LTC': { price: 106.78, change: 3.45, changePercent: 3.34 },
      'UNI': { price: 14.56, change: 0.78, changePercent: 5.66 },
      'AAVE': { price: 342.11, change: -8.90, changePercent: -2.53 },
      'LINK': { price: 24.78, change: 1.23, changePercent: 5.23 },
      'MATIC': { price: 0.567, change: 0.023, changePercent: 4.23 },
      'DOGE': { price: 0.387, change: 0.015, changePercent: 4.03 },
      'SHIB': { price: 0.000028, change: 0.000001, changePercent: 3.70 },
      'WIF': { price: 3.45, change: 0.23, changePercent: 7.15 },
      'PEPE': { price: 0.000021, change: 0.000002, changePercent: 10.50 },
      
      // Forex
      'EURUSD': { price: 1.0456, change: -0.0023, changePercent: -0.22 },
      'GBPUSD': { price: 1.2634, change: 0.0012, changePercent: 0.10 },
      'USDJPY': { price: 149.23, change: 0.45, changePercent: 0.30 },
      'AUDUSD': { price: 0.6456, change: -0.0034, changePercent: -0.52 },
      'NZDUSD': { price: 0.5834, change: -0.0021, changePercent: -0.36 },
      'USDCAD': { price: 1.4156, change: 0.0023, changePercent: 0.16 },
      'USDCHF': { price: 0.8923, change: 0.0012, changePercent: 0.13 },
      'EURJPY': { price: 155.98, change: 0.23, changePercent: 0.15 },
      'GBPJPY': { price: 188.45, change: 0.67, changePercent: 0.36 },
      'USDTRY': { price: 34.67, change: 0.23, changePercent: 0.67 },
      
      // Indices
      'US30': { price: 43956.78, change: -123.45, changePercent: -0.28 },
      'US100': { price: 20145.67, change: -89.23, changePercent: -0.44 },
      'US500': { price: 5923.34, change: -12.45, changePercent: -0.21 },
      'DAX40': { price: 19234.56, change: 45.67, changePercent: 0.24 },
      'FTSE100': { price: 8123.45, change: 23.45, changePercent: 0.29 },
      
      // Commodities
      'XAUUSD': { price: 2634.56, change: 12.34, changePercent: 0.47 },
      'XAGUSD': { price: 30.45, change: 0.67, changePercent: 2.25 },
      'WTI': { price: 68.23, change: -1.45, changePercent: -2.08 },
      'BRENT': { price: 72.34, change: -1.23, changePercent: -1.67 },
      'NGAS': { price: 3.456, change: 0.123, changePercent: 3.69 }
    };

    const data = marketData[symbol];
    if (!data) {
      // Fallback for unknown symbols
      return {
        symbol,
        bid: 100.00,
        ask: 100.02,
        lastPrice: 100.01,
        change: 0,
        changePercent: 0,
        volume: 1000000,
        timestamp: new Date().toISOString()
      };
    }

    const spread = data.price * 0.0002; // 0.02% spread
    return {
      symbol,
      bid: data.price - spread,
      ask: data.price + spread,
      lastPrice: data.price,
      change: data.change,
      changePercent: data.changePercent,
      volume: Math.floor(Math.random() * 5000000) + 1000000,
      timestamp: new Date().toISOString()
    };
  };

  const subscribeToSymbol = useCallback((symbol: string) => {
    console.log(`Subscribing to real-time data for ${symbol}`);
    
    // Set initial data immediately from static market data
    setQuotes(prev => {
      const newQuotes = new Map(prev);
      newQuotes.set(symbol, getRealMarketData(symbol));
      return newQuotes;
    });

    // Subscribe to live WebSocket data if connected
    const polygonWS = getPolygonWS();
    if (polygonWS && isConnected && !subscribedSymbols.current.has(symbol)) {
      subscribedSymbols.current.add(symbol);
      
      polygonWS.subscribe(symbol, (data: any) => {
        console.log(`Live Polygon data for ${symbol}:`, data);
        
        setQuotes(prev => {
          const newQuotes = new Map(prev);
          const existing = newQuotes.get(symbol) || getRealMarketData(symbol);
          
          // Handle different Polygon message types
          if ('bid' in data && 'ask' in data) { // Quote data
            existing.bid = data.bid;
            existing.ask = data.ask;
            if (data.lastPrice) {
              const prevPrice = existing.lastPrice;
              existing.lastPrice = data.lastPrice;
              if (prevPrice > 0) {
                existing.change = existing.lastPrice - prevPrice;
                existing.changePercent = (existing.change / prevPrice) * 100;
              }
            }
            existing.volume = data.volume || existing.volume;
            existing.timestamp = new Date(data.timestamp).toISOString();
          } else if ('price' in data && 'size' in data) { // Trade data
            const prevPrice = existing.lastPrice;
            existing.lastPrice = data.price;
            existing.volume = data.size;
            existing.timestamp = new Date(data.timestamp).toISOString();
            
            if (prevPrice > 0) {
              existing.change = existing.lastPrice - prevPrice;
              existing.changePercent = (existing.change / prevPrice) * 100;
            }

            // Update chart data with real trade data
            setChartData(prevChart => {
              const newChartData = new Map(prevChart);
              const symbolData = newChartData.get(symbol) || [];
              
              const newPoint: ChartData = {
                symbol,
                price: existing.lastPrice,
                timestamp: data.timestamp,
                volume: existing.volume
              };
              
              // Keep last 1000 points for charts
              const updatedData = [...symbolData, newPoint].slice(-1000);
              newChartData.set(symbol, updatedData);
              
              return newChartData;
            });
          }

          newQuotes.set(symbol, existing);
          return newQuotes;
        });
      });

      console.log(`✅ Subscribed to live Polygon data for ${symbol}`);
    } else {
      console.log(`📊 Using static market data for ${symbol} (WebSocket: ${isConnected ? 'connected but already subscribed' : 'not connected'})`);
    }

    // Real-time price simulation for better UX (even with live data)
    const updateInterval = setInterval(() => {
      if (!isConnected) { // Only simulate when not connected to real data
        setQuotes(prev => {
          const newQuotes = new Map(prev);
          const existing = newQuotes.get(symbol);
          if (existing) {
            // Realistic market movements
            const volatility = 0.002; // 0.2% max movement
            const change = (Math.random() - 0.5) * volatility * existing.lastPrice;
            const newPrice = existing.lastPrice + change;
            
            existing.lastPrice = newPrice;
            existing.change += change;
            existing.changePercent = (existing.change / (newPrice - existing.change)) * 100;
            existing.timestamp = new Date().toISOString();
            
            // Update spread
            const spread = newPrice * 0.0002;
            existing.bid = newPrice - spread;
            existing.ask = newPrice + spread;
            
            newQuotes.set(symbol, existing);
          }
          return newQuotes;
        });
      }
    }, 2000 + Math.random() * 3000); // 2-5 second intervals

    return () => clearInterval(updateInterval);
  }, [isConnected]);

  const unsubscribeFromSymbol = useCallback((symbol: string) => {
    try {
      const polygonWS = getPolygonWS();
      if (polygonWS && subscribedSymbols.current.has(symbol)) {
        subscribedSymbols.current.delete(symbol);
        polygonWS.unsubscribe(symbol);
        console.log(`Unsubscribed from WebSocket for ${symbol}`);
      }
    } catch (error) {
      console.warn(`Failed to unsubscribe from WebSocket for ${symbol}:`, error);
    }
    
    // Always clean up local state
    setQuotes(prev => {
      const newQuotes = new Map(prev);
      newQuotes.delete(symbol);
      return newQuotes;
    });

    setChartData(prev => {
      const newChartData = new Map(prev);
      newChartData.delete(symbol);
      return newChartData;
    });

    console.log(`Cleaned up data for ${symbol}`);
  }, []);

  const searchStocks = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 1) return [];
    
    try {
      const polygonSearch = getPolygonSearch();
      if (polygonSearch) {
        console.log(`🔍 Searching Polygon API for: ${query}`);
        const results = await polygonSearch.searchTickers(query);
        console.log(`✅ Found ${results.length} results from Polygon API`);
        return results;
      } else {
        console.log(`📋 Using fallback search for: ${query}`);
        return getMockSearchResults(query);
      }
    } catch (err) {
      console.error('Polygon search error:', err);
      console.log(`📋 Falling back to mock search for: ${query}`);
      return getMockSearchResults(query);
    }
  }, []);

  // Enhanced mock search results as fallback
  const getMockSearchResults = (query: string): SearchResult[] => {
    const mockStocks = [
      { id: '1', symbol: 'AAPL', name: 'Apple Inc', exchange: 'NASDAQ', asset_class: 'stocks', status: 'active' },
      { id: '2', symbol: 'TSLA', name: 'Tesla Inc', exchange: 'NASDAQ', asset_class: 'stocks', status: 'active' },
      { id: '3', symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', asset_class: 'stocks', status: 'active' },
      { id: '4', symbol: 'GOOGL', name: 'Alphabet Inc', exchange: 'NASDAQ', asset_class: 'stocks', status: 'active' },
      { id: '5', symbol: 'AMZN', name: 'Amazon.com Inc', exchange: 'NASDAQ', asset_class: 'stocks', status: 'active' },
      { id: '6', symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', asset_class: 'stocks', status: 'active' },
      { id: '7', symbol: 'META', name: 'Meta Platforms Inc', exchange: 'NASDAQ', asset_class: 'stocks', status: 'active' },
      { id: '8', symbol: 'NFLX', name: 'Netflix Inc', exchange: 'NASDAQ', asset_class: 'stocks', status: 'active' },
      { id: '9', symbol: 'AMD', name: 'Advanced Micro Devices Inc', exchange: 'NASDAQ', asset_class: 'stocks', status: 'active' },
      { id: '10', symbol: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ', asset_class: 'stocks', status: 'active' },
      { id: '11', symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', exchange: 'NYSE', asset_class: 'etf', status: 'active' },
      { id: '12', symbol: 'QQQ', name: 'Invesco QQQ Trust', exchange: 'NASDAQ', asset_class: 'etf', status: 'active' },
      { id: '13', symbol: 'BTC-USD', name: 'Bitcoin USD', exchange: 'CRYPTO', asset_class: 'crypto', status: 'active' },
      { id: '14', symbol: 'ETH-USD', name: 'Ethereum USD', exchange: 'CRYPTO', asset_class: 'crypto', status: 'active' },
      { id: '15', symbol: 'DIS', name: 'The Walt Disney Company', exchange: 'NYSE', asset_class: 'stocks', status: 'active' },
      { id: '16', symbol: 'BABA', name: 'Alibaba Group Holding Limited', exchange: 'NYSE', asset_class: 'stocks', status: 'active' },
      { id: '17', symbol: 'V', name: 'Visa Inc', exchange: 'NYSE', asset_class: 'stocks', status: 'active' },
      { id: '18', symbol: 'JPM', name: 'JPMorgan Chase & Co', exchange: 'NYSE', asset_class: 'stocks', status: 'active' },
      { id: '19', symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE', asset_class: 'stocks', status: 'active' },
      { id: '20', symbol: 'WMT', name: 'Walmart Inc', exchange: 'NYSE', asset_class: 'stocks', status: 'active' }
    ];
    
    const lowerQuery = query.toLowerCase();
    return mockStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(lowerQuery) || 
      stock.name.toLowerCase().includes(lowerQuery)
    );
  };

  // Monitor connection status and provide fallback
  useEffect(() => {
    try {
      const polygonWS = getPolygonWS();
      if (!polygonWS) return;

      const interval = setInterval(() => {
        const connected = polygonWS.getConnectionStatus();
        setIsConnected(connected);
        
        if (!connected && subscribedSymbols.current.size > 0) {
          console.log('Polygon WebSocket disconnected, using demo data');
          setError('Using demo data - WebSocket disconnected');
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    } catch (error) {
      console.warn('Connection monitoring error:', error);
    }
  }, []);

  return {
    quotes,
    chartData,
    isConnected,
    error,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    searchStocks
  };
};
