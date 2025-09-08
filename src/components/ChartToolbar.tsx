// src/components/ChartToolbar.tsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  CandlestickChart, 
  BarChartBig, 
  LineChart, 
  AreaChart, 
  TrendingUp, 
  Bell, 
  Play, 
  Settings, 
  Maximize,
  Activity,
  BarChart3,
  Square,
  Mountain,
  Star,
  Clock,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ChartToolbarProps {
  symbol: string;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  onIndicatorsClick: () => void;
  onAlertClick: () => void;
  onSettingsClick: () => void;
  onFullscreenClick: () => void;
  chartStyle: string;
  onChartStyleChange: (style: string) => void;
}

export default function ChartToolbar({ 
  symbol, 
  timeframe, 
  onTimeframeChange,
  onIndicatorsClick,
  onAlertClick,
  onSettingsClick,
  onFullscreenClick,
  chartStyle,
  onChartStyleChange
}: ChartToolbarProps) {
  const [favoriteTimeframes, setFavoriteTimeframes] = useState<string[]>(["1m", "5m", "15m", "1h", "4h", "1D", "1W"]);
  const [showAllTimeframes, setShowAllTimeframes] = useState(false);
  const chartStyleOptions = [
    // Candle Types
    { id: "1", label: "Candles", icon: <CandlestickChart size={16} />, category: "Candles" },
    { id: "9", label: "Hollow candles", icon: <CandlestickChart size={16} />, category: "Candles" },
    { id: "8", label: "Heikin Ashi", icon: <CandlestickChart size={16} />, category: "Candles" },
    
    // Bar Types  
    { id: "0", label: "Bars", icon: <BarChartBig size={16} />, category: "Bars" },
    { id: "5", label: "Columns", icon: <BarChart3 size={16} />, category: "Bars" },
    { id: "6", label: "High-low", icon: <Activity size={16} />, category: "Bars" },
    
    // Line Types
    { id: "2", label: "Line", icon: <LineChart size={16} />, category: "Line" },
    { id: "7", label: "Line with markers", icon: <LineChart size={16} />, category: "Line" },
    { id: "10", label: "Step line", icon: <LineChart size={16} />, category: "Line" },
    { id: "12", label: "Line break", icon: <LineChart size={16} />, category: "Line" },
    
    // Area Types
    { id: "3", label: "Area", icon: <AreaChart size={16} />, category: "Area" },
    { id: "4", label: "HLC area", icon: <Mountain size={16} />, category: "Area" },
    { id: "11", label: "Baseline", icon: <AreaChart size={16} />, category: "Area" },
    
    // Special Types
    { id: "13", label: "Kagi", icon: <Square size={16} />, category: "Special" },
    { id: "14", label: "Point & figure", icon: <Square size={16} />, category: "Special" },
    { id: "15", label: "Range", icon: <BarChartBig size={16} />, category: "Special" },
    { id: "16", label: "Renko", icon: <Square size={16} />, category: "Special" },
    { id: "17", label: "Volume footprint", icon: <BarChart3 size={16} />, category: "Special" },
  ];
  
  const allTimeframes = [
    { id: "1S", label: "1s", category: "seconds" },
    { id: "5S", label: "5s", category: "seconds" },
    { id: "10S", label: "10s", category: "seconds" },
    { id: "15S", label: "15s", category: "seconds" },
    { id: "30S", label: "30s", category: "seconds" },
    { id: "1m", label: "1m", category: "minutes" },
    { id: "3m", label: "3m", category: "minutes" },
    { id: "5m", label: "5m", category: "minutes" },
    { id: "15m", label: "15m", category: "minutes" },
    { id: "30m", label: "30m", category: "minutes" },
    { id: "1h", label: "1h", category: "hours" },
    { id: "2h", label: "2h", category: "hours" },
    { id: "4h", label: "4h", category: "hours" },
    { id: "6h", label: "6h", category: "hours" },
    { id: "8h", label: "8h", category: "hours" },
    { id: "12h", label: "12h", category: "hours" },
    { id: "1D", label: "1D", category: "daily" },
    { id: "3D", label: "3D", category: "daily" },
    { id: "1W", label: "1W", category: "weekly" },
    { id: "1M", label: "1M", category: "monthly" }
  ];
  
  const displayTimeframes = showAllTimeframes ? allTimeframes.map(tf => tf.id) : favoriteTimeframes;
  
  const toggleFavoriteTimeframe = (tf: string) => {
    setFavoriteTimeframes(prev => 
      prev.includes(tf) 
        ? prev.filter(t => t !== tf)
        : [...prev, tf]
    );
  };
  const CurrentIcon = chartStyleOptions.find(s => s.id === chartStyle)?.icon || <CandlestickChart size={16} />;

  // Group chart styles by category
  const groupedStyles = chartStyleOptions.reduce((acc, style) => {
    if (!acc[style.category]) {
      acc[style.category] = [];
    }
    acc[style.category].push(style);
    return acc;
  }, {} as Record<string, typeof chartStyleOptions>);

  return (
    <div className="flex items-center justify-between p-2 border-b border-border bg-card">
      <div className="flex items-center gap-1">
        <div className="px-2 font-bold text-sm text-foreground">{symbol}</div>
        
        {displayTimeframes.map(tf => (
          <div key={tf} className="relative group">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 px-2 text-xs", timeframe === tf && "bg-accent text-accent-foreground")}
              onClick={() => onTimeframeChange(tf)}
            >
              {tf}
              {favoriteTimeframes.includes(tf) && (
                <Star size={8} className="absolute -top-0.5 -right-0.5 fill-yellow-400 text-yellow-400" />
              )}
            </Button>
            {showAllTimeframes && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-1 -right-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavoriteTimeframe(tf);
                }}
              >
                <Star size={8} className={cn(favoriteTimeframes.includes(tf) ? "fill-yellow-400 text-yellow-400" : "")} />
              </Button>
            )}
          </div>
        ))}
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowAllTimeframes(!showAllTimeframes)}
          title={showAllTimeframes ? "Show favorites only" : "Show all timeframes"}
        >
          {showAllTimeframes ? <Star size={14} /> : <Plus size={14} />}
        </Button>
        
        <div className="h-5 w-px bg-border/50 mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">{CurrentIcon}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 max-h-80 overflow-y-auto">
            {Object.entries(groupedStyles).map(([category, styles], categoryIndex) => (
              <div key={category}>
                {categoryIndex > 0 && <DropdownMenuSeparator />}
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{category}</div>
                {styles.map(style => (
                  <DropdownMenuItem 
                    key={style.id} 
                    onClick={() => onChartStyleChange(style.id)}
                    className={cn(
                      "flex items-center gap-2",
                      chartStyle === style.id && "bg-accent"
                    )}
                  >
                    {style.icon}
                    <span>{style.label}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" className="h-8 px-3" onClick={onIndicatorsClick}>
          <TrendingUp size={14} /><span className="ml-2 text-xs">Indicators</span>
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 px-3" onClick={onAlertClick}>
          <Bell size={14} /><span className="ml-2 text-xs">Alert</span>
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-3">
          <Play size={14} /><span className="ml-2 text-xs">Replay</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSettingsClick}>
          <Settings size={14} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onFullscreenClick}>
          <Maximize size={14} />
        </Button>
      </div>
    </div>
  );
}