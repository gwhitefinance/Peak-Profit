import { useState } from "react";
import { cn } from "@/lib/utils";
import { X, MoreHorizontal } from "lucide-react";

interface Position {
  id: number;
  instrument: string;
  side: "Buy" | "Sell";
  size: number;
  entry: number;
  stopLoss?: number;
  takeProfit?: number;
  margin: number;
  exposure: number;
  createdAt: string;
  fee: number;
  swaps: number;
  pnl: number;
  positionId: string;
}

interface PositionsPanelProps {
  positions: Position[];
  pendingOrders: Position[];
  closedPositions: Position[];
}

export default function PositionsPanel({ positions, pendingOrders, closedPositions }: PositionsPanelProps) {
  const [activeTab, setActiveTab] = useState<"positions" | "pending" | "closed">("positions");

  const handleClosePosition = (positionId: string) => {
    console.log(`Closing position ${positionId}`);
  };

  const renderPositionRow = (position: Position) => (
    <tr key={position.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-foreground">{position.instrument}</td>
      <td className="px-4 py-3 text-sm">
        <span className={cn(
          "px-2 py-1 rounded text-xs font-medium",
          position.side === "Buy" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        )}>
          {position.side}
        </span>
      </td>
      <td className="px-4 py-3 text-sm font-mono text-foreground">{position.size.toFixed(2)}</td>
      <td className="px-4 py-3 text-sm font-mono text-foreground">{position.entry.toFixed(2)}</td>
      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
        {position.stopLoss ? position.stopLoss.toFixed(2) : "-"}
      </td>
      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
        {position.takeProfit ? position.takeProfit.toFixed(2) : "-"}
      </td>
      <td className="px-4 py-3 text-sm font-mono text-foreground">${position.margin.toFixed(2)}</td>
      <td className="px-4 py-3 text-sm font-mono text-foreground">{position.exposure.toFixed(2)}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{position.createdAt}</td>
      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">${position.fee.toFixed(2)}</td>
      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">${position.swaps.toFixed(2)}</td>
      <td className="px-4 py-3 text-sm font-mono">
        <span className={cn(
          "font-medium",
          position.pnl >= 0 ? "text-green-400" : "text-red-400"
        )}>
          {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">{position.positionId}</td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleClosePosition(position.positionId)}
            className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
            title="Close Position"
          >
            <X size={14} />
          </button>
          <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderContent = () => {
    let data: Position[] = [];
    let emptyMessage = "";

    switch (activeTab) {
      case "positions":
        data = positions;
        emptyMessage = "No open positions";
        break;
      case "pending":
        data = pendingOrders;
        emptyMessage = "No pending orders";
        break;
      case "closed":
        data = closedPositions;
        emptyMessage = "No closed positions";
        break;
    }

    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={14} className="px-4 py-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="text-muted-foreground text-sm">{emptyMessage}</div>
              {activeTab === "positions" && (
                <div className="text-xs text-muted-foreground/70">Start trading to see your positions here</div>
              )}
            </div>
          </td>
        </tr>
      );
    }

    return data.map(renderPositionRow);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Tabs */}
      <div className="flex items-center border-b border-border">
        <button
          onClick={() => setActiveTab("positions")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "positions"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Positions
          <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-secondary text-muted-foreground">
            {positions.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "pending"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Pending
          <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-secondary text-muted-foreground">
            {pendingOrders.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("closed")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "closed"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Closed Positions
        </button>

        {/* Account Summary - moved left */}
        <div className="flex items-center gap-4 text-xs ml-4">
          <div className="text-center">
            <div className="text-muted-foreground">BALANCE</div>
            <div className="font-mono text-foreground">$4,769.04</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">PROFIT & LOSS</div>
            <div className="font-mono text-foreground">$0.00</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">EQUITY</div>
            <div className="font-mono text-foreground">$4,769.04</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">MARGIN USED</div>
            <div className="font-mono text-foreground">$0.00</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">MARGIN AVAILABLE</div>
            <div className="font-mono text-foreground">$4,769.04</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">MARGIN LEVEL</div>
            <div className="font-mono text-foreground">0.00%</div>
          </div>
        </div>
        
        <div className="ml-auto px-4 py-3">
          <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors">
            Close All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-64 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-secondary/20 sticky top-0">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Instrument</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Side</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Size</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Entry / Market</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Stop Loss</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Take Profit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Margin</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Exposure</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Created At (EET)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Fee</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Swaps</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Profit & Loss</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Position ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderContent()}
          </tbody>
        </table>
      </div>
    </div>
  );
}