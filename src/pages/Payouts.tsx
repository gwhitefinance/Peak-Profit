import Sidebar from "@/components/Sidebar";
import PayoutsTable from "@/components/PayoutsTable";
import { tradingChallenges } from "@/lib/mockData";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, Hourglass, Shield, Check, PlusCircle, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import PayoutsStatsAndRules from "@/components/PayoutsStatsAndRules";

// Mock data for the new Payouts page layout
const payoutsData = {
  currentBalance: 10250.00,
  pendingProfits: 1500.00,
  kycRequired: false, // Setting to false since the design shows verified state
  payoutRules: [
    { rule: "Minimum withdrawal", value: "$100" },
    { rule: "Maximum withdrawal", value: "$5,000" },
    { rule: "Frequency", value: "One request per week" },
  ],
  withdrawalHistory: [
    { date: "Sep 1, 2025", amount: 1200.00, method: "Bank Transfer", status: "Paid" as const, transactionId: "TXN123456789" },
    { date: "Aug 25, 2025", amount: 1500.00, method: "Crypto (USDC)", status: "Pending" as const, transactionId: "TXN987654321" },
    { date: "Aug 18, 2025", amount: 900.00, method: "Bank Transfer", status: "Paid" as const, transactionId: "TXN543216789" },
    { date: "Aug 11, 2025", amount: 5000.00, method: "Crypto (USDC)", status: "Rejected" as const, transactionId: "TXN123987456" },
    { date: "Aug 4, 2025", amount: 2100.00, method: "Bank Transfer", status: "Paid" as const, transactionId: "TXN654789123" },
  ],
};

const PayoutsHeader = () => (
  <header className="py-6 px-4 md:px-8 border-b border-border animate-fade-in">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Payouts</h2>
        <p className="text-muted-foreground">Manage your earnings and withdrawals.</p>
      </div>
      <div className="flex items-center space-x-4">
        
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="flex items-center space-x-2 p-2 rounded-lg bg-secondary">
          <Avatar>
            <AvatarImage src="/avatars/01.png" alt="User" />
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm text-foreground">Alex Turner</div>
            <div className="text-xs text-muted-foreground">alex.turner@email.com</div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default function Payouts() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-screen-2xl mx-auto">
            <PayoutsHeader />
            <div className="mb-8 mt-8">
              <PayoutsStatsAndRules 
                currentBalance={payoutsData.currentBalance}
                pendingProfits={payoutsData.pendingProfits}
                kycRequired={payoutsData.kycRequired}
              />
            </div>
            <PayoutsTable withdrawals={payoutsData.withdrawalHistory} />
          </div>
        </main>
      </div>
    </div>
  );
}