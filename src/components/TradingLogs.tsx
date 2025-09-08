// src/components/TradingLogs.tsx
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, FileText } from "lucide-react";

interface TradingLog {
  id: number;
  date: string;
  type: string;
  size: string;
  entryPrice: number;
  status: string;
  pnl: number;
}

interface TradingLogsProps {
  logs: TradingLog[];
}

export default function TradingLogs({ logs }: TradingLogsProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 gradient-border animate-scale-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center gap-2 mb-4">
        <FileText size={16} className="text-primary" />
        <h3 className="font-medium">Trading Logs</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Size</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Entry Price</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 text-sm">{log.date}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    log.type === "Buy" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {log.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{log.size}</td>
                <td className="px-4 py-3 text-sm text-right">${log.entryPrice.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    log.status === "Open" 
                      ? "bg-blue-500/20 text-blue-400" 
                      : "bg-gray-500/20 text-gray-400"
                  )}>
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className={cn(
                    "inline-flex items-center text-sm font-medium",
                    log.pnl >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {log.pnl >= 0 
                      ? <ArrowUpRight size={14} /> 
                      : <ArrowDownRight size={14} />
                    }
                    <span className="ml-1">${Math.abs(Math.round(log.pnl))}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}