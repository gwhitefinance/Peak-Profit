import { useState } from "react";
import { Clock, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TimeframePopupProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const timeframeGroups = {
  "Seconds": [
    { value: "1s", label: "1 Second" },
    { value: "5s", label: "5 Seconds" },
    { value: "15s", label: "15 Seconds" },
    { value: "30s", label: "30 Seconds" }
  ],
  "Minutes": [
    { value: "1m", label: "1 Minute" },
    { value: "5m", label: "5 Minutes" },
    { value: "15m", label: "15 Minutes" },
    { value: "30m", label: "30 Minutes" }
  ],
  "Hours": [
    { value: "1h", label: "1 Hour" },
    { value: "2h", label: "2 Hours" },
    { value: "4h", label: "4 Hours" },
    { value: "6h", label: "6 Hours" },
    { value: "12h", label: "12 Hours" }
  ],
  "Days & Weeks": [
    { value: "1D", label: "1 Day" },
    { value: "3D", label: "3 Days" },
    { value: "1W", label: "1 Week" }
  ],
  "Months & Years": [
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" }
  ]
};

const popularTimeframes = ["1m", "5m", "15m", "1h", "4h", "1D", "1W", "1M"];

export default function TimeframeDropdown({ selectedTimeframe, onTimeframeChange }: TimeframePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState(selectedTimeframe);

  // Update temp selection when props change
  const handleOpen = () => {
    setTempSelected(selectedTimeframe);
    setIsOpen(true);
  };

  const handleTimeframeSelect = (timeframe: string) => {
    setTempSelected(timeframe);
    // Don't immediately update the chart - wait for Apply button
  };

  const handleApply = () => {
    if (tempSelected !== selectedTimeframe) {
      onTimeframeChange(tempSelected);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedTimeframe);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="outline"
        className="min-w-[100px] h-8 px-3 bg-background border-border/50 hover:bg-accent transition-all"
      >
        <Clock size={14} className="mr-2 text-muted-foreground" />
        <span className="font-medium">{selectedTimeframe}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-4xl max-h-[85vh] overflow-hidden"
          aria-describedby="timeframe-description"
        >
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Clock size={20} />
              Select Chart Timeframe
            </DialogTitle>
            <p id="timeframe-description" className="text-sm text-muted-foreground">
              Choose a timeframe for your trading chart. Click on any timeframe to preview, then apply your selection.
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Popular Timeframes */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Popular
              </h3>
              <div className="grid grid-cols-8 gap-2">
                {popularTimeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => handleTimeframeSelect(timeframe)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 relative",
                      tempSelected === timeframe
                        ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                        : "bg-card hover:bg-accent border-border hover:border-primary/50 hover:scale-102"
                    )}
                  >
                    {timeframe}
                    {tempSelected === timeframe && (
                      <Check size={14} className="absolute top-1 right-1 text-primary-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* All Timeframes by Category */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(timeframeGroups).map(([groupName, timeframes]) => (
                <div key={groupName}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    {groupName}
                  </h3>
                  <div className="grid grid-cols-6 gap-2">
                    {timeframes.map((tf) => (
                      <button
                        key={tf.value}
                        onClick={() => handleTimeframeSelect(tf.value)}
                        className={cn(
                          "px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 relative text-left",
                          tempSelected === tf.value
                            ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                            : "bg-card hover:bg-accent border-border hover:border-primary/50 hover:scale-102"
                        )}
                      >
                        <div className="font-bold">{tf.value}</div>
                        <div className="text-xs opacity-75">{tf.label}</div>
                        {tempSelected === tf.value && (
                          <Check size={14} className="absolute top-1 right-1 text-primary-foreground" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Selected: <span className="font-medium text-foreground">{tempSelected}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleApply}>
                Apply Timeframe
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}