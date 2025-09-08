import { Button } from "@/components/ui/button";
import { Bell, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function PayoutsHeader() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Payouts</h2>
          <p className="text-muted-foreground">Manage your earnings and withdrawals.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Request Withdrawal
          </Button>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-secondary">
            <Avatar>
              <AvatarImage src="/avatars/01.png" alt="User" />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-sm text-foreground">Peak Profit</div>
              <div className="text-xs text-muted-foreground">peakprofit@email.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}