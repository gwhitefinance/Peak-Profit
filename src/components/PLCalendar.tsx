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

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 flex-1">
            {calendarDays.map((dayObj, index) => {
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth() + 1;
              const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
              const pnl = dayObj.isCurrentMonth ? pnlDataByDate.get(dateKey) : undefined;
              const isToday = new Date().toDateString() === new Date(year, month - 1, dayObj.day).toDateString();

              return (
                <div
                  key={index}
                  className={cn(
                    "h-full flex flex-col items-center justify-start p-1 rounded-md transition-all duration-200 cursor-pointer hover:bg-accent/50 border",
                    dayObj.isCurrentMonth ? "border-transparent" : "border-transparent",
                    pnl !== undefined 
                      ? (pnl > 0 ? "bg-green-500/10" : pnl < 0 ? "bg-red-500/10" : "bg-blue-500/10") 
                      : "bg-transparent",
                    isToday && dayObj.isCurrentMonth && "border-primary"
                  )}
                >
                  <span className={cn(
                    "text-xs font-semibold mb-1", 
                    dayObj.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/30'
                  )}>
                    {dayObj.day}
                  </span>
                  {pnl !== undefined && dayObj.isCurrentMonth && (
                     <span className={cn(
                      "text-xs font-bold", 
                      pnl > 0 ? "text-green-500" : pnl < 0 ? "text-red-500" : "text-blue-400"
                     )}>
                      {pnl > 0 ? `+$${pnl}` : pnl < 0 ? `-$${Math.abs(pnl)}` : `$${pnl}`}
                     </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-2 flex-1 items-stretch">
          {monthNames.map((monthName, index) => {
            const year = currentDate.getFullYear();
            const monthKey = `${year}-${String(index + 1).padStart(2, '0')}`;
            const monthlyPnl = monthlyPnlData.get(monthKey);
            const isPositive = (monthlyPnl || 0) > 0;
            const hasData = monthlyPnl !== undefined;

            return (
              <div 
                key={monthName}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 cursor-pointer text-center",
                  hasData 
                    ? (isPositive ? "bg-green-500/10 hover:bg-green-500/20" : "bg-red-500/10 hover:bg-red-500/20") 
                    : "bg-muted/10 hover:bg-muted/20",
                )}
              >
                <div className="text-sm font-medium text-foreground mb-1">{monthName.substring(0, 3)}</div>
                {hasData ? (
                  <div className={cn(
                    "text-sm font-bold", 
                    isPositive ? "text-green-500" : "text-red-500"
                  )}>
                    {isPositive ? `+$${monthlyPnl}` : `-$${Math.abs(monthlyPnl || 0)}`}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">--</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}