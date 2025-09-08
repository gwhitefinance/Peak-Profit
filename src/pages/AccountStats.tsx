// src/pages/AccountStats.tsx
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AccountStatsGrid from "@/components/AccountStatsGrid";
import PLCalendar from "@/components/PLCalendar";
import PLPieChart from "@/components/PLPieChart";
import { accountStatistics, plCalendarData, plPieChartData } from "@/lib/mockData";

export default function AccountStats() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          title="Account Statistics"
          subtitle={`Your trading performance for ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            {/* Account Stats Grid */}
            <AccountStatsGrid stats={accountStatistics} />
            
            {/* P.L Calendar and Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <PLCalendar data={plCalendarData} />
              <PLPieChart data={plPieChartData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}