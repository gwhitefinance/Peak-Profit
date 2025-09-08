import { useState, useEffect, useRef } from 'react';
import { getAlpacaWS, getAlpacaSearch } from '@/services/alpacaWebSocket';

interface StockQuote {
  symbol: string;
  bid: number;
  ask: number;
  lastPrice: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  asset_class: string;
  status: string;
}

export const useAlpacaData = () => {
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscribedSymbols = useRef<Set<string>>(new Set());

  const subscribeToSymbol = (symbol: string) => {
    const alpacaWS = getAlpacaWS();
    if (!alpacaWS || subscribedSymbols.current.has(symbol)) return;

    subscribedSymbols.current.add(symbol);
    
    alpacaWS.subscribe(symbol, (data: any) => {
      setQuotes(prev => {
        const newQuotes = new Map(prev);
        const existing = newQuotes.get(symbol) || {
          symbol,
          bid: 0,
          ask: 0,
          lastPrice: 0,
          change: 0,
          changePercent: 0,
          volume: 0
        };

        if (data.T === 'q') { // Quote data
          existing.bid = data.bp;
          existing.ask = data.ap;
        } else if (data.T === 't') { // Trade data
          const prevPrice = existing.lastPrice;
          existing.lastPrice = data.p;
          existing.volume = data.s;
          
          if (prevPrice > 0) {
            existing.change = data.p - prevPrice;
            existing.changePercent = (existing.change / prevPrice) * 100;
          }
        }

        newQuotes.set(symbol, existing);
        return newQuotes;
      });
    });
  };

  const unsubscribeFromSymbol = (symbol: string) => {
    const alpacaWS = getAlpacaWS();
    if (!alpacaWS || !subscribedSymbols.current.has(symbol)) return;

    subscribedSymbols.current.delete(symbol);
    alpacaWS.unsubscribe(symbol);
    
    setQuotes(prev => {
      const newQuotes = new Map(prev);
      newQuotes.delete(symbol);
      return newQuotes;
    });
  };

  const searchStocks = async (query: string): Promise<SearchResult[]> => {
    const alpacaSearch = getAlpacaSearch();
    if (!alpacaSearch) {
      setError('Alpaca search service not initialized');
      return [];
    }

    try {
      const results = await alpacaSearch.searchStocks(query);
      return results.map(stock => ({
        id: stock.id,
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        asset_class: stock.asset_class,
        status: stock.status
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      return [];
    }
  };

  useEffect(() => {
    const alpacaWS = getAlpacaWS();
    if (alpacaWS) {
      setIsConnected(alpacaWS.getConnectionStatus());
      
      // Check connection status periodically
      const interval = setInterval(() => {
        setIsConnected(alpacaWS.getConnectionStatus());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  return {
    quotes,
    isConnected,
    error,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    searchStocks
  };
};