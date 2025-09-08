// src/components/TradeLockerWatchlist.tsx
import { useState, useEffect, useCallback, useMemo, Dispatch, SetStateAction } from "react";
import { Search, Star, Flame, ArrowUp, ArrowDown, TrendingUp, Bitcoin, DollarSign, BarChart3, Zap, Info, Plus, Minus, LayoutGrid, Triangle, MoreHorizontal, CandlestickChart, Clock, Settings, Clock4, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePolygonWebSocket } from "@/hooks/usePolygonWebSocket";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useWatchlist } from "@/hooks/useWatchlist";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useDraggablePanelStore } from "@/hooks/UseDraggablePanelStore";


interface TradeLockerWatchlistProps {
  onSelectSymbol?: (symbol: string | null) => void;
  selectedSymbol?: string | null;
}

const getSymbolIcon = (symbol: string) => {
    const lowerSymbol = symbol.toLowerCase();
    if (lowerSymbol.includes('btc')) return <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025" alt="BTC" className="w-4 h-4" />;
    if (lowerSymbol.includes('eth')) return <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025" alt="ETH" className="w-4 h-4" />;
    if (lowerSymbol.includes('etc')) return <img src="https://cryptologos.cc/logos/ethereum-classic-etc-logo.svg?v=025" alt="ETC" className="w-4 h-4" />;
    if (lowerSymbol.includes('xrp')) return <img src="https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=025" alt="XRP" className="w-4 h-4" />;
    if (lowerSymbol.includes('eur')) return '🇪🇺';
    if (lowerSymbol.includes('gbp')) return '🇬🇧';
    if (lowerSymbol.includes('usd')) return '🇺🇸';
    if (lowerSymbol.includes('jpy')) return '🇯🇵';
    if (lowerSymbol.includes('xau')) return '🪙';
    if (lowerSymbol.includes('xag')) return '🥈';
    if (lowerSymbol.startsWith('us30')) return '🇺🇸';
    if (lowerSymbol.startsWith('us100')) return '🇺🇸';
    if (lowerSymbol.startsWith('us500')) return '🇺🇸';
    return symbol.charAt(0);
};

const instrumentCategories = {
  "U.S. Stocks & ETFs": [
    { symbol: "SPY", name: "S&P 500" }, { symbol: "QQQ", name: "Nasdaq 100" }, { symbol: "AAPL", name: "Apple" },
    { symbol: "MSFT", name: "Microsoft" }, { symbol: "NVDA", name: "NVIDIA" }, { symbol: "AMZN", name: "Amazon" },
    { symbol: "META", name: "Meta Platforms" }, { symbol: "GOOGL", name: "Alphabet" }, { symbol: "TSLA", name: "Tesla" },
    { symbol: "NFLX", name: "Netflix" }, { symbol: "AMD", name: "Advanced Micro Devices" }, { symbol: "JPM", name: "JPMorgan" },
    { symbol: "BAC", name: "Bank of America" }, { symbol: "BA", name: "Boeing" }, { symbol: "COIN", name: "Coinbase" }
  ],
  "Cryptocurrencies": [
    { symbol: "BTC", name: "Bitcoin" }, { symbol: "ETH", name: "Ethereum" }, { symbol: "SOL", name: "Solana" },
    { symbol: "ADA", name: "Cardano" }, { symbol: "BNB", name: "Binance Coin" }, { symbol: "XRP", name: "Ripple" },
    { symbol: "LTC", name: "Litecoin" }, { symbol: "UNI", name: "Uniswap" }, { symbol: "AAVE", name: "Aave" },
    { symbol: "LINK", name: "Chainlink" }, { symbol: "MATIC", name: "Polygon" }, { symbol: "DOGE", name: "Dogecoin" },
    { symbol: "SHIB", name: "Shiba Inu" }, { symbol: "WIF", name: "Dogwifhat" }, { symbol: "PEPE", name: "Pepe" }
  ],
  "Forex Pairs": [
    { symbol: "EURUSD", name: "Euro / US Dollar" }, { symbol: "GBPUSD", name: "British Pound / US Dollar" },
    { symbol: "USDJPY", name: "US Dollar / Japanese Yen" }, { symbol: "AUDUSD", name: "Australian Dollar / US Dollar" },
    { symbol: "NZDUSD", name: "New Zealand Dollar / US Dollar" }, { symbol: "USDCAD", name: "US Dollar / Canadian Dollar" },
    { symbol: "USDCHF", name: "US Dollar / Swiss Franc" }, { symbol: "EURJPY", name: "Euro / Japanese Yen" },
    { symbol: "GBPJPY", name: "British Pound / Japanese Yen" }, { symbol: "USDTRY", name: "US Dollar / Turkish Lira" }
  ],
  "Indices": [
    { symbol: "US30", name: "Dow Jones 30" }, { symbol: "US100", name: "Nasdaq 100" }, { symbol: "US500", name: "S&P 500" },
    { symbol: "DAX40", name: "Germany DAX 40" }, { symbol: "FTSE100", name: "UK FTSE 100" }
  ],
  "Commodities": [
    { symbol: "XAUUSD", name: "Gold" }, { symbol: "XAGUSD", name: "Silver" }, { symbol: "WTI", name: "Crude Oil" },
    { symbol: "BRENT", name: "Brent Oil" }, { symbol: "NGAS", name: "Natural Gas" }
  ]
};

