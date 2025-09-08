import { useState, useEffect } from "react";
import { Star, TrendingUp, Bitcoin, DollarSign, BarChart3, Zap, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePolygonWebSocket } from "@/hooks/usePolygonWebSocket";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Instrument {
  symbol: string;
  name: string;
  category?: string;
}

interface InstrumentsListProps {
  onSelectInstrument: (symbol: string) => void;
}

const PREDEFINED_INSTRUMENTS: { [key: string]: Instrument[] } = {
  "All": [
    { symbol: "SPY", name: "S&P 500", category: "U.S. Stocks & ETFs" },
    { symbol: "QQQ", name: "Nasdaq 100", category: "U.S. Stocks & ETFs" },
    { symbol: "AAPL", name: "Apple", category: "U.S. Stocks & ETFs" },
    { symbol: "MSFT", name: "Microsoft", category: "U.S. Stocks & ETFs" },
    { symbol: "NVDA", name: "NVIDIA", category: "U.S. Stocks & ETFs" },
    { symbol: "AMZN", name: "Amazon", category: "U.S. Stocks & ETFs" },
    { symbol: "META", name: "Meta Platforms", category: "U.S. Stocks & ETFs" },
    { symbol: "GOOGL", name: "Alphabet", category: "U.S. Stocks & ETFs" },
    { symbol: "TSLA", name: "Tesla", category: "U.S. Stocks & ETFs" },
    { symbol: "NFLX", name: "Netflix", category: "U.S. Stocks & ETFs" },
    { symbol: "AMD", name: "Advanced Micro Devices", category: "U.S. Stocks & ETFs" },
    { symbol: "JPM", name: "JPMorgan", category: "U.S. Stocks & ETFs" },
    { symbol: "BAC", name: "Bank of America", category: "U.S. Stocks & ETFs" },
    { symbol: "BA", name: "Boeing", category: "U.S. Stocks & ETFs" },
    { symbol: "COIN", name: "Coinbase", category: "U.S. Stocks & ETFs" },
    { symbol: "BTC", name: "Bitcoin", category: "Cryptocurrencies" },
    { symbol: "ETH", name: "Ethereum", category: "Cryptocurrencies" },
    { symbol: "SOL", name: "Solana", category: "Cryptocurrencies" },
    { symbol: "ADA", name: "Cardano", category: "Cryptocurrencies" },
    { symbol: "BNB", name: "Binance Coin", category: "Cryptocurrencies" },
    { symbol: "XRP", name: "Ripple", category: "Cryptocurrencies" },
    { symbol: "LTC", name: "Litecoin", category: "Cryptocurrencies" },
    { symbol: "UNI", name: "Uniswap", category: "Cryptocurrencies" },
    { symbol: "AAVE", name: "Aave", category: "Cryptocurrencies" },
    { symbol: "LINK", name: "Chainlink", category: "Cryptocurrencies" },
    { symbol: "MATIC", name: "Polygon", category: "Cryptocurrencies" },
    { symbol: "DOGE", name: "Dogecoin", category: "Cryptocurrencies" },
    { symbol: "SHIB", name: "Shiba Inu", category: "Cryptocurrencies" },
    { symbol: "WIF", name: "Dogwifhat", category: "Cryptocurrencies" },
    { symbol: "PEPE", name: "Pepe", category: "Cryptocurrencies" },
    { symbol: "EURUSD", name: "Euro / US Dollar", category: "Forex Pairs" },
    { symbol: "GBPUSD", name: "British Pound / US Dollar", category: "Forex Pairs" },
    { symbol: "USDJPY", name: "US Dollar / Japanese Yen", category: "Forex Pairs" },
    { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", category: "Forex Pairs" },
    { symbol: "NZDUSD", name: "New Zealand Dollar / US Dollar", category: "Forex Pairs" },
    { symbol: "USDCAD", name: "US Dollar / Canadian Dollar", category: "Forex Pairs" },
    { symbol: "USDCHF", name: "US Dollar / Swiss Franc", category: "Forex Pairs" },
    { symbol: "EURJPY", name: "Euro / Japanese Yen", category: "Forex Pairs" },
    { symbol: "GBPJPY", name: "British Pound / Japanese Yen", category: "Forex Pairs" },
    { symbol: "USDTRY", name: "US Dollar / Turkish Lira", category: "Forex Pairs" },
    { symbol: "US30", name: "Dow Jones 30", category: "Indices" },
    { symbol: "US100", name: "Nasdaq 100", category: "Indices" },
    { symbol: "US500", name: "S&P 500", category: "Indices" },
    { symbol: "DAX40", name: "Germany DAX 40", category: "Indices" },
    { symbol: "FTSE100", name: "UK FTSE 100", category: "Indices" },
    { symbol: "XAUUSD", name: "Gold", category: "Commodities" },
    { symbol: "XAGUSD", name: "Silver", category: "Commodities" },
    { symbol: "WTI", name: "Crude Oil", category: "Commodities" },
    { symbol: "BRENT", name: "Brent Oil", category: "Commodities" },
    { symbol: "NGAS", name: "Natural Gas", category: "Commodities" }
],
  "U.S. Stocks & ETFs": [
    { symbol: "SPY", name: "S&P 500" },
    { symbol: "QQQ", name: "Nasdaq 100" },
    { symbol: "AAPL", name: "Apple" },
    { symbol: "MSFT", name: "Microsoft" },
    { symbol: "NVDA", name: "NVIDIA" },
    { symbol: "AMZN", name: "Amazon" },
    { symbol: "META", name: "Meta Platforms" },
    { symbol: "GOOGL", name: "Alphabet" },
    { symbol: "TSLA", name: "Tesla" },
    { symbol: "NFLX", name: "Netflix" },
    { symbol: "AMD", name: "Advanced Micro Devices" },
    { symbol: "JPM", name: "JPMorgan" },
    { symbol: "BAC", name: "Bank of America" },
    { symbol: "BA", name: "Boeing" },
    { symbol: "COIN", name: "Coinbase" }
  ],
  "Cryptocurrencies": [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "SOL", name: "Solana" },
    { symbol: "ADA", name: "Cardano" },
    { symbol: "BNB", name: "Binance Coin" },
    { symbol: "XRP", name: "Ripple" },
    { symbol: "LTC", name: "Litecoin" },
    { symbol: "UNI", name: "Uniswap" },
    { symbol: "AAVE", name: "Aave" },
    { symbol: "LINK", name: "Chainlink" },
    { symbol: "MATIC", name: "Polygon" },
    { symbol: "DOGE", name: "Dogecoin" },
    { symbol: "SHIB", name: "Shiba Inu" },
    { symbol: "WIF", name: "Dogwifhat" },
    { symbol: "PEPE", name: "Pepe" }
  ],
  "Forex Pairs": [
    { symbol: "EURUSD", name: "Euro / US Dollar" },
    { symbol: "GBPUSD", name: "British Pound / US Dollar" },
    { symbol: "USDJPY", name: "US Dollar / Japanese Yen" },
    { symbol: "AUDUSD", name: "Australian Dollar / US Dollar" },
    { symbol: "NZDUSD", name: "New Zealand Dollar / US Dollar" },
    { symbol: "USDCAD", name: "US Dollar / Canadian Dollar" },
    { symbol: "USDCHF", name: "US Dollar / Swiss Franc" },
    { symbol: "EURJPY", name: "Euro / Japanese Yen" },
    { symbol: "GBPJPY", name: "British Pound / Japanese Yen" },
    { symbol: "USDTRY", name: "US Dollar / Turkish Lira" }
  ],
  "Indices": [
    { symbol: "US30", name: "Dow Jones 30" },
    { symbol: "US100", name: "Nasdaq 100" },
    { symbol: "US500", name: "S&P 500" },
    { symbol: "DAX40", name: "Germany DAX 40" },
    { symbol: "FTSE100", name: "UK FTSE 100" }
  ],
  "Commodities": [
    { symbol: "XAUUSD", name: "Gold" },
    { symbol: "XAGUSD", name: "Silver" },
    { symbol: "WTI", name: "Crude Oil" },
    { symbol: "BRENT", name: "Brent Oil" },
    { symbol: "NGAS", name: "Natural Gas" }
  ]
};

