// src/components/AlertManagement.tsx
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  BellRing, 
  X, 
  Edit, 
  Pause, 
  Play, 
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'line' | 'indicator';
  condition: 'above' | 'below' | 'crosses';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  isTriggered: boolean;
  createdAt: string;
  expiresAt: string | null;
  message: string;
  drawingLineId?: string;
  triggerCount: number;
}

interface AlertManagementProps {
  alerts: Alert[];
  onEditAlert: (alert: Alert) => void;
  onDeleteAlert: (alertId: string) => void;
  onToggleAlert: (alertId: string) => void;
  className?: string;
}

export default function AlertManagement({ 
  alerts, 
  onEditAlert, 
  onDeleteAlert, 
  onToggleAlert,
  className 
}: AlertManagementProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'triggered'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'price' | 'symbol'>('created');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return alert.isActive && !alert.isTriggered;
    if (filter === 'triggered') return alert.isTriggered;
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.targetPrice - b.targetPrice;
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      case 'created':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const activeAlerts = alerts.filter(a => a.isActive && !a.isTriggered).length;
  const triggeredAlerts = alerts.filter(a => a.isTriggered).length;

  const handleAlertAction = (action: string, alertId: string) => {
    switch (action) {
      case 'toggle':
        onToggleAlert(alertId);
        break;
      case 'delete':
        onDeleteAlert(alertId);
        toast.success('Alert deleted');
        break;
      case 'edit':
        const alert = alerts.find(a => a.id === alertId);
        if (alert) onEditAlert(alert);
        break;
    }
  };

  const getAlertIcon = (alert: Alert) => {
    if (alert.isTriggered) return <BellRing size={14} className="text-orange-400" />;
    if (!alert.isActive) return <Bell size={14} className="text-muted-foreground" />;
    
    switch (alert.condition) {
      case 'above': return <TrendingUp size={14} className="text-green-400" />;
      case 'below': return <TrendingDown size={14} className="text-red-400" />;
      case 'crosses': return <Activity size={14} className="text-blue-400" />;
      default: return <Bell size={14} className="text-primary" />;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={cn("bg-card border border-border rounded-lg", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-primary" />
            <h3 className="font-semibold">Price Alerts</h3>
            <Badge variant="secondary" className="text-xs">
              {alerts.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={activeAlerts > 0 ? "default" : "secondary"} className="text-xs">
              {activeAlerts} Active
            </Badge>
            {triggeredAlerts > 0 && (
              <Badge variant="destructive" className="text-xs">
                {triggeredAlerts} Triggered
              </Badge>
            )}
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-secondary/50 p-1 rounded">
            {['all', 'active', 'triggered'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption as any)}
                className={cn(
                  "px-3 py-1 text-xs rounded transition-colors capitalize",
                  filter === filterOption 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filterOption}
              </button>
            ))}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                Sort: {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('created')}>
                By Created Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('price')}>
                By Target Price
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('symbol')}>
                By Symbol
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Alerts List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts found</p>
            <p className="text-xs">Right-click on the chart to create your first alert</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-accent/30 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getAlertIcon(alert)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{alert.symbol}</span>
                        <Badge 
                          variant={alert.isTriggered ? "destructive" : alert.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {alert.isTriggered ? "Triggered" : alert.isActive ? "Active" : "Paused"}
                        </Badge>
                        {alert.type === 'line' && (
                          <Badge variant="outline" className="text-xs">
                            Line Alert
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        Alert when price {alert.condition} ${alert.targetPrice.toFixed(2)}
                        <span className="text-xs ml-2">
                          (Current: ${alert.currentPrice.toFixed(2)})
                        </span>
                      </div>
                      
                      {alert.message && (
                        <div className="text-xs text-muted-foreground italic truncate">
                          "{alert.message}"
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Created {formatTimeAgo(alert.createdAt)}</span>
                        {alert.triggerCount > 0 && (
                          <span>Triggered {alert.triggerCount}x</span>
                        )}
                        {alert.expiresAt && (
                          <span>Expires {formatTimeAgo(alert.expiresAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAlertAction('toggle', alert.id)}
                      title={alert.isActive ? "Pause Alert" : "Resume Alert"}
                      className="h-6 w-6 p-0"
                    >
                      {alert.isActive ? <Pause size={12} /> : <Play size={12} />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAlertAction('edit', alert.id)}
                      title="Edit Alert"
                      className="h-6 w-6 p-0"
                    >
                      <Edit size={12} />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAlertAction('delete', alert.id)}
                      title="Delete Alert"
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {alerts.length > 0 && (
        <div className="p-4 border-t border-border bg-secondary/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{filteredAlerts.length} of {alerts.length} alerts shown</span>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => alerts.filter(a => a.isTriggered).forEach(a => onDeleteAlert(a.id))}
                className="text-xs"
                disabled={triggeredAlerts === 0}
              >
                Clear Triggered
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}