import { useState, useEffect } from "react";
import { Search, Plus, Star, TrendingUp, TrendingDown, Eye, MoreHorizontal, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePolygonWebSocket } from "@/hooks/usePolygonWebSocket";
import { useWatchlist } from "@/hooks/useWatchlist";
import { toast } from "sonner";

interface Stock {
  id: number;
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  strength: number;
  strengthLabel: string;
  volume: string;
  marketCap: string;
}

interface WatchlistTableProps {
  stocks: Stock[];
}

export default function WatchlistTable({ stocks }: WatchlistTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddStock, setShowAddStock] = useState(false);
  const [stockSearch, setStockSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { quotes, subscribeToSymbol, unsubscribeFromSymbol } = usePolygonWebSocket();
  const { addToWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlist();

  // Subscribe to all watchlist symbols for live data
  useEffect(() => {
    stocks.forEach(stock => {
      subscribeToSymbol(stock.symbol);
    });

    return () => {
      stocks.forEach(stock => {
        unsubscribeFromSymbol(stock.symbol);
      });
    };
  }, [stocks, subscribeToSymbol, unsubscribeFromSymbol]);

  // Search for stocks when typing - using mock search for now since we removed market data
  useEffect(() => {
    const searchDelayed = setTimeout(async () => {
      if (stockSearch.trim().length > 1) {
        setIsSearching(true);
        try {
          // Mock search results for demo
          const mockResults = [
            { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
            { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
            { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ" },
            { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ" },
            { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ" }
          ].filter(stock => 
            stock.symbol.toLowerCase().includes(stockSearch.toLowerCase()) ||
            stock.name.toLowerCase().includes(stockSearch.toLowerCase())
          );
          setSearchResults(mockResults.slice(0, 10));
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchDelayed);
  }, [stockSearch]);

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToWatchlist = (symbol: string, name: string) => {
    if (!isInWatchlist(symbol)) {
      addToWatchlist(symbol, { name });
      toast.success(`${symbol} added to watchlist`);
    } else {
      toast.info(`${symbol} is already in your watchlist`);
    }
    setShowAddStock(false);
    setStockSearch("");
    setSearchResults([]);
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    removeFromWatchlist(symbol);
    toast.success(`${symbol} removed from watchlist`);
  };

  return (
    <div className="space-y-4">
      {/* Header with search and add button */}
      <div className="flex items-center justify-between bg-card/50 p-4 rounded-lg border border-border">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search watchlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 pl-10 pr-4 py-2 rounded-md bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm"
          />
        </div>
        
        {!showAddStock ? (
          <Button
            onClick={() => setShowAddStock(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus size={16} />
            Add Symbol
          </Button>
        ) : (
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search stocks to add..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 rounded-md bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm"
                  autoFocus
                />
              </div>
              <Button
                onClick={() => {
                  setShowAddStock(false);
                  setStockSearch("");
                  setSearchResults([]);
                }}
                variant="outline"
                size="sm"
              >
                <X size={16} />
              </Button>
            </div>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-card border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.symbol}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0"
                    onClick={() => handleAddToWatchlist(result.symbol, result.name)}
                  >
                    <div>
                      <div className="font-semibold text-sm">{result.symbol}</div>
                      <div className="text-xs text-muted-foreground truncate">{result.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded">{result.exchange}</span>
                      {isInWatchlist(result.symbol) ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Plus size={14} className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isSearching && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-card border border-border rounded-md shadow-lg p-3">
                <div className="text-sm text-muted-foreground">Searching...</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Watchlist table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div className="col-span-3">Symbol</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Change</div>
          <div className="col-span-2 text-right">Change %</div>
          <div className="col-span-2 text-center">Strength</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        {/* Table body */}
        <div className="divide-y divide-border">
        {filteredStocks.map((stock, index) => {
            // Get live quote data
            const liveQuote = quotes.get(stock.symbol);
            const currentPrice = liveQuote?.lastPrice || liveQuote?.ask || stock.price;
            const change = liveQuote?.change || stock.change;
            const changePercent = liveQuote?.changePercent || stock.changePercent;
            
            // Calculate strength based on actual performance data
            const calculateStrength = (changePercent: number) => {
              let strength = 50; // neutral base
              if (changePercent > 0) {
                strength += Math.min(changePercent * 10, 40);
              } else {
                strength += Math.max(changePercent * 10, -40);
              }
              if (Math.abs(changePercent) > 3) {
                strength += Math.abs(changePercent) > 5 ? 10 : 5;
              }
              return Math.max(0, Math.min(100, Math.round(strength)));
            };
            
            const strength = calculateStrength(changePercent);
            const isPositive = change >= 0;
            const strengthColor = strength >= 80 ? "text-green-400" : 
                                strength >= 60 ? "text-blue-400" : 
                                strength >= 40 ? "text-yellow-400" : "text-red-400";
            
            return (
              <div 
                key={stock.id} 
                className={cn(
                  "grid grid-cols-12 gap-4 p-4 hover:bg-muted/20 transition-colors group",
                  index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                )}
              >
                {/* Symbol and company */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary">
                    <Star size={14} />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{stock.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[120px]">{stock.company}</div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-right">
                  <div className="font-mono font-semibold text-foreground">
                    ${currentPrice.toFixed(2)}
                  </div>
                  {liveQuote && (
                    <div className="text-xs text-green-400 font-medium">LIVE</div>
                  )}
                </div>

                {/* Change */}
                <div className="col-span-2 text-right">
                  <div className={cn(
                    "flex items-center justify-end gap-1 font-mono text-sm",
                    isPositive ? "text-green-400" : "text-red-400"
                  )}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isPositive ? "+" : ""}{change.toFixed(2)}
                  </div>
                </div>

                {/* Change % */}
                <div className="col-span-2 text-right">
                  <div className={cn(
                    "font-mono text-sm",
                    isPositive ? "text-green-400" : "text-red-400"
                  )}>
                    {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
                  </div>
                </div>

                {/* Strength */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-500",
                          strength >= 80 ? "bg-green-400" : 
                          strength >= 60 ? "bg-blue-400" : 
                          strength >= 40 ? "bg-yellow-400" : "bg-red-400"
                        )}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                    <span className={cn("text-xs font-medium", strengthColor)}>
                      {strength}%
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Eye size={12} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredStocks.length === 0 && (
          <div className="text-center py-12">
            <Star size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-2">No stocks in your watchlist</p>
            <p className="text-sm text-muted-foreground/70">Add symbols to track their performance</p>
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">Total Watched</div>
          <div className="text-2xl font-bold text-foreground">{stocks.length}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">Gainers</div>
          <div className="text-2xl font-bold text-green-400">
            {stocks.filter(s => s.change > 0).length}
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">Losers</div>
          <div className="text-2xl font-bold text-red-400">
            {stocks.filter(s => s.change < 0).length}
          </div>
        </div>
      </div>
    </div>
  );
}