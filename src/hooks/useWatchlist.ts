import { useState, useEffect, useCallback } from 'react';

export interface WatchlistStock {
  symbol: string;
  name: string;
  bid?: number;
  ask?: number;
  lastPrice?: number;
  change?: number;
  changePercent?: number;
  addedAt: string;
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [watchlistStocks, setWatchlistStocks] = useState<WatchlistStock[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedSymbols = localStorage.getItem('trading_watchlist');
    const savedStocks = localStorage.getItem('trading_watchlist_stocks');
    
    if (savedSymbols) {
      try {
        const parsed = JSON.parse(savedSymbols);
        setWatchlist(new Set(parsed));
      } catch (error) {
        console.error('Error loading watchlist symbols:', error);
      }
    }
    
    if (savedStocks) {
      try {
        const parsed = JSON.parse(savedStocks);
        setWatchlistStocks(parsed);
      } catch (error) {
        console.error('Error loading watchlist stocks:', error);
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes - REMOVED to prevent conflicts
  // useEffect(() => {
  //   const watchlistArray = Array.from(watchlist);
  //   localStorage.setItem('trading_watchlist', JSON.stringify(watchlistArray));
  // }, [watchlist]);

  // Save watchlist stocks to localStorage whenever it changes - REMOVED to prevent conflicts  
  // useEffect(() => {
  //   localStorage.setItem('trading_watchlist_stocks', JSON.stringify(watchlistStocks));
  // }, [watchlistStocks]);

  const addToWatchlist = useCallback((symbol: string, stockData?: Partial<WatchlistStock>) => {
    const upperSymbol = symbol.toUpperCase();
    console.log('Adding to watchlist:', upperSymbol);
    
    setWatchlist(prev => {
      const newWatchlist = new Set([...prev, upperSymbol]);
      console.log('New watchlist after add:', Array.from(newWatchlist));
      // Force localStorage update immediately
      localStorage.setItem('trading_watchlist', JSON.stringify(Array.from(newWatchlist)));
      return newWatchlist;
    });
    
    // Add to stocks array with any available data
    const newStock: WatchlistStock = {
      symbol: upperSymbol,
      name: stockData?.name || upperSymbol,
      bid: stockData?.bid,
      ask: stockData?.ask,
      lastPrice: stockData?.lastPrice,
      change: stockData?.change,
      changePercent: stockData?.changePercent,
      addedAt: new Date().toISOString()
    };
    
    setWatchlistStocks(prev => {
      const filtered = prev.filter(stock => stock.symbol !== upperSymbol);
      const newStocks = [...filtered, newStock];
      console.log('New watchlist stocks after add:', newStocks);
      // Force localStorage update immediately
      localStorage.setItem('trading_watchlist_stocks', JSON.stringify(newStocks));
      return newStocks;
    });
  }, []);

  const removeFromWatchlist = useCallback((symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    setWatchlist(prev => {
      const newWatchlist = new Set(prev);
      newWatchlist.delete(upperSymbol);
      // Force localStorage update immediately
      localStorage.setItem('trading_watchlist', JSON.stringify(Array.from(newWatchlist)));
      return newWatchlist;
    });
    
    setWatchlistStocks(prev => {
      const newStocks = prev.filter(stock => stock.symbol !== upperSymbol);
      // Force localStorage update immediately
      localStorage.setItem('trading_watchlist_stocks', JSON.stringify(newStocks));
      return newStocks;
    });
  }, []);

  const toggleWatchlist = useCallback((symbol: string, stockData?: Partial<WatchlistStock>) => {
    const upperSymbol = symbol.toUpperCase();
    if (watchlist.has(upperSymbol)) {
      removeFromWatchlist(upperSymbol);
    } else {
      addToWatchlist(upperSymbol, stockData);
    }
  }, [watchlist, addToWatchlist, removeFromWatchlist]);

  const updateWatchlistStock = useCallback((symbol: string, data: Partial<WatchlistStock>) => {
    const upperSymbol = symbol.toUpperCase();
    if (watchlist.has(upperSymbol)) {
      setWatchlistStocks(prev => 
        prev.map(stock => 
          stock.symbol === upperSymbol 
            ? { ...stock, ...data }
            : stock
        )
      );
    }
  }, [watchlist]);

  const isInWatchlist = useCallback((symbol: string) => {
    const result = watchlist.has(symbol.toUpperCase());
    console.log('Checking if', symbol, 'is in watchlist:', result, 'Current watchlist:', Array.from(watchlist));
    return result;
  }, [watchlist]);

  return {
    watchlist: Array.from(watchlist),
    watchlistStocks,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    updateWatchlistStock,
    isInWatchlist
  };
};