import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import WatchlistTable from "@/components/WatchlistTable";
import QuotronTicker from "@/components/QuotronTicker";
import { useWatchlist } from "@/hooks/useWatchlist";
import { usePolygonWebSocket } from "@/hooks/usePolygonWebSocket";
import { useEffect } from "react";

export default function Watchlist() {
  const { watchlistStocks, watchlist } = useWatchlist();
  const { subscribeToSymbol, unsubscribeFromSymbol, quotes } = usePolygonWebSocket();

  // Subscribe to all watchlist symbols for live data
  useEffect(() => {
    watchlist.forEach(symbol => {
      subscribeToSymbol(symbol);
    });

    return () => {
      watchlist.forEach(symbol => {
        unsubscribeFromSymbol(symbol);
      });
    };
  }, [watchlist, subscribeToSymbol, unsubscribeFromSymbol]);

  // Calculate strength based on change percentage and market performance
  const calculateStrength = (changePercent: number, change: number) => {
    // Base strength on change percentage
    let strength = 50; // neutral base
    
    // Add points based on positive/negative change
    if (changePercent > 0) {
      strength += Math.min(changePercent * 10, 40); // Cap at +40 points
    } else {
      strength += Math.max(changePercent * 10, -40); // Cap at -40 points
    }
    
    // Bonus for strong moves
    if (Math.abs(changePercent) > 3) {
      strength += Math.abs(changePercent) > 5 ? 10 : 5;
    }
    
    // Ensure it stays within 0-100 range
    return Math.max(0, Math.min(100, Math.round(strength)));
  };

  // Convert watchlist stocks to display format with live quotes
  const displayStocks = watchlistStocks.map((stock, index) => {
    const quote = quotes.get(stock.symbol);
    const currentPrice = quote?.lastPrice || quote?.ask || stock.lastPrice || 0;
    const change = quote?.change || stock.change || 0;
    const changePercent = quote?.changePercent || stock.changePercent || 0;
    const strength = calculateStrength(changePercent, change);

    return {
      id: index + 1,
      symbol: stock.symbol,
      company: stock.name,
      price: currentPrice,
      change,
      changePercent,
      strength,
      strengthLabel: strength >= 80 ? "Strong Buy" : 
                   strength >= 65 ? "Buy" : 
                   strength >= 45 ? "Hold" : 
                   strength >= 30 ? "Sell" : "Strong Sell",
      volume: "N/A", // Not available from current data
      marketCap: "N/A" // Not available from current data
    };
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Quotron Ticker Strip */}
        <QuotronTicker />
        
        <Header 
          title="Watch List"
          subtitle={`${watchlistStocks.length} stocks with live market data`}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-screen-2xl mx-auto">
            <WatchlistTable stocks={displayStocks} />
          </div>
        </main>
      </div>
    </div>
  );
}