import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CandlestickChart, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartStylePickerProps {
  currentStyle: string;
  onStyleChange: (style: string) => void;
}

const chartStyles = [
  { id: "1", name: "Candles" },
  { id: "9", name: "Hollow Candles" },
  { id: "0", name: "Bars" },
  { id: "3", name: "Line" },
  { id: "2", name: "Line with Markers" },
  { id: "4", name: "Step Line" },
  { id: "5", name: "Area" },
  { id: "7", name: "Baseline" },
];

export default function ChartStylePicker({ currentStyle, onStyleChange }: ChartStylePickerProps) {
  const currentStyleName = chartStyles.find(s => s.id === currentStyle)?.name || "Candles";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 bg-background border-border/50 hover:bg-accent transition-all"
        >
          <CandlestickChart size={14} className="mr-2 text-muted-foreground" />
          <span className="text-xs">{currentStyleName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {chartStyles.map((style) => (
          <DropdownMenuItem
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            className="flex justify-between"
          >
            {style.name}
            {currentStyle === style.id && <Check size={14} className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}