const categoryIcons = {
  "U.S. Stocks & ETFs": TrendingUp,
  "Cryptocurrencies": Bitcoin,
  "Forex Pairs": DollarSign,
  "Indices": BarChart3,
  "Commodities": Zap
};

const mockInstrumentData = Object.values(instrumentCategories).flat().map(inst => ({
    ...inst,
    high: Math.random() * 100 + 100,
    low: Math.random() * 50 + 50,
    daily: (Math.random() - 0.5) * 5,
    weekly: (Math.random() - 0.5) * 10,
    monthly: (Math.random() - 0.5) * 20,
}));

const topMoversData = [...mockInstrumentData].sort((a, b) => Math.abs(b.daily) - Math.abs(a.daily));

const ChangeIndicator = ({ value }: { value: number }) => (
    <div className={cn("flex items-center text-xs font-medium", value >= 0 ? "text-green-400" : "text-red-400")}>
      <Triangle size={6} className={cn("mr-1 fill-current", value < 0 && "rotate-180")} />
      {Math.abs(value).toFixed(2)}%
    </div>
);

interface ExpandedTradePanelProps {
  instrument: any;
  quote: any;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>; 
  onExpand: () => void;
}

const ExpandedTradePanel = ({ instrument, quote, quantity, setQuantity, onExpand }: ExpandedTradePanelProps) => {
    const { addToWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlist();
    
    const name = instrument?.name || quote?.symbol;
    const bid = quote?.bid || instrument?.low || 0;
    const ask = quote?.ask || instrument?.high || 0;
    const dailyChange = quote?.changePercent || instrument?.daily || 0;
    const isFavorited = isInWatchlist(instrument.symbol);
    const usdValue = (quantity * bid * 100000).toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });


    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFavorited) {
        removeFromWatchlist(instrument.symbol);
        toast.success(`${instrument.symbol} removed from watchlist`);
        } else {
        addToWatchlist(instrument.symbol, { name });
        toast.success(`${instrument.symbol} added to watchlist`);
        }
    };

    return (
        <div className="p-2 bg-secondary rounded-lg">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                    <div className="w-7 h-5 rounded-sm bg-background flex items-center justify-center text-lg font-bold">{getSymbolIcon(instrument.symbol)}</div>
                    <span className="text-base font-bold">{instrument.symbol}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <button onClick={onExpand}><Maximize2 size={16} /></button>
                    <button onClick={handleFavoriteToggle}><Star size={16} className={cn(isFavorited && "fill-yellow-400 text-yellow-400")} /></button>
                    <MoreHorizontal size={16} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2">
                <button className="bg-[#1C242C] hover:bg-[#1C242C]/80 text-white font-bold py-1.5 px-2 rounded-md text-center border border-[#ef5350]">
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span>Sell</span>
                        <span className={cn(dailyChange >= 0 ? "text-green-400" : "text-red-400")}>{dailyChange.toFixed(2)}%</span>
                    </div>
                    <span className="block text-lg font-bold">{bid.toFixed(5)}</span>
                </button>
                <button className="bg-[#1C242C] hover:bg-[#1C242C]/80 text-white font-bold py-1.5 px-2 rounded-md text-center border border-[#26a69a]">
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span>Buy</span>
                        <span className={cn(dailyChange >= 0 ? "text-green-400" : "text-red-400")}>{dailyChange.toFixed(2)}%</span>
                    </div>
                    <span className="block text-lg font-bold">{ask.toFixed(5)}</span>
                </button>
            </div>

            <div className="flex items-center justify-between bg-card rounded-md p-1">
                <Button variant="ghost" className="text-muted-foreground h-full p-2" onClick={(e) => { e.stopPropagation(); setQuantity((q: number) => Math.max(1, q - 1)); }}>
                    <Minus size={16} />
                </Button>
                <div className="text-center">
                    <span className="text-base font-semibold">{quantity}</span>
                    <div className="text-[10px] text-muted-foreground">Lot ({`≈ $${usdValue}`})</div>
                </div>
                <Button variant="ghost" className="text-muted-foreground h-full p-2" onClick={(e) => { e.stopPropagation(); setQuantity((q: number) => q + 1); }}>
                    <Plus size={16} />
                </Button>
            </div>
        </div>
    );
}

