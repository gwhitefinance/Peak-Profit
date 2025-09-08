import { useEffect, useState } from "react";
import { usePolygonWebSocket } from "@/hooks/usePolygonWebSocket";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Only stocks and cryptos available for trading on the platform
const availableInstruments = [
  // U.S. Stocks & ETFs
  "SPY", "QQQ", "AAPL", "MSFT", "NVDA", "AMZN", "META", "GOOGL", "TSLA", "NFLX",
  "AMD", "JPM", "BAC", "BA", "COIN",
  // Cryptocurrencies (top performers from crypto category)
  "BTC", "ETH", "SOL", "ADA", "BNB", "XRP", "LTC", "UNI", "AAVE", "LINK",
  "MATIC", "DOGE", "SHIB", "WIF", "PEPE"
];

export default function QuotronTicker() {
  const { quotes, subscribeToSymbol } = usePolygonWebSocket();
  const [topPerformers, setTopPerformers] = useState<string[]>([]);

  useEffect(() => {
    // Subscribe to all available trading instruments
    availableInstruments.forEach(symbol => {
      subscribeToSymbol(symbol);
    });
  }, [subscribeToSymbol]);

  // Calculate top performers from available trading instruments every 10 seconds
  useEffect(() => {
    const calculateTopPerformers = () => {
      const instrumentsWithData = availableInstruments
        .map(symbol => {
          const quote = quotes.get(symbol);
          return {
            symbol,
            changePercent: quote?.changePercent || 0,
            price: quote?.lastPrice || quote?.ask || 0,
            change: quote?.change || 0
          };
        })
        .filter(instrument => instrument.price > 0) // Only instruments with real data
        .sort((a, b) => b.changePercent - a.changePercent) // Sort by performance
        .slice(0, 12); // Top 12 performers

      setTopPerformers(instrumentsWithData.map(instrument => instrument.symbol));
    };

    // Initial calculation
    calculateTopPerformers();

    // Update every 10 seconds
    const interval = setInterval(calculateTopPerformers, 10000);
    return () => clearInterval(interval);
  }, [quotes]);

  const tickerItems = topPerformers.map(symbol => {
    const quote = quotes.get(symbol);
    const price = quote?.lastPrice || quote?.ask || 0;
    const change = quote?.change || 0;
    const changePercent = quote?.changePercent || 0;
    const isPositive = change >= 0;

    return {
      symbol,
      price,
      change,
      changePercent,
      isPositive
    };
  });

  return (
    <div className="bg-card border-b border-border overflow-hidden relative ml-3">
      <div className="flex items-center h-12 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="animate-ticker-scroll flex items-center gap-8 whitespace-nowrap">
          {/* Duplicate the items for seamless scrolling */}
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <div key={`${item.symbol}-${index}`} className="flex items-center gap-3 px-4">
              <span className="text-sm font-bold text-foreground">{item.symbol}</span>
              <span className="text-sm font-mono text-foreground">
                ${item.price.toFixed(2)}
              </span>
              <div className={cn(
                "flex items-center gap-1 text-xs",
                item.isPositive ? "text-green-400" : "text-red-400"
              )}>
                {item.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>
                  {item.isPositive ? "+" : ""}{item.change.toFixed(2)} ({item.isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}