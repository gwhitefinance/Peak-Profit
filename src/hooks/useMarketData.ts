import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useMarketData = () => {
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [isConnected, setIsConnected] = useState(true); // Always connected since we use backend
  const [error, setError] = useState<string | null>(null);
  const quotesInterval = useRef<NodeJS.Timeout | null>(null);
  const subscribedSymbols = useRef<Set<string>>(new Set());

  const subscribeToSymbol = useCallback((symbol: string) => {
    if (subscribedSymbols.current.has(symbol)) return;
    
    subscribedSymbols.current.add(symbol);
    
    // Fetch initial quote
    // Fetch initial quote will be handled by polling
  }, []);

  const unsubscribeFromSymbol = useCallback((symbol: string) => {
    subscribedSymbols.current.delete(symbol);
    
    setQuotes(prev => {
      const newQuotes = new Map(prev);
      newQuotes.delete(symbol);
      return newQuotes;
    });
  }, []);

  const fetchQuotes = useCallback(async (symbols: string[]) => {
    if (symbols.length === 0) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('alpaca-quotes', {
        body: { symbols }
      });

      if (error) {
        console.error('Error fetching quotes:', error);
        setError('Failed to fetch quotes');
        return;
      }

      if (data?.quotes) {
        setQuotes(prev => {
          const newQuotes = new Map(prev);
          
          Object.entries(data.quotes).forEach(([symbol, quote]: [string, any]) => {
            const existing = newQuotes.get(symbol);
            const prevPrice = existing?.lastPrice || 0;
            
            // Calculate change if we have previous price
            let change = 0;
            let changePercent = 0;
            
            if (prevPrice > 0 && quote.lastPrice !== prevPrice) {
              change = quote.lastPrice - prevPrice;
              changePercent = (change / prevPrice) * 100;
            } else if (existing) {
              change = existing.change;
              changePercent = existing.changePercent;
            }
            
            newQuotes.set(symbol, {
              ...quote,
              change,
              changePercent
            });
          });
          
          return newQuotes;
        });
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
    }
  }, []);

  const searchStocks = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (query.length < 2) return [];
    
    try {
      const { data, error } = await supabase.functions.invoke('alpaca-search', {
        body: { query }
      });

      if (error) {
        console.error('Error searching stocks:', error);
        setError('Failed to search stocks');
        return [];
      }

      setError(null);
      return data?.stocks || [];
    } catch (err) {
      console.error('Error searching stocks:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      return [];
    }
  }, []);

  const placeOrder = useCallback(async (orderData: {
    symbol: string;
    qty: number;
    side: 'buy' | 'sell';
    type?: 'market' | 'limit' | 'stop';
    limit_price?: number;
    stop_price?: number;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('alpaca-order', {
        body: orderData
      });

      if (error) {
        console.error('Error placing order:', error);
        throw new Error('Failed to place order');
      }

      return data;
    } catch (err) {
      console.error('Error placing order:', err);
      throw err;
    }
  }, []);

  // Start polling for quotes of subscribed symbols
  useEffect(() => {
    const pollQuotes = () => {
      const symbols = Array.from(subscribedSymbols.current);
      if (symbols.length > 0) {
        fetchQuotes(symbols);
      }
    };

    // Poll every 2 seconds for real-time-ish updates
    quotesInterval.current = setInterval(pollQuotes, 2000);

    return () => {
      if (quotesInterval.current) {
        clearInterval(quotesInterval.current);
      }
    };
  }, [fetchQuotes]);

  return {
    quotes,
    isConnected,
    error,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    searchStocks,
    placeOrder
  };
};