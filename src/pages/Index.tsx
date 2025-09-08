import { useState } from "react";
import { useStats } from "@/hooks/useStats";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import AccountPerformanceChart from "@/components/AccountPerformanceChart";
import TradingLogs from "@/components/TradingLogs";
import { CreditCard, PieChart, BarChart, DollarSign } from "lucide-react";

export default function Index() {
  const { 
    loading, 
    stats, 
    performanceData, 
    logs, 
    refreshData 
  } = useStats();
  
  // Format large numbers for display
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${value.toFixed(2)}`;
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          onRefresh={refreshData} 
          isLoading={loading}
          title="Dashboard"
          subtitle={`Your account insights for ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatsCard 
                title="Account Balance" 
                value={formatCurrency(stats.balance)} 
                change={stats.dailyChange} 
                icon={<CreditCard size={20} className="text-chart-blue" />}
                colorClass="from-blue-500/20 to-blue-600/5"
                animationDelay="0ms"
              />
              
              <StatsCard 
                title="Account Equity" 
                value={formatCurrency(stats.equity)} 
                change={stats.dailyChange} 
                icon={<PieChart size={20} className="text-chart-green" />}
                colorClass="from-green-500/20 to-green-600/5"
                animationDelay="50ms"
              />
              
              <StatsCard 
                title="Overall Profit & Loss" 
                value={formatCurrency(stats.profitLoss)} 
                change={stats.dailyChange} 
                icon={<BarChart size={20} className="text-chart-purple" />}
                colorClass="from-purple-500/20 to-purple-600/5"
                animationDelay="100ms"
              />
              
              <StatsCard 
                title="Account Size" 
                value={formatCurrency(stats.accountSize)} 
                change={stats.dailyChange} 
                icon={<DollarSign size={20} className="text-chart-yellow" />}
                colorClass="from-yellow-500/20 to-yellow-600/5"
                animationDelay="150ms"
              />
            </div>
            
            <AccountPerformanceChart data={performanceData} />
            
            <TradingLogs logs={logs} />
          </div>
        </main>
      </div>
    </div>
  );
}