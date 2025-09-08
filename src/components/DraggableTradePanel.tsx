import { useState } from "react";
import Draggable from "react-draggable";
import { useDraggablePanelStore } from "@/hooks/UseDraggablePanelStore";
import { Star, MoreHorizontal, Maximize2, X, CandlestickChart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";
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

export default function DraggableTradePanel() {
  const { isOpen, instrument, quote, closePanel } = useDraggablePanelStore();
  const [quantity, setQuantity] = useState(1.00);
  const { addToWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlist();

  if (!isOpen || !instrument) return null;

  const { symbol, name, daily } = instrument;
  const bid = quote?.bid || instrument?.low || 0;
  const ask = quote?.ask || instrument?.high || 0;
  const dailyChange = quote?.changePercent || daily || 0;
  const isFavorited = isInWatchlist(symbol);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorited) {
      removeFromWatchlist(symbol);
      toast.success(`${symbol} removed from watchlist`);
    } else {
      addToWatchlist(symbol, { name });
      toast.success(`${symbol} added to watchlist`);
    }
  };

  return (
    <Draggable handle=".drag-handle" defaultPosition={{x: 100, y: 100}}>
      <div className="fixed top-0 left-0 bg-secondary rounded-lg shadow-2xl border border-border/50 w-[340px] z-50">
        <div className="p-2 bg-card rounded-lg">
            <div className="drag-handle flex items-center justify-between p-2 cursor-move">
                <div className="flex items-center space-x-2">
                    <div className="w-7 h-5 rounded-sm bg-background flex items-center justify-center text-lg font-bold">{getSymbolIcon(symbol)}</div>
                    <span className="text-base font-bold">{symbol}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <button onClick={handleFavoriteToggle}><Star size={20} className={cn(isFavorited && "fill-yellow-400 text-yellow-400")} /></button>
                    <MoreHorizontal size={20} />
                    <button onClick={closePanel}><X size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
                <button className="bg-[#ef5350]/20 hover:bg-[#ef5350]/30 text-white font-bold py-3 px-4 rounded-md text-center border border-[#ef5350]">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground">Sell</span>
                        <span className="text-muted-foreground">{dailyChange.toFixed(2)}%</span>
                    </div>
                    <span className="block text-2xl font-semibold mt-0.5">{bid.toFixed(5)}</span>
                </button>
                <button className="bg-[#26a69a]/20 hover:bg-[#26a69a]/30 text-white font-bold py-3 px-4 rounded-md text-center border border-[#26a69a]">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground">Buy</span>
                        <span className="text-muted-foreground">{dailyChange.toFixed(2)}%</span>
                    </div>
                    <span className="block text-2xl font-semibold mt-0.5">{ask.toFixed(5)}</span>
                </button>
            </div>

            <div className="mt-4 flex items-center justify-between bg-card rounded-md p-1">
                <Button variant="ghost" className="text-muted-foreground p-3 rounded-md" onClick={() => setQuantity(q => Math.max(0.01, q - 0.01))}>
                    <Minus size={16} />
                </Button>
                <div className="text-center">
                    <span className="text-lg font-semibold">{quantity.toFixed(2)}</span>
                    <div className="text-xs text-muted-foreground">Lot</div>
                </div>
                <Button variant="ghost" className="text-muted-foreground p-3 rounded-md" onClick={() => setQuantity(q => q + 0.01)}>
                    <Plus size={16} />
                </Button>
            </div>
        </div>
      </div>
    </Draggable>
  );
}