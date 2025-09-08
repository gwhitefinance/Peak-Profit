import { useState } from "react";
import { Search, Plus } from "lucide-react";
import StockCard from "@/components/StockCard";

interface Stock {
  id: number;
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  strength: number;
  strengthLabel: string;
  volume: string;
  marketCap: string;
}

interface WatchlistGridProps {
  stocks: Stock[];
}

export default function WatchlistGrid({ stocks }: WatchlistGridProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStock = () => {
    // Handle add stock logic here
    console.log("Add stock clicked");
  };

  return (
    <div className="space-y-6">
      {/* Search Bar and Add Stock Button */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm"
          />
        </div>
        
        <button
          onClick={handleAddStock}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Add Stock
        </button>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStocks.map((stock) => (
          <StockCard key={stock.id} stock={stock} />
        ))}
      </div>

      {/* Empty state */}
      {filteredStocks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No stocks found matching your search.</p>
        </div>
      )}
    </div>
  );
}