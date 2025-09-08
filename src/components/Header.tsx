import { useState } from "react";
import { Search, Bell, RefreshCw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
  title: string;
  subtitle: string;
  breadcrumb?: string[];
}

export default function Header({ 
  onRefresh, 
  isLoading = false, 
  title, 
  subtitle,
  breadcrumb 
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const isMobile = useIsMobile();

  return (
    <header className="bg-background py-6 px-4 md:px-8 border-b border-border animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {breadcrumb && (
            <nav className="flex items-center text-sm text-muted-foreground mb-2">
              {breadcrumb.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className={index === breadcrumb.length - 1 ? "text-foreground" : ""}>
                    {item}
                  </span>
                  {index < breadcrumb.length - 1 && (
                    <ChevronRight size={14} className="mx-2" />
                  )}
                </div>
              ))}
            </nav>
          )}
          <h1 className="text-2xl font-semibold text-foreground mb-1">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className={cn(
                "h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors bg-secondary hover:bg-secondary/80",
                isLoading && "animate-pulse"
              )}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
          )}
          
          <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors bg-secondary hover:bg-secondary/80 relative">
            <Bell size={16} />
            <span className="absolute top-1 right-2 h-2 w-2 rounded-full bg-primary"></span>
          </button>

          <div className="h-9 relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 h-full rounded-full text-sm bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors w-[220px] md:w-[280px]"
            />
          </div>
        </div>
      </div>
    </header>
  );
}