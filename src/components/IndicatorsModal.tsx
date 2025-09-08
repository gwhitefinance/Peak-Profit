// src/components/IndicatorsModal.tsx
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, User, TrendingUp, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndicatorsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddIndicator: (indicator: string) => void;
}

const indicatorCategories = {
  Technicals: [ "Accumulation/Distribution", "Aroon", "Average True Range", "Awesome Oscillator", "Bollinger Bands", "Chaikin Money Flow", "Ichimoku Cloud", "MACD", "Momentum", "Moving Average", "Parabolic SAR", "RSI", "Stochastic", "Volume", "Williams %R" ],
  Financials: [ "Revenue", "Gross Profit", "Net Income", "EBITDA", "Total Assets", "Total Debt", "Free Cash Flow", "Price to Earnings (P/E)", "Price to Sales (P/S)", "Price to Book (P/B)", "Dividend Yield" ],
  Personal: [],
  Community: [],
};

const categoryIcons = {
  Personal: User,
  Technicals: TrendingUp,
  Financials: DollarSign,
  Community: Users,
};

export default function IndicatorsModal({ open, onOpenChange, onAddIndicator }: IndicatorsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Technicals");

  const filteredIndicators = indicatorCategories[selectedCategory as keyof typeof indicatorCategories].filter(
    (indicator) => indicator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[70vh] p-0 bg-[#1e222d] border border-border">
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-56 border-r border-border flex flex-col">
            <div className="p-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 bg-[#2a2e39] border-border/50 focus:bg-[#1e222d]"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {Object.keys(categoryIcons).map((category) => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons];
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left",
                        selectedCategory === category
                          ? "bg-blue-500/20 text-blue-300"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <Icon size={18} />
                      {category}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <div className="flex items-center text-sm">
                {/* Tabs */}
                <button className="px-3 py-2 border-b-2 border-blue-500 text-white">Indicators</button>
                <button className="px-3 py-2 border-b-2 border-transparent text-gray-400 hover:text-white">Strategies</button>
                <button className="px-3 py-2 border-b-2 border-transparent text-gray-400 hover:text-white">Profiles</button>
                <button className="px-3 py-2 border-b-2 border-transparent text-gray-400 hover:text-white">Patterns</button>
              </div>
            </div>
            <div className="px-4 py-2 border-b border-border">
              <p className="text-xs font-semibold text-gray-500">SCRIPT NAME</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredIndicators.map((indicator) => (
                  <div
                    key={indicator}
                    onClick={() => onAddIndicator(indicator)}
                    className="w-full text-left px-4 py-2.5 text-sm rounded hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {indicator}
                  </div>
                ))}
                {filteredIndicators.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No results for "{searchTerm}"
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}