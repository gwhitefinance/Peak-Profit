import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DateRangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyRange: (startDate: Date, endDate: Date) => void;
}

export default function DateRangeModal({ open, onOpenChange, onApplyRange }: DateRangeModalProps) {
  const [activeTab, setActiveTab] = useState("date");
  const [startDate, setStartDate] = useState<Date>(new Date(2025, 7, 26)); // Aug 26, 2025
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  const handleApply = () => {
    // Combine date and time
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const finalStartDate = new Date(startDate);
    finalStartDate.setHours(startHour, startMin, 0, 0);
    
    const finalEndDate = new Date(endDate);
    finalEndDate.setHours(endHour, endMin, 59, 999);
    
    onApplyRange(finalStartDate, finalEndDate);
    onOpenChange(false);
  };

  const handleQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-background border border-border">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b border-border flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-medium">Go to</DialogTitle>
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
          <TabsList className="grid w-full grid-cols-2 bg-muted/20 p-0 h-auto">
            <TabsTrigger 
              value="date" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none py-3"
            >
              Date
            </TabsTrigger>
            <TabsTrigger 
              value="custom-range" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none py-3"
            >
              Custom range
            </TabsTrigger>
          </TabsList>

          <TabsContent value="date" className="p-4 space-y-4 m-0">
            {/* Date Input */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={format(startDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    if (!isNaN(newDate.getTime())) {
                      setStartDate(newDate);
                    }
                  }}
                  className="border-2 border-primary"
                />
              </div>
              <Button variant="outline" size="sm" className="px-3">
                <CalendarIcon size={16} />
              </Button>
              <div className="flex items-center gap-1">
                <Input
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-16 text-center"
                  type="time"
                />
                <Clock size={16} className="text-muted-foreground" />
              </div>
            </div>

            {/* Calendar */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                className={cn("rounded-md border pointer-events-auto")}
                classNames={{
                  day_selected: "bg-foreground text-background hover:bg-foreground/90",
                  day_today: "bg-accent text-accent-foreground"
                }}
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleQuickRange(1)}>
                1D
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickRange(7)}>
                1W
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickRange(30)}>
                1M
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="custom-range" className="p-4 space-y-4 m-0">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <div className="flex gap-2">
                <Input
                  value={format(startDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    if (!isNaN(newDate.getTime())) {
                      setStartDate(newDate);
                    }
                  }}
                  className="flex-1"
                  type="date"
                />
                <Input
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-20"
                  type="time"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <div className="flex gap-2">
                <Input
                  value={format(endDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    if (!isNaN(newDate.getTime())) {
                      setEndDate(newDate);
                    }
                  }}
                  className="flex-1"
                  type="date"
                />
                <Input
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-20"
                  type="time"
                />
              </div>
            </div>

            {/* Quick Range Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleQuickRange(1)}>
                1D
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickRange(7)}>
                1W
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickRange(30)}>
                1M
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickRange(365)}>
                1Y
              </Button>
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
            onClick={handleApply}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Go to
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}