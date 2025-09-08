// src/components/QuickTradePanel.tsx
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Shield,
  Calculator,
  Zap,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface QuickTradePanelProps {
  symbol: string;
  currentPrice: number;
  onTrade: (order: TradeOrder) => void;
  className?: string;
}

interface TradeOrder {
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  orderType: 'market' | 'limit';
  stopLoss?: number;
  takeProfit?: number;
}

export default function QuickTradePanel({ 
  symbol, 
  currentPrice, 
  onTrade, 
  className 
}: QuickTradePanelProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState<number>(100);
  const [limitPrice, setLimitPrice] = useState<number>(currentPrice);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [takeProfit, setTakeProfit] = useState<number>(0);
  const [accountBalance] = useState<number>(10000);
  const [leverage, setLeverage] = useState<number>(1);

  useEffect(() => {
    setLimitPrice(currentPrice);
  }, [currentPrice]);

  useEffect(() => {
    // Global keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleQuickTrade('buy');
            break;
          case 's':
            e.preventDefault();
            handleQuickTrade('sell');
            break;
          case 'm':
            e.preventDefault();
            setOrderType('market');
            break;
          case 'l':
            e.preventDefault();
            setOrderType('limit');
            break;
        }
      }
      // Quick quantity shortcuts
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setQuantity(100);
            break;
          case '2':
            e.preventDefault();
            setQuantity(500);
            break;
          case '3':
            e.preventDefault();
            setQuantity(1000);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [quantity, limitPrice, stopLoss, takeProfit]);

  const handleQuickTrade = async (side: 'buy' | 'sell') => {
    const order: TradeOrder = {
      symbol,
      side,
      quantity,
      price: orderType === 'market' ? currentPrice : limitPrice,
      orderType,
      stopLoss: stopLoss > 0 ? stopLoss : undefined,
      takeProfit: takeProfit > 0 ? takeProfit : undefined,
    };

    try {
      await onTrade(order);
      
      toast.success(
        `${side.toUpperCase()} order submitted: ${quantity} shares of ${symbol} ${orderType === 'market' ? 'at market' : `at $${limitPrice.toFixed(2)}`}`,
        {
          description: `Position value: $${(quantity * (orderType === 'market' ? currentPrice : limitPrice)).toFixed(2)}`,
          duration: 3000,
        }
      );
    } catch (error) {
      toast.error(`Failed to submit ${side} order: ${error}`);
    }
  };

  const calculatePositionValue = () => {
    return quantity * (orderType === 'market' ? currentPrice : limitPrice) * leverage;
  };

  const calculateMargin = () => {
    return calculatePositionValue() / leverage;
  };

  const calculateRiskReward = () => {
    if (!stopLoss || !takeProfit) return null;
    const entryPrice = orderType === 'market' ? currentPrice : limitPrice;
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(takeProfit - entryPrice);
    return reward / risk;
  };

  const riskReward = calculateRiskReward();

  return (
    <div className={cn("bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 w-72 shadow-lg", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Zap size={14} className="text-primary" />
          Quick Trade
        </h3>
        <div className="text-xs text-muted-foreground font-mono">
          {symbol} • ${currentPrice.toFixed(2)}
        </div>
      </div>

      <div className="space-y-3">
        {/* Order Type */}
        <div className="flex bg-secondary/50 p-1 rounded">
          <button
            onClick={() => setOrderType('market')}
            className={cn(
              "flex-1 py-1.5 px-2 text-xs rounded transition-colors font-medium",
              orderType === 'market' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('limit')}
            className={cn(
              "flex-1 py-1.5 px-2 text-xs rounded transition-colors font-medium",
              orderType === 'limit' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Limit
          </button>
        </div>

        {/* Quantity */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Quantity</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-7 text-sm"
              min="1"
            />
          </div>
          
          {orderType === 'limit' && (
            <div className="space-y-1">
              <Label className="text-xs">Limit Price</Label>
              <Input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(Number(e.target.value))}
                className="h-7 text-sm"
                step="0.01"
              />
            </div>
          )}
        </div>

        {/* Quick Quantity Buttons */}
        <div className="flex gap-1">
          {[100, 500, 1000].map((qty) => (
            <Button
              key={qty}
              size="sm"
              variant="outline"
              onClick={() => setQuantity(qty)}
              className="h-6 px-2 text-xs flex-1"
            >
              {qty}
            </Button>
          ))}
        </div>

        {/* Stop Loss & Take Profit */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Shield size={10} />
              Stop Loss
            </Label>
            <Input
              type="number"
              value={stopLoss || ''}
              onChange={(e) => setStopLoss(Number(e.target.value))}
              placeholder="0.00"
              className="h-7 text-sm"
              step="0.01"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Target size={10} />
              Take Profit
            </Label>
            <Input
              type="number"
              value={takeProfit || ''}
              onChange={(e) => setTakeProfit(Number(e.target.value))}
              placeholder="0.00"
              className="h-7 text-sm"
              step="0.01"
            />
          </div>
        </div>

        {/* Position Summary */}
        <div className="bg-secondary/30 p-2 rounded space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Position Value:</span>
            <span className="font-mono">${calculatePositionValue().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Margin Required:</span>
            <span className="font-mono">${calculateMargin().toFixed(2)}</span>
          </div>
          {riskReward && (
            <div className="flex justify-between">
              <span>Risk:Reward:</span>
              <span className={cn(
                "font-mono",
                riskReward >= 2 ? "text-green-400" : riskReward >= 1 ? "text-yellow-400" : "text-red-400"
              )}>
                1:{riskReward.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Buy & Sell Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleQuickTrade('buy')}
            className="bg-green-600 hover:bg-green-700 text-white h-9 text-sm font-semibold"
            data-testid="button-buy"
          >
            <TrendingUp size={14} className="mr-1" />
            Buy
          </Button>
          <Button
            onClick={() => handleQuickTrade('sell')}
            className="bg-red-600 hover:bg-red-700 text-white h-9 text-sm font-semibold"
            data-testid="button-sell"
          >
            <TrendingDown size={14} className="mr-1" />
            Sell
          </Button>
        </div>

        {/* Hotkey Hints */}
        <div className="pt-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground space-y-0.5">
            <div>⌘+B (Buy) • ⌘+S (Sell) • ⌘+M (Market) • ⌘+L (Limit)</div>
            <div>Alt+1/2/3 (Quick Quantities)</div>
          </div>
        </div>
      </div>
    </div>
  );
}