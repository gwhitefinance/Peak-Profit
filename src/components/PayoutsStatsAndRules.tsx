import { useState } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, Hourglass, Shield, TrendingUp, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PayoutsStatsAndRulesProps {
  currentBalance: number;
  pendingProfits: number;
  kycRequired: boolean;
}

export default function PayoutsStatsAndRules({
  currentBalance,
  pendingProfits,
  kycRequired,
}: PayoutsStatsAndRulesProps) {
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className={cn(
          "p-6 sm:p-8 rounded-2xl",
          "bg-gradient-to-br from-indigo-900/40 to-slate-900"
        )}>
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
            <div>
              <p className="text-muted-foreground text-sm">Available for Payout</p>
              <p className="text-4xl font-bold tracking-tight text-primary mt-2">{formatCurrency(currentBalance)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-muted-foreground text-sm">Next payout date: <span className="font-semibold text-foreground">Sep 25, 2025</span></p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="payout-amount">Payout Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-muted-foreground text-lg">$</span>
                <Input className="w-full bg-background/50 border-border rounded-lg py-3 pl-8 pr-4 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors" id="payout-amount" name="payout-amount" placeholder="0.00" type="number" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="payout-method">Payout Method</Label>
              <Select>
                <SelectTrigger className="w-full bg-background/50 border-border rounded-lg py-3 px-4 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                  <SelectValue placeholder="Select a payout method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer (ending in •••• 5678)</SelectItem>
                  <SelectItem value="crypto">Crypto (BTC Address: 1A1z...w1q)</SelectItem>
                  <SelectItem value="deel">Deel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full text-md py-3 px-5 flex items-center justify-center gap-2">
              <DollarSign size={20} />
              Request Payout
            </Button>
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="bg-secondary/50 p-6 rounded-2xl">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
            <TrendingUp size={20} className="text-green-400" />Pending Profits
          </h3>
          <p className="text-3xl font-bold tracking-tight text-green-400">{formatCurrency(pendingProfits)}</p>
          <p className="text-muted-foreground text-sm mt-1">Pending from last trading cycle</p>
          <div className="w-full bg-border rounded-full h-2 mt-4">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </Card>

        {kycRequired ? (
          <Card className="p-6 rounded-2xl flex flex-col items-center text-left"
                style={{
                  background: 'linear-gradient(145deg, #2D4059, #1E2533)', 
                  color: '#CBD5E1', 
                  border: '1px solid #475569', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
                }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-400/10 p-2 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-yellow-300" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">KYC Verification</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-5">
              To unlock all features, including withdrawals, please complete your KYC verification.
            </p>
            <Button className="w-full py-3 px-5 rounded-full text-md font-bold text-white shadow-lg bg-primary hover:bg-white hover:text-black">
              Complete KYC
            </Button>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 rounded-2xl flex flex-col items-start border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Shield size={20} className="text-yellow-300" />
              <h3 className="font-semibold text-lg text-foreground">Verify KYC</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-5">To unlock all features, including withdrawals, please complete your KYC verification.</p>
            <Button variant="outline" className={cn("mt-auto w-full flex items-center justify-center gap-2", "bg-white text-slate-900 font-bold hover:bg-black/90","rounded-full transition-colors w-full")}>
              <Verified size={16} />
              Complete KYC
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}