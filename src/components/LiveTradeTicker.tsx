import { useState, useEffect } from "react";
import { Activity, TrendingUp, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveTradeTickerProps {
  className?: string;
}

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
}

// Mock live trading data - in real app this would come from WebSocket
const generateTickerData = (): TickerItem[] => {
  const symbols = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BTC", "ETH", "SOL",
    "EURUSD", "GBPUSD", "USDJPY", "XAUUSD", "XAGUSD", "US500", "US30", "US100"
  ];
  
  return symbols.map(symbol => ({
    symbol,
    price: Math.random() * 1000 + 50,
    change: (Math.random() - 0.5) * 20,
    changePercent: (Math.random() - 0.5) * 8,
    volume: `${(Math.random() * 100).toFixed(1)}M`
  }));
};

export default function LiveTradeTicker({ className }: LiveTradeTickerProps) {
  const [tickerData, setTickerData] = useState<TickerItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Initial data load
    setTickerData(generateTickerData());

    // Update data every 4-6 seconds for more realistic feel
    const interval = setInterval(() => {
      if (!isPaused) {
        setTickerData(generateTickerData());
      }
    }, 4000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes("USD") && !symbol.includes("XAU") && !symbol.includes("XAG")) {
      return price.toFixed(5); // Forex pairs
    }
    if (price > 1000) return price.toFixed(0);
    if (price > 10) return price.toFixed(2);
    return price.toFixed(4);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-muted-foreground";
  };

  return (
    <div className={cn("bg-background border-b border-border/30 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border/20">
        <div className="flex items-center gap-3">
          <Activity size={16} className="text-primary animate-pulse" />
          <span className="text-sm font-semibold text-foreground">Peak Profit</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-green-400" />
            <span>Gainers: {tickerData.filter(item => item.change > 0).length}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-red-400 rotate-180" />
            <span>Losers: {tickerData.filter(item => item.change < 0).length}</span>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs hover:text-foreground transition-colors"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      {/* Scrolling Ticker */}
      <div className="relative h-12 overflow-hidden">
        <div 
          className={cn(
            "flex items-center h-full whitespace-nowrap",
            !isPaused && "animate-ticker-scroll"
          )}
          style={{
            animation: !isPaused ? "ticker-scroll 60s linear infinite" : "none"
          }}
        >
          {/* Duplicate data for seamless scrolling */}
          {[...tickerData, ...tickerData].map((item, index) => (
            <div key={`${item.symbol}-${index}`} className="flex items-center px-6 border-r border-border/20">
              <div className="flex items-center gap-3 min-w-fit">
                <span className="font-bold text-foreground text-sm">{item.symbol}</span>
                <span className="font-mono text-sm text-foreground">
                  ${formatPrice(item.price, item.symbol)}
                </span>
                <div className={cn("flex items-center gap-1 text-sm font-medium", getChangeColor(item.change))}>
                  <span>{item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}</span>
                  <span>({item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%)</span>
                </div>
                {item.volume && (
                  <span className="text-xs text-muted-foreground">{item.volume}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}