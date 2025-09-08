import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowDown, ArrowUp, Info, Star, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/hooks/useWatchlist";
import { toast } from "sonner";

const getSymbolIcon = (symbol: string) => {
    const lowerSymbol = symbol.toLowerCase();
    if (lowerSymbol.includes('btc')) return '₿';
    if (lowerSymbol.includes('eth')) return 'Ξ';
    if (lowerSymbol.includes('eur')) return '🇪🇺';
    if (lowerSymbol.includes('gbp')) return '🇬🇧';
    if (lowerSymbol.includes('usd')) return '🇺🇸';
    if (lowerSymbol.includes('jpy')) return '🇯🇵';
    if (lowerSymbol.includes('xau')) return '🪙';
    if (lowerSymbol.includes('xag')) return '🥈';
    return symbol.charAt(0);
};


export default function TradePanel({ instrument, quote }: any) {
  const [quantity, setQuantity] = useState(1);
  const { addToWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlist();

  if (!instrument && !quote) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Select an instrument to see details.
      </div>
    );
  }

  const symbol = instrument?.symbol || quote?.symbol;
  const name = instrument?.name || quote?.symbol;
  const high = quote?.high || instrument?.high || 0;
  const low = quote?.low || instrument?.low || 0;
  const dailyChange = quote?.changePercent || instrument?.daily || 0;
  const weeklyChange = instrument?.weekly || 0;
  const bid = quote?.bid || instrument?.low || 0;
  const ask = quote?.ask || instrument?.high || 0;
  const isFavorited = isInWatchlist(symbol);

  const handleFavoriteToggle = () => {
    if (isFavorited) {
      removeFromWatchlist(symbol);
      toast.success(`${symbol} removed from watchlist`);
    } else {
      addToWatchlist(symbol, { name });
      toast.success(`${symbol} added to watchlist`);
    }
  };


  return (
    <div className="p-3 bg-card border-t border-border/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-lg">
            {getSymbolIcon(symbol)}
          </div>
          <div>
            <div className="font-bold text-lg text-foreground">{symbol}</div>
            <div className="text-xs text-muted-foreground font-mono">
              H: {high.toFixed(4)} L: {low.toFixed(4)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium">
          <div className={cn("flex items-center", dailyChange >= 0 ? "text-green-400" : "text-red-400")}>
            {dailyChange >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {Math.abs(dailyChange).toFixed(2)}%
          </div>
          <div className={cn("flex items-center", weeklyChange >= 0 ? "text-green-400" : "text-red-400")}>
            {weeklyChange >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {Math.abs(weeklyChange).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Trade Actions */}
      <div className="grid grid-cols-3 gap-2 my-3">
        <Button className="h-16 flex-col bg-red-500/90 hover:bg-red-500 text-lg">
          SELL <span className="font-mono">{bid.toFixed(4)}</span>
        </Button>
        <div className="flex flex-col items-center justify-center bg-secondary rounded-lg">
          <div className="flex items-center w-full">
            <Button variant="ghost" size="icon" className="flex-1" onClick={() => setQuantity(q => Math.max(0.01, q - 0.1))}>
              <Minus size={16} />
            </Button>
            <div className="text-center">
                <div className="font-bold text-xl">{quantity.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">≈ {(quantity * bid).toFixed(0)} USD</div>
            </div>
            <Button variant="ghost" size="icon" className="flex-1" onClick={() => setQuantity(q => q + 0.1)}>
              <Plus size={16} />
            </Button>
          </div>
        </div>
        <Button className="h-16 flex-col bg-green-500/90 hover:bg-green-500 text-lg">
          BUY <span className="font-mono">{ask.toFixed(4)}</span>
        </Button>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="text-muted-foreground">Advanced Order</Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Info size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleFavoriteToggle}>
            <Star size={18} className={cn(isFavorited && "fill-yellow-400 text-yellow-400")} />
          </Button>
        </div>
      </div>
    </div>
  );
}