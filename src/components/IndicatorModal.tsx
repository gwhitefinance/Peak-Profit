// src/pages/Trading.tsx
import { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "@/components/Sidebar";
import TradingViewChart from "@/components/TradingViewChart";
import TradeLockerWatchlist from "@/components/TradeLockerWatchlist";
import PositionsPanel from "@/components/PositionsPanel";
import LiveTradeTicker from "@/components/LiveTradeTicker";
import { mockPositions, mockPendingOrders, mockClosedPositions } from "@/lib/mockData";
import { usePolygonWebSocket } from "@/hooks/usePolygonWebSocket";
import { GripHorizontal } from "lucide-react";
import AlertModal from "@/components/AlertModal"; // Keep for right-click context menu

export default function Trading() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const { subscribeToSymbol, unsubscribeFromSymbol, quotes } = usePolygonWebSocket();

  useEffect(() => {
    subscribeToSymbol(selectedSymbol);
    return () => {
      unsubscribeFromSymbol(selectedSymbol);
    };
  }, [selectedSymbol, subscribeToSymbol, unsubscribeFromSymbol]);

  const currentQuote = quotes.get(selectedSymbol);
  const currentPrice = currentQuote?.lastPrice || 0;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        <LiveTradeTicker />
        
        <main className="flex-1 overflow-hidden">
          <PanelGroup direction="vertical" className="h-full">
            {/* Top Section: Chart + Instruments */}
            <Panel defaultSize={75} minSize={50}>
              <div className="h-full flex bg-background">
                {/* Chart Area */}
                <div className="flex-1 h-full">
                  <TradingViewChart 
                    symbol={selectedSymbol}
                    onAlertClick={() => setShowAlertModal(true)}
                  />
                </div>
                
                {/* TradeLocker Style Watchlist */}
                <div className="w-1/4 h-full max-w-[320px] min-w-[280px] border-l border-border">
                  <TradeLockerWatchlist 
                    onSelectSymbol={setSelectedSymbol}
                  />
                </div>
              </div>
            </Panel>

            {/* Resizable Handle */}
            <PanelResizeHandle className="group relative">
              <div className="h-1 bg-border/30 hover:bg-primary/50 transition-all duration-200 flex items-center justify-center cursor-row-resize">
                <div className="flex items-center justify-center w-12 h-0.5 bg-border/50 rounded-full group-hover:bg-primary/70 group-hover:h-1 transition-all duration-200">
                  <GripHorizontal size={10} className="text-muted-foreground/30 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </PanelResizeHandle>

            {/* Bottom Section: Positions Panel */}
            <Panel defaultSize={25} minSize={15}>
              <div className="h-full bg-background border-t border-border/30">
                <PositionsPanel 
                  positions={mockPositions}
                  pendingOrders={mockPendingOrders}
                  closedPositions={mockClosedPositions}
                />
              </div>
            </Panel>
          </PanelGroup>
        </main>
      </div>
      
      {/* This modal is now only used for the right-click context menu */}
      <AlertModal 
        open={showAlertModal}
        onOpenChange={setShowAlertModal}
        symbol={selectedSymbol}
        currentPrice={currentPrice}
      />
    </div>
  );
}