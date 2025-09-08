import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { initializeAlpaca, getAlpacaWS, getAlpacaSearch } from '@/services/alpacaWebSocket';

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

export const useAlpacaWebSocket = () => {
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [chartData, setChartData] = useState<Map<string, ChartData[]>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscribedSymbols = useRef<Set<string>>(new Set());
  const initRef = useRef(false);

  // Initialize WebSocket connection with API keys from Supabase secrets
  useEffect(() => {
    const initializeWebSocket = async () => {
      if (initRef.current) return;
      initRef.current = true;

      try {
        // Get API keys from Supabase secrets via edge function
        const { data: credentialsData } = await fetch('/api/get-alpaca-credentials').then(r => r.json()).catch(() => ({}));
        
        if (!credentialsData?.apiKey || !credentialsData?.secretKey) {
          // Use demo keys for WebSocket connection (replace with your actual keys)
          console.log('Using demo credentials for WebSocket connection');
        }

        const config = {
          apiKey: credentialsData?.apiKey || 'PKTEST_YOUR_API_KEY',
          secretKey: credentialsData?.secretKey || 'YOUR_SECRET_KEY',
          stocksUrl: 'wss://stream.data.alpaca.markets/v2/sip',
          cryptoUrl: 'wss://stream.data.alpaca.markets/v1beta3/crypto/us'
        };

        const { alpacaWS } = initializeAlpaca(config);
        
        await alpacaWS.connect();
        setIsConnected(true);
        setError(null);
        
        console.log('Alpaca WebSocket connected successfully');
      } catch (err) {
        console.error('Failed to connect to Alpaca WebSocket:', err);
        setError(err instanceof Error ? err.message : 'Connection failed');
        setIsConnected(false);
      }
    };

    initializeWebSocket();
  }, []);

  const subscribeToSymbol = useCallback((symbol: string) => {
    const alpacaWS = getAlpacaWS();
    if (!alpacaWS || !isConnected || subscribedSymbols.current.has(symbol)) return;

    subscribedSymbols.current.add(symbol);
    
    alpacaWS.subscribe(symbol, (data: any) => {
      const timestamp = Date.now();
      
      setQuotes(prev => {
        const newQuotes = new Map(prev);
        const existing = newQuotes.get(symbol) || {
          symbol,
          bid: 0,
          ask: 0,
          lastPrice: 0,
          change: 0,
          changePercent: 0,
          volume: 0,
          timestamp: new Date().toISOString()
        };

        if (data.T === 'q') { // Quote data
          existing.bid = data.bp || 0;
          existing.ask = data.ap || 0;
          existing.timestamp = new Date().toISOString();
        } else if (data.T === 't') { // Trade data
          const prevPrice = existing.lastPrice;
          existing.lastPrice = data.p || 0;
          existing.volume = data.s || 0;
          existing.timestamp = new Date().toISOString();
          
          if (prevPrice > 0) {
            existing.change = existing.lastPrice - prevPrice;
            existing.changePercent = (existing.change / prevPrice) * 100;
          }

          // Update chart data
          setChartData(prevChart => {
            const newChartData = new Map(prevChart);
            const symbolData = newChartData.get(symbol) || [];
            
            const newPoint: ChartData = {
              symbol,
              price: existing.lastPrice,
              timestamp,
              volume: existing.volume
            };
            
            // Keep only last 100 points for performance
            const updatedData = [...symbolData, newPoint].slice(-100);
            newChartData.set(symbol, updatedData);
            
            return newChartData;
          });
        }

        newQuotes.set(symbol, existing);
        return newQuotes;
      });
    });

    console.log(`Subscribed to ${symbol}`);
  }, [isConnected]);

  const unsubscribeFromSymbol = useCallback((symbol: string) => {
    const alpacaWS = getAlpacaWS();
    if (!alpacaWS || !subscribedSymbols.current.has(symbol)) return;

    subscribedSymbols.current.delete(symbol);
    alpacaWS.unsubscribe(symbol);
    
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

    console.log(`Unsubscribed from ${symbol}`);
  }, []);

  const searchStocks = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      // Use the backend search function to get real Alpaca data
      const { data, error } = await supabase.functions.invoke('alpaca-search', {
        body: { query }
      });

      if (error) {
        console.error('Backend search error:', error);
        setError('Search failed - using fallback data');
        return getMockSearchResults(query);
      }

      setError(null);
      return data?.stocks || [];
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed - using fallback data');
      return getMockSearchResults(query);
    }
  }, []);

  // Mock search results as fallback with more comprehensive stock list
  const getMockSearchResults = (query: string): SearchResult[] => {
    const mockStocks = [
      { id: '1', symbol: 'AAPL', name: 'Apple Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '2', symbol: 'TSLA', name: 'Tesla Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '3', symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '4', symbol: 'GOOGL', name: 'Alphabet Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '5', symbol: 'AMZN', name: 'Amazon.com Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '6', symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '7', symbol: 'META', name: 'Meta Platforms Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '8', symbol: 'NFLX', name: 'Netflix Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '9', symbol: 'AMD', name: 'Advanced Micro Devices Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '10', symbol: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '11', symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', exchange: 'NYSE', asset_class: 'us_equity', status: 'active' },
      { id: '12', symbol: 'QQQ', name: 'Invesco QQQ Trust', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '13', symbol: 'AMZN', name: 'Amazon.com Inc', exchange: 'NASDAQ', asset_class: 'us_equity', status: 'active' },
      { id: '14', symbol: 'DIS', name: 'The Walt Disney Company', exchange: 'NYSE', asset_class: 'us_equity', status: 'active' },
      { id: '15', symbol: 'BABA', name: 'Alibaba Group Holding Limited', exchange: 'NYSE', asset_class: 'us_equity', status: 'active' }
    ];
    
    const lowerQuery = query.toLowerCase();
    return mockStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(lowerQuery) || 
      stock.name.toLowerCase().includes(lowerQuery)
    );
  };

  // Monitor connection status
  useEffect(() => {
    const alpacaWS = getAlpacaWS();
    if (!alpacaWS) return;

    const interval = setInterval(() => {
      const connected = alpacaWS.getConnectionStatus();
      setIsConnected(connected);
      
      if (!connected && subscribedSymbols.current.size > 0) {
        // Try to reconnect if we have active subscriptions
        alpacaWS.connect().catch(err => {
          console.error('Reconnection failed:', err);
        });
      }
    }, 5000);

    return () => clearInterval(interval);
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