export default function TradeLockerWatchlist({ onSelectSymbol, selectedSymbol }: TradeLockerWatchlistProps) {
  const [activeTab, setActiveTab] = useState("Top Movers");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const { quotes } = usePolygonWebSocket();
  const { watchlistStocks } = useWatchlist();
  const { openPanel } = useDraggablePanelStore();


  const handleSymbolSelect = (symbol: string | null) => {
    onSelectSymbol?.(symbol);
    if (isSearching) {
      setIsSearching(false);
      setSearchQuery("");
    }
  };

  const handleExpand = (instrument: any, quote: any) => {
    openPanel(instrument, quote);
    onSelectSymbol?.(null); // Deselect symbol in watchlist to hide the panel
  }

  const listData = activeTab === 'Favorites' ? watchlistStocks : topMoversData;

  const SearchContent = () => {
    const allInstruments = Object.values(instrumentCategories).flat();
    const filteredInstruments = searchQuery
      ? allInstruments.filter(
          (inst) =>
            inst.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inst.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-border/20">
           <Input
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {searchQuery ? (
             filteredInstruments.map(item => (
              <div
                key={item.symbol}
                className="flex items-center gap-3 px-3 py-2.5 border-b border-border/20 hover:bg-accent/30 cursor-pointer"
                onClick={() => handleSymbolSelect(item.symbol)}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-lg">
                  {getSymbolIcon(item.symbol)}
                </div>
                <div>
                  <div className="font-medium text-foreground">{item.symbol}</div>
                  <div className="text-xs text-muted-foreground">{item.name}</div>
                </div>
              </div>
            ))
          ) : (
            <Accordion type="multiple" className="w-full">
              {Object.entries(instrumentCategories).map(([category, instruments]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                return (
                  <AccordionItem value={category} key={category} className="border-b border-border/20">
                    <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-accent/30">
                      <div className="flex items-center gap-2">
                        <Icon size={16} />
                        <span>{category}</span>
                        <Badge variant="secondary">{instruments.length}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-secondary/20">
                      {instruments.map(item => (
                        <div 
                          key={item.symbol}
                          className="pl-12 pr-3 py-2.5 border-t border-border/20 hover:bg-accent/30 cursor-pointer"
                          onClick={() => handleSymbolSelect(item.symbol)}
                        >
                          <div className="font-medium text-foreground">{item.symbol}</div>
                          <div className="text-xs text-muted-foreground">{item.name}</div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </div>
    );
  };
  
  const WatchlistContent = () => (
    <>
      <div className="px-3 py-2 border-b border-border/20 bg-muted/20">
        <div className="grid grid-cols-10 gap-2 text-xs font-medium text-muted-foreground">
          <div className="col-span-4">Symbol</div>
          <div className="col-span-2 text-right">Daily</div>
          <div className="col-span-2 text-right">Weekly</div>
          <div className="col-span-2 text-right">Monthly</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {listData.map((item) => {
          const isSelected = selectedSymbol === item.symbol;
          const quote = quotes.get(item.symbol);
          const mockData = mockInstrumentData.find(i => i.symbol === item.symbol);
          const dailyChange = quote ? quote.changePercent : mockData?.daily || 0;
          const weeklyChange = mockData?.weekly || 0;
          const monthlyChange = mockData?.monthly || 0;
          const high = quote?.ask || mockData?.high || 0;
          const low = quote?.bid || mockData?.low || 0;

          return (
            <div
              key={item.symbol}
              className={cn(
                "border-b border-border/20 transition-colors group",
                selectedSymbol === item.symbol ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-accent/30 cursor-pointer"
              )}
              onClick={() => handleSymbolSelect(item.symbol)}
            >
              {isSelected ? (
                <ExpandedTradePanel instrument={item} quote={quote} quantity={tradeQuantity} setQuantity={setTradeQuantity} onExpand={() => handleExpand(item, quote)}/>
              ) : (
                <div className="grid grid-cols-10 gap-2 items-center px-3 py-2.5">
                    <div className="col-span-4 flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-lg">
                          {getSymbolIcon(item.symbol)}
                        </div>
                        <div>
                        <div className="font-medium text-foreground">{item.symbol}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                            H: {high.toFixed(2)} L: {low.toFixed(2)}
                        </div>
                        </div>
                    </div>
                    <div className="col-span-2 text-right"><ChangeIndicator value={dailyChange} /></div>
                    <div className="col-span-2 text-right"><ChangeIndicator value={weeklyChange} /></div>
                    <div className="col-span-2 text-right"><ChangeIndicator value={monthlyChange} /></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="h-full bg-card border-l border-border/30 flex flex-col text-sm font-sans">
      <div className="p-3 border-b border-border/30">
        <div className="flex items-center bg-secondary/50 rounded-lg p-1">
          <Button
            onClick={() => { setActiveTab("Favorites"); setIsSearching(false); }}
            variant={activeTab === "Favorites" ? "secondary" : "ghost"}
            className="flex-1 h-8 text-xs"
          >
            <Star size={14} className="mr-2" />
            Favorites
          </Button>
          <Button
            onClick={() => { setActiveTab("Top Movers"); setIsSearching(false); }}
            variant={activeTab === "Top Movers" ? "secondary" : "ghost"}
            className="flex-1 h-8 text-xs"
          >
            <Flame size={14} className="mr-2" />
            Top Movers
          </Button>
          <Button 
            variant={isSearching ? "secondary" : "ghost"}
            size="icon" 
            className="h-8 w-8"
            onClick={() => setIsSearching(!isSearching)}
          >
            <Search size={14} />
          </Button>
        </div>
      </div>
      
      {isSearching ? <SearchContent /> : <WatchlistContent />}
      
    </div>
  );
}