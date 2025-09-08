import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

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

interface StockCardProps {
  stock: Stock;
}

export default function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.change >= 0;
  
  const getStrengthColor = (strength: number) => {
    if (strength >= 85) return "bg-green-500";
    if (strength >= 70) return "bg-blue-500";
    return "bg-yellow-500";
  };

  const getStrengthLabelColor = (label: string) => {
    if (label === "Strong") return "text-green-400";
    return "text-yellow-400";
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors">
      {/* Header with symbol, company, price and change */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">{stock.symbol}</h3>
          <p className="text-xs text-muted-foreground">{stock.company}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground mb-1">
            ${stock.price.toFixed(2)}
          </div>
          <div className={cn(
            "flex items-center text-xs font-medium",
            isPositive ? "text-green-500" : "text-red-500"
          )}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            <span className="ml-1">
              {isPositive ? "+" : ""}{stock.change.toFixed(2)} ({isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Strength section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-foreground">Strength</span>
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded border",
            stock.strengthLabel === "Strong" 
              ? "bg-green-500/20 text-green-400 border-green-500/50" 
              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
          )}>
            {stock.strengthLabel}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground">0</span>
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-300", getStrengthColor(stock.strength))}
              style={{ width: `${stock.strength}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">100</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground">{stock.strength}%</span>
        </div>
      </div>

      {/* Volume and Market Cap */}
      <div className="flex justify-between text-xs">
        <div>
          <div className="text-muted-foreground mb-1">Volume</div>
          <div className="font-medium text-foreground">{stock.volume}</div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground mb-1">Market Cap</div>
          <div className="font-medium text-foreground">{stock.marketCap}</div>
        </div>
      </div>
    </div>
  );
}