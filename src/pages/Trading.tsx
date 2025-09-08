// src/pages/Trading.tsx
import { useState, useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "@/components/Sidebar";
import TradingViewChart from "@/components/TradingViewChart";
import TradeLockerWatchlist from "@/components/TradeLockerWatchlist";
import PositionsPanel from "@/components/PositionsPanel";
import ChartToolbar from "@/components/ChartToolbar";
import QuotronTicker from "@/components/QuotronTicker";
import { mockPositions, mockPendingOrders, mockClosedPositions } from "@/lib/mockData";
import { usePolygonWebSocket } from "@/hooks/usePolygonWebSocket";
import { GripHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import AlertManagement from "@/components/AlertManagement";
import IndicatorsModal from "@/components/IndicatorsModal";
import AlertModal from "@/components/AlertModal";
import ChartSettingsModal from "@/components/ChartSettingsModal";

// Define the shape of the chart settings object
interface ChartSettings {
  colorBarsOnPreviousClose: boolean;
  bodyColor: { up: string; down: string };
  borderColor: { up: string; down: string };
  wickColor: { up: string; down: string };
  adjustDataForDividends: boolean;
  session: string;
  precision: string;
  timezone: string;
}

export default function Trading() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [watchlistVisible, setWatchlistVisible] = useState(true);
  const { quotes, subscribeToSymbol, unsubscribeFromSymbol } = usePolygonWebSocket();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [chartStyle, setChartStyle] = useState("1");
  const [showIndicatorsModal, setShowIndicatorsModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [chartSettings, setChartSettings] = useState<ChartSettings>({
    colorBarsOnPreviousClose: false,
    bodyColor: { up: "#26a69a", down: "#ef5350" },
    borderColor: { up: "#26a69a", down: "#ef5350" },
    wickColor: { up: "#26a69a", down: "#ef5350" },
    adjustDataForDividends: true,
    session: "regular",
    precision: "default",
    timezone: "Etc/UTC",
  });

  useEffect(() => {
    subscribeToSymbol(selectedSymbol);
    return () => unsubscribeFromSymbol(selectedSymbol);
  }, [selectedSymbol, subscribeToSymbol, unsubscribeFromSymbol]);

  const handleAddIndicator = (indicator: string) => {
    const indicatorMap: { [key: string]: string } = { "RSI": "RSI@tv-basicstudies", "MACD": "MACD@tv-basicstudies", "Bollinger Bands": "BB@tv-basicstudies", "Volume": "Volume@tv-basicstudies" };
    const formattedIndicator = indicatorMap[indicator] || indicator;
    if (!selectedIndicators.includes(formattedIndicator)) {
      setSelectedIndicators([...selectedIndicators, formattedIndicator]);
    }
    setShowIndicatorsModal(false);
  };

  const handleFullScreen = () => {
    chartContainerRef.current?.requestFullscreen();
  };

  const currentQuote = quotes.get(selectedSymbol);
  const currentPrice = currentQuote?.lastPrice || 0;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        <QuotronTicker />
        <main className="flex-1 overflow-hidden">
          <PanelGroup direction="vertical" className="h-full">
            <Panel defaultSize={75} minSize={50}>
              <div ref={chartContainerRef} className="h-full flex bg-background relative">
                <div className="flex-1 h-full flex flex-col relative">
                  <div className="flex-1 h-full w-full relative">
                    <ChartToolbar 
                      symbol={selectedSymbol}
                      timeframe={selectedTimeframe}
                      onTimeframeChange={setSelectedTimeframe}
                      onIndicatorsClick={() => setShowIndicatorsModal(true)}
                      onAlertClick={() => setShowAlertModal(true)}
                      onSettingsClick={() => setShowSettingsModal(true)}
                      onFullscreenClick={handleFullScreen}
                      chartStyle={chartStyle}
                      onChartStyleChange={setChartStyle}
                    />
                    <TradingViewChart 
                      symbol={selectedSymbol}
                      timeframe={selectedTimeframe}
                      chartStyle={chartStyle}
                      selectedIndicators={selectedIndicators}
                      onAlertClick={() => setShowAlertModal(true)}
                     
                    />
                  </div>
                  {/* Hide Watchlist Toggle Button - TradingView Style */}
                  <button
                    onClick={() => setWatchlistVisible(!watchlistVisible)}
                    className="absolute bottom-4 right-2 bg-card border border-border rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shadow-sm z-10"
                    title={watchlistVisible ? "Hide watchlist" : "Show watchlist"}
                  >
                    {watchlistVisible ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                  </button>
                </div>
                {watchlistVisible && (
                  <div className="w-1/4 h-full max-w-[320px] min-w-[280px] border-l border-border transition-all duration-200">
                    <TradeLockerWatchlist onSelectSymbol={setSelectedSymbol} />
                  </div>
                )}
              </div>
            </Panel>
            <PanelResizeHandle className="group relative">
              <div className="h-1 bg-border/30 hover:bg-primary/50 transition-all duration-200 flex items-center justify-center cursor-row-resize">
                <div className="flex items-center justify-center w-12 h-0.5 bg-border/50 rounded-full group-hover:bg-primary/70 group-hover:h-1 transition-all duration-200">
                  <GripHorizontal size={10} className="text-muted-foreground/30 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </PanelResizeHandle>
            <Panel defaultSize={25} minSize={15}>
              <div className="h-full bg-background border-t border-border/30">
                <PositionsPanel positions={mockPositions} pendingOrders={mockPendingOrders} closedPositions={mockClosedPositions} />
              </div>
            </Panel>
          </PanelGroup>
        </main>
      </div>
      <IndicatorsModal open={showIndicatorsModal} onOpenChange={setShowIndicatorsModal} onAddIndicator={handleAddIndicator} />
      <AlertModal open={showAlertModal} onOpenChange={setShowAlertModal} symbol={selectedSymbol} currentPrice={currentPrice} />
      <ChartSettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
        settings={chartSettings}
        onSettingsChange={setChartSettings}
      />
    </div>
  );
}