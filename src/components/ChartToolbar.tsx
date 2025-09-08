// src/components/ChartToolbar.tsx
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
  Mountain
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
  
  const timeframes = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"];
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
        
        {timeframes.map(tf => (
          <Button
            key={tf}
            variant="ghost"
            size="sm"
            className={cn("h-8 px-2 text-xs", timeframe === tf && "bg-accent text-accent-foreground")}
            onClick={() => onTimeframeChange(tf)}
          >
            {tf}
          </Button>
        ))}
        
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