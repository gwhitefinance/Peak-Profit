// src/components/TradingViewChart.tsx
import { useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

interface TradingViewChartProps {
  symbol?: string;
  timeframe?: string;
  chartStyle: string;
  selectedIndicators: string[];
  onAlertClick: () => void;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

function resolveSymbol(userInput: string): string {
  const upper = userInput.toUpperCase().trim();
  if (!upper) return "NASDAQ:AAPL";
  const explicitMappings: { [key: string]: string } = { 
    "AAPL": "NASDAQ:AAPL", 
    "MSFT": "NASDAQ:MSFT", 
    "GOOGL": "NASDAQ:GOOGL", 
    "AMZN": "NASDAQ:AMZN", 
    "NVDA": "NASDAQ:NVDA", 
    "BTC": "BINANCE:BTCUSDT", 
    "ETH": "BINANCE:ETHUSDT", 
    "SOL": "BINANCE:SOLUSDT", 
    "EURUSD": "FX:EURUSD", 
    "GBPUSD": "FX:GBPUSD", 
    "USDJPY": "FX:USDJPY", 
    "US500": "TVC:SPX", 
    "XAUUSD": "TVC:GOLD" 
  };
  if (explicitMappings[upper]) return explicitMappings[upper];
  return `NASDAQ:${upper}`;
}

export default function TradingViewChart({ 
  symbol = "AAPL", 
  timeframe = "1D",
  chartStyle,
  selectedIndicators,
  onAlertClick 
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  const convertTimeframeToValue = (tf: string): string => {
    const mappings: { [key: string]: string } = { 
      "1m": "1", 
      "5m": "5", 
      "15m": "15", 
      "1h": "60", 
      "4h": "240", 
      "1D": "D", 
      "1W": "W" 
    };
    return mappings[tf] || tf;
  };

  useEffect(() => {
    if (!symbol || !containerRef.current) return;

    const tradingViewSymbol = resolveSymbol(symbol);
    const chartTimeframe = convertTimeframeToValue(timeframe);
    
    const initChart = () => {
      if (!containerRef.current || !window.TradingView) return;
      
      containerRef.current.innerHTML = '';
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
      
      const widgetOptions = {
        autosize: true,
        symbol: tradingViewSymbol,
        interval: chartTimeframe,
        timezone: "Etc/UTC",
        theme: "dark",
        style: chartStyle,
        locale: "en",
        toolbar_bg: "#0a0a0a",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: containerRef.current.id,
        studies: selectedIndicators,
        // More aggressive feature disabling
        disabled_features: [
          "use_localstorage_for_settings",
          "header_widget",
          "header_symbol_search",
          "header_resolutions", 
          "header_chart_type",
          "header_settings",
          "header_indicators",
          "header_compare",
          "header_undo_redo",
          "header_screenshot",
          "header_fullscreen_button",
          "control_bar",
          "timeframes_toolbar",
          "snapshot_trading_drawings",
          "context_menus",
          "main_series_scale_menu",
          "border_around_the_chart",
          "header_saveload",
          "header_layouttabs",
          "left_toolbar",
          "hide_left_toolbar_by_default",
          "chart_property_page_style",
          "property_pages",
          "show_chart_property_page"
        ],
        // Try hiding the toolbar through widget options
        hide_top_toolbar: true,
        hide_legend: false,
        hide_volume: false,
        overrides: {
          "paneProperties.background": "#0a0a0a",
          "paneProperties.backgroundType": "solid",
          "paneProperties.vertGridProperties.color": "rgba(42, 46, 57, 0.2)",
          "paneProperties.horzGridProperties.color": "rgba(42, 46, 57, 0.2)",
          "mainSeriesProperties.candleStyle.upColor": "#26a69a",
          "mainSeriesProperties.candleStyle.downColor": "#ef5350",
        }
      };
      
      widgetRef.current = new window.TradingView.widget(widgetOptions);
    };

    if (!window.TradingView) {
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initChart;
      document.head.appendChild(script);
    } else {
      initChart();
    }
    
    return () => {
      if (widgetRef.current) {
        try { 
          widgetRef.current.remove(); 
        } catch (e) { 
          console.error("Error removing widget:", e); 
        }
        widgetRef.current = null;
      }
    };
  }, [symbol, timeframe, chartStyle, selectedIndicators]);

  return (
    <div className="w-full h-full bg-black relative">
      <ContextMenu>
        <ContextMenuTrigger className="w-full h-full block">
          <div ref={containerRef} id={`tradingview-chart-${symbol}`} className="w-full h-full" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onAlertClick}>
            <Bell size={14} className="mr-2" />
            Add Alert on {symbol}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}