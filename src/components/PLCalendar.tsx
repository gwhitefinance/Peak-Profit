// src/components/PLCalendar.tsx
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";

interface PLCalendarData {
  date: string;
  pnl: number;
}

interface PLCalendarProps {
  data: PLCalendarData[];
}

export default function PLCalendar({ data }: PLCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"daily" | "monthly">("daily");

  const pnlDataByDate = useMemo(() => {
    return data.reduce((acc, curr) => {
      acc.set(curr.date, curr.pnl);
      return acc;
    }, new Map<string, number>());
  }, [data]);

  const monthlyPnlData = useMemo(() => {
    const monthlyData = new Map<string, number>();
    data.forEach(entry => {
      const monthKey = entry.date.substring(0, 7); // 'YYYY-MM'
      const currentPnl = monthlyData.get(monthKey) || 0;
      monthlyData.set(monthKey, currentPnl + entry.pnl);
    });
    return monthlyData;
  }, [data]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true });
    }

    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length + 1;
    for (let i = 1; i < remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(1);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setFullYear(prev.getFullYear() - 1);
      } else {
        newDate.setFullYear(prev.getFullYear() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const calendarDays = generateCalendarDays();

  return (
    <div className="rounded-lg bg-card border border-border p-6 w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => view === 'daily' ? navigateMonth('prev') : navigateYear('prev')} 
            className="p-1.5 hover:bg-accent rounded-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h3 className="text-foreground text-lg font-semibold w-32 text-center">
            {view === 'daily' ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` : currentDate.getFullYear()}
          </h3>
          <button 
            onClick={() => view === 'daily' ? navigateMonth('next') : navigateYear('next')} 
            className="p-1.5 hover:bg-accent rounded-md transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="flex gap-1 bg-secondary p-1 rounded-md">
          <button 
            onClick={() => setView("daily")}
            className={cn("px-3 py-1 rounded text-sm transition-colors", view === 'daily' ? 'bg-background shadow-sm text-foreground font-semibold' : 'text-muted-foreground hover:bg-background/50')}
          >
            Daily
          </button>
          <button 
             onClick={() => setView("monthly")}
             className={cn("px-3 py-1 rounded text-sm transition-colors", view === 'monthly' ? 'bg-background shadow-sm text-foreground font-semibold' : 'text-muted-foreground hover:bg-background/50')}
          >
            Monthly
          </button>
        </div>
      </div>

      {view === 'daily' ? (
        <>
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayName, i) => (
              <div key={i} className="text-center text-muted-foreground text-xs font-bold py-2">
                {dayName}
              </div>
            ))}
          </div>

          {/* Enhanced Calendar Grid - Daily Box Style */}
          <div className="grid grid-cols-7 gap-2 flex-1">
            {calendarDays.map((dayObj, index) => {
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth() + 1;
              const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
              const pnl = dayObj.isCurrentMonth ? pnlDataByDate.get(dateKey) : undefined;
              const isToday = new Date().toDateString() === new Date(year, month - 1, dayObj.day).toDateString();
              const hasData = pnl !== undefined && dayObj.isCurrentMonth;

              return (
                <div
                  key={index}
                  className={cn(
                    "aspect-square flex flex-col justify-between p-2 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-105 group relative",
                    dayObj.isCurrentMonth 
                      ? "border-border bg-card hover:bg-accent/30" 
                      : "border-muted/30 bg-muted/10",
                    hasData && pnl > 0 && "bg-green-500/10 border-green-500/30 hover:bg-green-500/20",
                    hasData && pnl < 0 && "bg-red-500/10 border-red-500/30 hover:bg-red-500/20",
                    hasData && pnl === 0 && "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20",
                    isToday && dayObj.isCurrentMonth && "ring-2 ring-primary/50"
                  )}
                >
                  <div className={cn(
                    "text-sm font-bold text-center", 
                    dayObj.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/40',
                    isToday && 'text-primary'
                  )}>
                    {dayObj.day}
                  </div>
                  
                  {hasData && (
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "text-xs font-bold leading-none text-center", 
                        pnl > 0 ? "text-green-400" : pnl < 0 ? "text-red-400" : "text-blue-400"
                      )}>
                        {pnl > 0 ? '+' : ''}${Math.abs(pnl) >= 1000 ? `${(pnl/1000).toFixed(1)}k` : pnl.toFixed(0)}
                      </div>
                      {Math.abs(pnl) >= 100 && (
                        <div className={cn(
                          "w-2 h-1 rounded-full mt-1",
                          pnl > 0 ? "bg-green-400" : "bg-red-400"
                        )} />
                      )}
                    </div>
                  )}
                  
                  {/* Enhanced Tooltip */}
                  {hasData && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                      <div className="font-semibold">{dateKey}</div>
                      <div className={cn(
                        "font-bold text-lg",
                        pnl > 0 ? "text-green-400" : pnl < 0 ? "text-red-400" : "text-blue-400"
                      )}>
                        {pnl > 0 ? '+' : ''}${pnl.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {pnl > 0 ? 'Profitable Day' : pnl < 0 ? 'Loss Day' : 'Breakeven Day'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="space-y-6 flex-1">
          {/* Monthly Summary Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-secondary/20 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {Array.from(monthlyPnlData.values()).reduce((sum, pnl) => sum + pnl, 0).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Year Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Array.from(monthlyPnlData.values()).filter(pnl => pnl > 0).length}
              </div>
              <div className="text-xs text-muted-foreground">Profitable Months</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.max(...Array.from(monthlyPnlData.values()), 0).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Best Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {Math.min(...Array.from(monthlyPnlData.values()), 0).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Worst Month</div>
            </div>
          </div>
          
          {/* Monthly Grid */}
          <div className="grid grid-cols-3 gap-4 flex-1">
            {monthNames.map((monthName, index) => {
              const year = currentDate.getFullYear();
              const monthKey = `${year}-${String(index + 1).padStart(2, '0')}`;
              const monthlyPnl = monthlyPnlData.get(monthKey);
              const isPositive = (monthlyPnl || 0) > 0;
              const hasData = monthlyPnl !== undefined;
              const currentMonth = new Date().getMonth() === index && new Date().getFullYear() === year;

              return (
                <div 
                  key={monthName}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 cursor-pointer text-center hover:scale-105 group relative",
                    hasData 
                      ? (isPositive ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20" : "bg-red-500/10 border-red-500/30 hover:bg-red-500/20") 
                      : "bg-muted/10 border-muted/30 hover:bg-muted/20",
                    currentMonth && "ring-2 ring-primary/50"
                  )}
                  onClick={() => setCurrentDate(new Date(year, index, 1))}
                >
                  <div className="text-lg font-semibold text-foreground mb-2">{monthName}</div>
                  {hasData ? (
                    <div className={cn(
                      "text-xl font-bold", 
                      isPositive ? "text-green-400" : "text-red-400"
                    )}>
                      {isPositive ? '+' : ''}${Math.abs(monthlyPnl).toFixed(0)}
                    </div>
                  ) : (
                    <div className="text-xl text-muted-foreground">--</div>
                  )}
                  
                  {/* Performance Indicator */}
                  {hasData && (
                    <div className={cn(
                      "w-full h-2 rounded-full mt-2",
                      isPositive ? "bg-green-400/20" : "bg-red-400/20"
                    )}>
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isPositive ? "bg-green-400" : "bg-red-400"
                        )}
                        style={{ 
                          width: `${Math.min(Math.abs(monthlyPnl) / Math.max(...Array.from(monthlyPnlData.values()).map(v => Math.abs(v)), 1) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Hover tooltip for monthly details */}
                  {hasData && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                      <div className="font-semibold">{monthName} {year}</div>
                      <div className={cn(
                        "font-bold text-lg",
                        isPositive ? "text-green-400" : "text-red-400"
                      )}>
                        {isPositive ? '+' : ''}${monthlyPnl.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Click to view daily breakdown
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}