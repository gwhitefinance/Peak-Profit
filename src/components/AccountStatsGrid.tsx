// src/components/AccountStatsGrid.tsx
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Target, BarChart } from "lucide-react";

interface AccountStatistics {
  totalPnL: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  bestTrade: number;
  worstTrade: number;
  profitFactor: number;
}

interface AccountStatsGridProps {
  stats: AccountStatistics;
}

export default function AccountStatsGrid({ stats }: AccountStatsGridProps) {
  const formatCurrency = (value: number) => {
    const isPositive = value >= 0;
    return (
      <span className={cn(
        "font-bold",
        isPositive ? "text-green-400" : "text-red-400"
      )}>
        {isPositive ? "+" : ""}${Math.abs(Math.round(value)).toLocaleString()}
      </span>
    );
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const statsData = [
    {
      title: "Total P&L",
      value: formatCurrency(stats.totalPnL),
      icon: <TrendingUp size={20} className="text-primary" />,
      bgClass: "from-blue-500/20 to-blue-600/5"
    },
    {
      title: "Win Rate", 
      value: formatPercentage(stats.winRate),
      icon: <Target size={20} className="text-green-400" />,
      bgClass: "from-green-500/20 to-green-600/5"
    },
    {
      title: "Average Win",
      value: formatCurrency(stats.avgWin),
      icon: <TrendingUp size={20} className="text-green-400" />,
      bgClass: "from-green-500/20 to-green-600/5"
    },
    {
      title: "Average Loss",
      value: formatCurrency(stats.avgLoss),
      icon: <TrendingDown size={20} className="text-red-400" />,
      bgClass: "from-red-500/20 to-red-600/5"
    },
    {
      title: "Total Trades",
      value: stats.totalTrades.toString(),
      icon: <BarChart size={20} className="text-purple-400" />,
      bgClass: "from-purple-500/20 to-purple-600/5"
    },
    {
      title: "Winning Trades",
      value: stats.winningTrades.toString(),
      icon: <TrendingUp size={20} className="text-green-400" />,
      bgClass: "from-green-500/20 to-green-600/5"
    },
    {
      title: "Losing Trades", 
      value: stats.losingTrades.toString(),
      icon: <TrendingDown size={20} className="text-red-400" />,
      bgClass: "from-red-500/20 to-red-600/5"
    },
    {
      title: "Best Trade",
      value: formatCurrency(stats.bestTrade),
      icon: <TrendingUp size={20} className="text-green-400" />,
      bgClass: "from-green-500/20 to-green-600/5"
    },
    {
      title: "Worst Trade",
      value: formatCurrency(stats.worstTrade),
      icon: <TrendingDown size={20} className="text-red-400" />,
      bgClass: "from-red-500/20 to-red-600/5"
    },
    {
      title: "Profit Factor",
      value: stats.profitFactor.toFixed(2),
      icon: <Target size={20} className="text-primary" />,
      bgClass: "from-blue-500/20 to-blue-600/5"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <div 
          key={stat.title}
          className={cn(
            "rounded-lg border border-border bg-card p-4 gradient-border animate-scale-in bg-gradient-to-br",
            stat.bgClass
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            {stat.icon}
          </div>
          
          <div>
            <div className="text-lg font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}