const categoryIcons = {
  "All": Search,
  "U.S. Stocks & ETFs": TrendingUp,
  "Cryptocurrencies": Bitcoin,
  "Forex Pairs": DollarSign,
  "Indices": BarChart3,
  "Commodities": Zap
};

export default function InstrumentsList({ onSelectInstrument }: InstrumentsListProps) {
  const [selectedInstrument, setSelectedInstrument] = useState("AAPL");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { quotes, isConnected, subscribeToSymbol, unsubscribeFromSymbol } = usePolygonWebSocket();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, updateWatchlistStock, watchlistStocks, watchlist } = useWatchlist();

  // Subscribe to selected instrument and visible instruments for quotes
  useEffect(() => {
    console.log('InstrumentsList useEffect - selectedInstrument:', selectedInstrument, 'selectedCategory:', selectedCategory);
    
    // Subscribe to selected instrument
    if (selectedInstrument) {
      console.log('Subscribing to:', selectedInstrument);
      subscribeToSymbol(selectedInstrument);
    }
    
    // Also subscribe to all visible instruments in current category for live data
    const currentInstruments = PREDEFINED_INSTRUMENTS[selectedCategory as keyof typeof PREDEFINED_INSTRUMENTS];
    currentInstruments.forEach(instrument => {
      console.log('Subscribing to category instrument:', instrument.symbol);
      subscribeToSymbol(instrument.symbol);
    });

    return () => {
      if (selectedInstrument) {
        unsubscribeFromSymbol(selectedInstrument);
      }
      currentInstruments.forEach(instrument => {
        unsubscribeFromSymbol(instrument.symbol);
      });
    };
  }, [selectedInstrument, selectedCategory, subscribeToSymbol, unsubscribeFromSymbol]);

  // Debug watchlist state on every render
  useEffect(() => {
    console.log('InstrumentsList render - current watchlist items:', Array.from(watchlistStocks));
    console.log('InstrumentsList render - watchlist set:', Array.from(watchlist));
  });

  // Update watchlist stocks with live quotes
  useEffect(() => {
    quotes.forEach((quote, symbol) => {
      updateWatchlistStock(symbol, {
        bid: quote.bid,
        ask: quote.ask,
        lastPrice: quote.lastPrice,
        change: quote.change,
        changePercent: quote.changePercent
      });
    });
  }, [quotes, updateWatchlistStock]);

  console.log('Current quotes map size:', quotes.size);
  console.log('All quotes:', Array.from(quotes.entries()));

  const selectedQuote = quotes.get(selectedInstrument);

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400 bg-green-400/10";
    if (change < 0) return "text-red-400 bg-red-400/10";
    return "text-muted-foreground bg-muted/10";
  };

  const handleSelectInstrument = (symbol: string) => {
    setSelectedInstrument(symbol);
    onSelectInstrument(symbol);
  };

  const handleWatchlistToggle = (symbol: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('Star clicked for:', symbol, 'Currently in watchlist:', isInWatchlist(symbol));
    
    const quote = quotes.get(symbol);
    
    if (isInWatchlist(symbol)) {
      console.log('Removing from watchlist:', symbol);
      removeFromWatchlist(symbol);
      toast.success(`${symbol} removed from watchlist`);
    } else {
      console.log('Adding to watchlist:', symbol);
      // Add with live data or demo data
      const stockData = {
        name,
        bid: quote?.bid || Math.random() * 100 + 50,
        ask: quote?.ask || Math.random() * 100 + 51,
        lastPrice: quote?.lastPrice || Math.random() * 100 + 50.5,
        change: quote?.change || (Math.random() - 0.5) * 10,
        changePercent: quote?.changePercent || (Math.random() - 0.5) * 5
      };
      addToWatchlist(symbol, stockData);
      toast.success(`${symbol} added to watchlist`);
      
      // Force a re-render by updating the component state
      setTimeout(() => {
        console.log('Watchlist updated, current items:', Array.from(watchlistStocks));
      }, 100);
    }
  };

  // Filter instruments based on search query and category
  const getFilteredInstruments = () => {
    let instruments = PREDEFINED_INSTRUMENTS[selectedCategory as keyof typeof PREDEFINED_INSTRUMENTS];
    
    if (searchQuery.trim()) {
      instruments = instruments.filter(instrument => 
        instrument.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instrument.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return instruments;
  };

  return (
    <div className="w-full h-full bg-card flex flex-col">
      {/* Header with Category Tabs */}
      <div className="p-3 border-b border-border/30">
        <h3 className="text-sm font-semibold text-foreground mb-3">Peak Profit Instruments</h3>
        
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14} />
          <Input
            placeholder="Search instruments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-xs bg-secondary/50 border-border/50 focus:bg-background"
          />
        </div>
        
        {/* Category Tabs */}
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {Object.keys(PREDEFINED_INSTRUMENTS).map((category) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            const count = PREDEFINED_INSTRUMENTS[category as keyof typeof PREDEFINED_INSTRUMENTS].length;
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded transition-colors text-left",
                  selectedCategory === category 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "hover:bg-accent/50 text-muted-foreground"
                )}
              >
                <Icon size={12} />
                <span className="flex-1 truncate">{category}</span>
                <span className="text-xs text-muted-foreground">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Column Headers */}
      <div className="px-3 py-2 bg-accent/30 border-b border-border/30">
        <div className="grid grid-cols-6 gap-3 text-xs font-medium text-muted-foreground">
          <div className="col-span-2">Symbol</div>
          <div className="text-right">Bid</div>
          <div className="text-right">Ask</div>
          <div className="text-right">Change</div>
          <div className="text-center">★</div>
        </div>
      </div>

      {/* Instruments List */}
      <div className="flex-1 overflow-y-auto">
        {getFilteredInstruments().map((instrument) => {
          const quote = quotes.get(instrument.symbol);
          const inWatchlist = isInWatchlist(instrument.symbol);
          
          return (
            <div 
              key={instrument.symbol}
              className={cn(
                "px-3 py-3 border-b border-border/30 hover:bg-accent/30 cursor-pointer transition-colors group",
                selectedInstrument === instrument.symbol && "bg-primary/10 border-l-2 border-l-primary"
              )}
              onClick={() => handleSelectInstrument(instrument.symbol)}
            >
              <div className="grid grid-cols-6 gap-3 items-center">
                <div className="col-span-2 min-w-0">
                  <div className="font-medium text-foreground text-sm truncate">{instrument.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate">{instrument.name}</div>
                </div>
                
                <div className="text-left">
                  <div className="font-mono text-xs text-green-400 bg-green-950/20 px-2 py-1 rounded inline-block">
                    {quote?.bid ? quote.bid.toFixed(2) : '--'}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-mono text-xs text-red-400 bg-red-950/20 px-1.5 py-1 rounded text-center w-full">
                    {quote?.ask ? quote.ask.toFixed(2) : '--'}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={cn(
                    "text-xs font-medium px-1.5 py-1 rounded text-center w-full",
                    quote ? getChangeColor(quote.changePercent) : "text-muted-foreground bg-muted/10"
                  )}>
                    {quote ? `${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%` : '--'}
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={(e) => handleWatchlistToggle(instrument.symbol, instrument.name, e)}
                    className={cn(
                      "p-1.5 rounded-md transition-all duration-200 hover:bg-accent/50 active:scale-95",
                      inWatchlist 
                        ? "text-yellow-400 hover:text-yellow-300 bg-yellow-400/10" 
                        : "text-muted-foreground/50 hover:text-yellow-400 hover:bg-yellow-400/10"
                    )}
                    title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                  >
                    <Star 
                      size={14} 
                      className={cn(
                        "transition-all duration-200",
                        inWatchlist ? "fill-current" : ""
                      )} 
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trading Panel */}
      {selectedQuote && (
        <div className="p-3 border-t border-border bg-card">
          <div className="space-y-3">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1">
              {Object.keys(PREDEFINED_INSTRUMENTS).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-2 py-1 text-xs rounded transition-colors",
                    selectedCategory === category 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {category.split(' ')[0]}
                </button>
              ))}
            </div>
            
            {/* Price Display */}
            <div className="flex justify-between items-center">
              <div className="text-red-400 font-bold text-lg">
                {selectedQuote.bid ? selectedQuote.bid.toFixed(5) : '1.06976'}
              </div>
              <div className="text-center text-xs text-muted-foreground">
                ${selectedQuote.ask && selectedQuote.bid 
                  ? ((selectedQuote.ask - selectedQuote.bid) * 20 * 100000).toFixed(2) 
                  : '206.12'} / {selectedQuote.changePercent ? Math.abs(selectedQuote.changePercent).toFixed(2) : '6.21'}%
              </div>
              <div className="text-green-400 font-bold text-lg">
                {selectedQuote.ask ? selectedQuote.ask.toFixed(5) : '1.06976'}
              </div>
            </div>

            {/* Buy/Sell Buttons with Quantity Control */}
            <div className="flex items-center gap-2">
              {/* SELL Button */}
              <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                SELL
              </button>
              
              {/* Quantity Control */}
              <div className="flex items-center bg-secondary border border-border rounded-lg px-2 py-1">
                <button className="text-muted-foreground hover:text-foreground p-1">
                  <span className="text-sm font-bold">−</span>
                </button>
                <div className="mx-3 text-center min-w-[50px]">
                  <div className="text-foreground font-semibold text-sm">20</div>
                  <div className="text-muted-foreground text-xs">Lots</div>
                </div>
                <button className="text-muted-foreground hover:text-foreground p-1">
                  <span className="text-sm font-bold">+</span>
                </button>
              </div>
              
              {/* BUY Button */}
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                BUY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}