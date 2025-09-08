// src/components/TradingLogs.tsx
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  FileText, 
  Filter, 
  Download, 
  Edit, 
  Tag, 
  Calendar,
  Search,
  ChevronDown,
  MoreHorizontal,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface TradingLog {
  id: number;
  symbol: string;
  entry: number;
  exit: number | null;
  size: number;
  side: 'buy' | 'sell';
  fees: number;
  grossPnl: number;
  netPnl: number;
  holdingTime: string;
  closeReason: 'SL' | 'TP' | 'UR' | null; // Stop Loss, Take Profit, User Request
  tags: string[];
  notes: string;
  entryDate: string;
  exitDate: string | null;
  account: string;
}

interface TradingLogsProps {
  logs: TradingLog[];
}

export default function TradingLogs({ logs }: TradingLogsProps) {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    symbol: '',
    side: '',
    result: '', // win/loss
    reason: '', // SL/TP/UR
    account: ''
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
  const [editingLog, setEditingLog] = useState<TradingLog | null>(null);
  const [newNote, setNewNote] = useState('');
  const [newTags, setNewTags] = useState('');

  // Filter logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesDateRange = (!filters.dateRange.start || log.entryDate >= filters.dateRange.start) &&
                              (!filters.dateRange.end || log.entryDate <= filters.dateRange.end);
      const matchesSymbol = !filters.symbol || log.symbol.toLowerCase().includes(filters.symbol.toLowerCase());
      const matchesSide = !filters.side || log.side === filters.side;
      const matchesResult = !filters.result || 
                           (filters.result === 'win' && log.netPnl > 0) ||
                           (filters.result === 'loss' && log.netPnl < 0);
      const matchesReason = !filters.reason || log.closeReason === filters.reason;
      const matchesAccount = !filters.account || log.account.includes(filters.account);

      return matchesDateRange && matchesSymbol && matchesSide && matchesResult && matchesReason && matchesAccount;
    });
  }, [logs, filters]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalTrades = filteredLogs.length;
    const winningTrades = filteredLogs.filter(log => log.netPnl > 0);
    const losingTrades = filteredLogs.filter(log => log.netPnl < 0);
    const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, log) => sum + log.netPnl, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, log) => sum + log.netPnl, 0) / losingTrades.length) : 0;
    const expectancy = winRate / 100 * avgWin - (1 - winRate / 100) * avgLoss;
    const netPnl = filteredLogs.reduce((sum, log) => sum + log.netPnl, 0);

    return { totalTrades, winRate, avgWin, avgLoss, expectancy, netPnl };
  }, [filteredLogs]);

  const exportToCSV = () => {
    const headers = ['Symbol', 'Entry', 'Exit', 'Size', 'Fees', 'Gross P&L', 'Net P&L', 'Holding Time', 'Close Reason', 'Tags', 'Notes'];
    const csvData = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.symbol,
        log.entry,
        log.exit || '',
        log.size,
        log.fees,
        log.grossPnl,
        log.netPnl,
        log.holdingTime,
        log.closeReason || '',
        log.tags.join(';'),
        `"${log.notes.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBulkTag = (tag: string) => {
    // In a real app, this would update the selected logs with the new tag
    console.log(`Adding tag "${tag}" to logs:`, selectedLogs);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 gradient-border animate-scale-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-primary" />
          <h3 className="font-medium">Trading Logs</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportToCSV} size="sm" variant="outline">
            <Download size={14} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 p-4 bg-secondary/20 rounded-lg">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Date From</label>
          <Input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              dateRange: { ...prev.dateRange, start: e.target.value }
            }))}
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Date To</label>
          <Input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              dateRange: { ...prev.dateRange, end: e.target.value }
            }))}
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Symbol</label>
          <Input
            placeholder="AAPL, TSLA..."
            value={filters.symbol}
            onChange={(e) => setFilters(prev => ({ ...prev, symbol: e.target.value }))}
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Side</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-full justify-between">
                {filters.side || 'All'}
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, side: '' }))}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, side: 'buy' }))}>Buy</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, side: 'sell' }))}>Sell</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Result</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-full justify-between">
                {filters.result || 'All'}
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, result: '' }))}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, result: 'win' }))}>Win</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, result: 'loss' }))}>Loss</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Close Reason</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-full justify-between">
                {filters.reason || 'All'}
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, reason: '' }))}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, reason: 'SL' }))}>Stop Loss</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, reason: 'TP' }))}>Take Profit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, reason: 'UR' }))}>User Request</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{metrics.totalTrades}</div>
          <div className="text-xs text-muted-foreground">Total Trades</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{metrics.winRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Win Rate</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">${metrics.avgWin.toFixed(0)}</div>
          <div className="text-xs text-muted-foreground">Avg Win</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">${metrics.avgLoss.toFixed(0)}</div>
          <div className="text-xs text-muted-foreground">Avg Loss</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">${metrics.expectancy.toFixed(0)}</div>
          <div className="text-xs text-muted-foreground">Expectancy</div>
        </div>
        <div className="text-center">
          <div className={cn(
            "text-lg font-bold",
            metrics.netPnl >= 0 ? "text-green-400" : "text-red-400"
          )}>
            ${metrics.netPnl.toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground">Net P&L</div>
        </div>
      </div>
      
      {/* Trading Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="w-8 px-2 py-3">
                <input
                  type="checkbox"
                  checked={selectedLogs.length > 0 && selectedLogs.length === filteredLogs.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLogs(filteredLogs.map(log => log.id));
                    } else {
                      setSelectedLogs([]);
                    }
                  }}
                  className="rounded"
                />
              </th>
              <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">Symbol</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">Entry</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">Exit</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">Size</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">Fees</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">Gross P&L</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">Net P&L</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground">Time</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground">Reason</th>
              <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">Tags</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-2 py-3">
                  <input
                    type="checkbox"
                    checked={selectedLogs.includes(log.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLogs(prev => [...prev, log.id]);
                      } else {
                        setSelectedLogs(prev => prev.filter(id => id !== log.id));
                      }
                    }}
                    className="rounded"
                  />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{log.symbol}</span>
                    <Badge variant={log.side === 'buy' ? 'default' : 'secondary'} className="text-xs">
                      {log.side?.toUpperCase()}
                    </Badge>
                  </div>
                </td>
                <td className="px-3 py-3 text-right text-sm font-mono">${(log.entry ?? 0).toFixed(2)}</td>
                <td className="px-3 py-3 text-right text-sm font-mono">
                  {log.exit ? `$${log.exit.toFixed(2)}` : '-'}
                </td>
                <td className="px-3 py-3 text-right text-sm">{log.size}</td>
                <td className="px-3 py-3 text-right text-sm text-muted-foreground">${(log.fees ?? 0).toFixed(2)}</td>
                <td className="px-3 py-3 text-right">
                  <span className={cn(
                    "text-sm font-medium",
                    log.grossPnl >= 0 ? "text-green-400" : "text-red-400"
                  )}>
                    ${(log.grossPnl ?? 0).toFixed(0)}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className={cn(
                    "inline-flex items-center text-sm font-medium",
                    log.netPnl >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {log.netPnl >= 0 
                      ? <ArrowUpRight size={12} /> 
                      : <ArrowDownRight size={12} />
                    }
                    <span className="ml-1">${Math.abs(log.netPnl ?? 0).toFixed(0)}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs text-muted-foreground">{log.holdingTime}</td>
                <td className="px-3 py-3 text-center">
                  {log.closeReason && (
                    <Badge variant="outline" className="text-xs">
                      {log.closeReason}
                    </Badge>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(log.tags ?? []).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        setEditingLog(log);
                        setNewNote(log.notes);
                        setNewTags(log.tags.join(', '));
                      }}>
                        <Edit size={12} className="mr-2" />
                        Edit Note/Tags
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions */}
      {selectedLogs.length > 0 && (
        <div className="mt-4 p-3 bg-secondary/30 rounded-lg flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{selectedLogs.length} logs selected</span>
          <Button size="sm" variant="outline" onClick={() => handleBulkTag('Review')}>
            <Tag size={12} className="mr-2" />
            Bulk Tag
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedLogs([])}>
            <X size={12} className="mr-2" />
            Clear Selection
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingLog} onOpenChange={() => setEditingLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note & Tags for {editingLog?.symbol}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add notes about this trade..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="swing, breakout, earnings..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingLog(null)}>Cancel</Button>
              <Button onClick={() => {
                // In a real app, save the changes here
                console.log('Saving changes for log:', editingLog?.id);
                setEditingLog(null);
                setNewNote('');
                setNewTags('');
              }}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}