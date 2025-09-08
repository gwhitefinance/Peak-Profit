import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbol: string;
  currentPrice?: number;
}

export default function AlertModal({ open, onOpenChange, symbol, currentPrice = 0 }: AlertModalProps) {
  const [condition, setCondition] = useState("Price");
  const [crossing, setCrossing] = useState("Crossing");
  const [value, setValue] = useState(currentPrice.toString());
  const [trigger, setTrigger] = useState("Only Once");
  const [expiration, setExpiration] = useState("September 25, 2025 at 20:21");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("settings");

  const handleCreateAlert = () => {
    // Here you would implement the actual alert creation logic
    console.log("Creating alert:", {
      symbol,
      condition,
      crossing,
      value,
      trigger,
      expiration,
      message
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-background border border-border">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b border-border flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-medium">Create Alert on {symbol}</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
          >
            <X size={16} />
          </Button>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/20 p-0 h-auto">
            <TabsTrigger 
              value="settings" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none py-3"
            >
              Settings
            </TabsTrigger>
            <TabsTrigger 
              value="message" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none py-3"
            >
              Message
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none py-3 relative"
            >
              Notifications
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="p-4 space-y-4 m-0">
            {/* Symbol */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Symbols</label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded border">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium">{symbol}</span>
              </div>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>
              <div className="flex gap-2">
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Price">Price</SelectItem>
                    <SelectItem value="Volume">Volume</SelectItem>
                    <SelectItem value="RSI">RSI</SelectItem>
                    <SelectItem value="MACD">MACD</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={crossing} onValueChange={setCrossing}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Crossing">Crossing</SelectItem>
                    <SelectItem value="Greater than">Greater than</SelectItem>
                    <SelectItem value="Less than">Less than</SelectItem>
                    <SelectItem value="Equal to">Equal to</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Value */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select value="Value" onValueChange={() => {}}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Value">Value</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="flex-1"
                  type="number"
                  step="0.01"
                />
              </div>
            </div>

            {/* Trigger */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trigger</label>
              <div className="flex bg-muted rounded p-1">
                <button
                  onClick={() => setTrigger("Only Once")}
                  className={cn(
                    "flex-1 py-2 px-3 text-sm rounded transition-colors",
                    trigger === "Only Once" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground"
                  )}
                >
                  Only Once
                </button>
                <button
                  onClick={() => setTrigger("Every Time")}
                  className={cn(
                    "flex-1 py-2 px-3 text-sm rounded transition-colors",
                    trigger === "Every Time" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground"
                  )}
                >
                  Every Time
                </button>
              </div>
              {trigger === "Only Once" && (
                <p className="text-xs text-muted-foreground">
                  The alert will only trigger once and will not be repeated
                </p>
              )}
            </div>

            {/* Expiration */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiration</label>
              <Select value={expiration} onValueChange={setExpiration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="September 25, 2025 at 20:21">September 25, 2025 at 20:21</SelectItem>
                  <SelectItem value="1 Day">1 Day</SelectItem>
                  <SelectItem value="1 Week">1 Week</SelectItem>
                  <SelectItem value="1 Month">1 Month</SelectItem>
                  <SelectItem value="Never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="message" className="p-4 space-y-4 m-0">
            <div className="space-y-2">
              <label className="text-sm font-medium">Alert Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 p-3 border border-border rounded resize-none bg-background"
                placeholder="Enter your custom alert message..."
              />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="p-4 space-y-4 m-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email notifications</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Push notifications</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SMS notifications</span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateAlert}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}