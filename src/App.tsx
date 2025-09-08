import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Payouts from "./pages/Payouts";
import Watchlist from "./pages/Watchlist";
import AccountStats from "./pages/AccountStats";
import Trading from "./pages/Trading";
import FAQ from "./pages/FAQ";
import Settings from "./pages/Settings";
import TradeJournal from "./pages/TradeJournal"; // Import the new page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/payouts" element={<Payouts />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/account-stats" element={<AccountStats />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tradejournal" element={<TradeJournal />} /> {/* Add this route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;